import { createAppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import { Music } from "./entry/Music";
import multer from "multer";
import cors from "cors";
import OSS from "ali-oss";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { rmSync } from "fs";
import { v4 as uuidv4 } from "uuid";

const ENV = process.env.ENVIRONMENT ?? "dev";
dotenv.config({ path: resolve(process.cwd(), `.env.${ENV}`) });

const upload = multer({ dest: "uploads/" });

const ossPutAndRemoveLocal = async (
  client: OSS,
  files: Express.Multer.File[]
) => {
  try {
    await Promise.all(
      files.map((file) => client.put(file.filename, resolve(file.path)))
    );
    files.forEach((file) => {
      rmSync(resolve(file.path));
    });
    return Object.fromEntries(
      // return the Map<nanoid(from front_end),new_file_name(from multer)>
      files.map((file) => [file.originalname, file.filename])
    );
  } catch (error) {
    throw error;
  }
};

async function bootstrap() {
  try {
    const source = await createAppDataSource().initialize();
    const app = express();
    const ossClient = new OSS({
      region: "oss-cn-guangzhou",
      accessKeyId: process.env.Ali_AccessKey_Id,
      accessKeySecret: process.env.Ali_AccessKey_Secret,
      bucket: process.env.Bucket,
    });

    app
      .use(express.json())
      .use(express.urlencoded())
      .use(morgan("tiny"))
      .use(cors())
      .use("/upload", express.static("uploads"));

    app.post("/upload", upload.array("file", 20), async function (req, rep) {
      if (!Array.isArray(req.files)) {
        return rep.status(400).send("files is not array.");
      }
      try {
        const fileMap = await ossPutAndRemoveLocal(ossClient, req.files);
        return rep.send(fileMap);
      } catch (error) {
        return rep.status(500).send(error);
      }
    });

    app.post(
      "/upload/song",
      upload.array("file", 20),
      async function (req, rep) {
        // TODO: check music length
        if (!Array.isArray(req.files)) {
          return rep.status(400).send("files is not array.");
        }
        try {
          const fileMap = await ossPutAndRemoveLocal(ossClient, req.files);
          return rep.send(fileMap);
        } catch (error) {
          return rep.status(500).send(error);
        }
      }
    );

    app.post("/music", async function (req, rep) {
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
