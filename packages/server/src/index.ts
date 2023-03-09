import { createAppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import { Music } from "./entry/Music";
import multer from "multer";
import cors from "cors";
import OSS from "ali-oss";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";
import { isProd } from "./const";
import { log } from "./utils";
import { auth } from "./middlerware/authentication";
import sharp from "sharp";

log("cwd:", process.cwd());
// dev load .env.dev, prod load .env
const dotenvPath = resolve(process.cwd(), isProd ? ".env" : ".env.dev");
dotenv.config({ path: dotenvPath });

const upload = multer({ dest: "uploads/", storage: multer.memoryStorage() });

const ossPut = async (
  client: OSS,
  files: Express.Multer.File[],
  filenameFormatter?: (name: string) => string
) => {
  try {
    // return the Map<nanoid(from front_end),new_file_name(from multer)>
    const entry = await Promise.all(
      files.map(async (file) => {
        const id = file.originalname;
        const { name } = await client.put(
          filenameFormatter ? filenameFormatter(id) : id,
          file.buffer
        );
        return [id, name];
      })
    );
    return Object.fromEntries(entry);
  } catch (error) {
    throw error;
  }
};

const sharpImageToWebp = async (buf: Buffer) => {
  const output = await sharp(buf)
    .resize(200)
    .webp({ lossless: true })
    .toBuffer();
  return output;
};

async function bootstrap() {
  try {
    const source = await createAppDataSource().initialize();

    const app = express();
    const authRoute = express.Router();
    authRoute.use(auth());

    const ossClient = new OSS({
      region: process.env.Bucket_Region,
      accessKeyId: process.env.Ali_AccessKey_Id,
      accessKeySecret: process.env.Ali_AccessKey_Secret,
      bucket: process.env.Bucket,
    });

    app
      .use(express.json())
      .use(express.urlencoded())
      .use(morgan("tiny"))
      .use("/upload", express.static("uploads"));

    if (isProd) {
      app.use(
        cors({
          origin: process.env.CORS_ORIGIN,
        })
      );
    } else {
      app.use(cors());
    }

    app.use(authRoute);

    app.get("/ping", (req, rep) => {
      return rep.end("pong");
    });

    authRoute.post(
      "/upload/image",
      upload.array("file", 20),
      async function (req, rep) {
        if (!Array.isArray(req.files)) {
          return rep.status(400).send("files is not array.");
        }
        try {
          // sharp image
          const files: Express.Multer.File[] = await Promise.all(
            req.files.map(async (file) => {
              return {
                ...file,
                buffer: await sharpImageToWebp(file.buffer),
              } as Express.Multer.File;
            })
          );
          const fileMap = await ossPut(
            ossClient,
            files,
            (name) => `${name}.webp`
          );
          return rep.send(fileMap);
        } catch (error) {
          log(error);
          return rep.status(500).send(error);
        }
      }
    );

    authRoute.post(
      "/upload/song",
      upload.array("file", 20),
      async function (req, rep) {
        // TODO: check music length
        if (!Array.isArray(req.files)) {
          return rep.status(400).send("files is not array.");
        }
        try {
          const fileMap = await ossPut(ossClient, req.files);
          return rep.send(fileMap);
        } catch (error) {
          log(error);
          return rep.status(500).send(error);
        }
      }
    );

    authRoute.post("/music", async function (req, rep) {
      const data = req.body as { musics: Music[] };
      const musicRepository = source.getRepository(Music);
      const musics = data.musics.map((music) =>
        musicRepository.create({ ...music, uuid: uuidv4() })
      );
      const res = source.getRepository(Music).save(musics);
      return rep.send(res);
    });

    app.get("/music", async function (req, rep) {
      let page = req.query.page;
      let limit = req.query.limit ?? "30";
      if (typeof page !== "string" || typeof limit !== "string") {
        rep.status(400);
        return rep.send("page,limit query is require.");
      }
      const pageNum = parseInt(page);
      const pageLimit = parseInt(limit);
      if (Number.isNaN(pageNum)) {
        rep.status(400);
        return rep.send("page query must be a num.");
      }
      const musicRepository = source.getRepository(Music);

      const musics = await musicRepository
        .createQueryBuilder("music")
        .where("music.censored = true")
        .orderBy("music.createdAt", "DESC")
        .take(pageLimit)
        .skip(pageNum * pageLimit)
        .getMany();

      return rep.send({ total: await musicRepository.count(), musics });
    });

    // all music but with out censor
    app.get("/music/list", async function (req, rep) {
      const page = (req.query.page as string) ?? "0";
      const pageNum = parseInt(page);

      try {
        const musics = await source
          .getRepository(Music)
          .createQueryBuilder("music")
          .orderBy("music.createdAt", "DESC")
          .take(30)
          .skip(pageNum * 30)
          .getMany();
        return rep.send({ musics });
      } catch (error) {
        return rep.end(error);
      }
    });

    app.get("/music/meta", async function (req, rep) {
      const musicRepository = source.getRepository(Music);
      const total = await musicRepository.count();
      return rep.send({
        total,
      });
    });

    app.listen(3500);
    console.log("start server at port 3500");
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
