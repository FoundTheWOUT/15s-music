import express from "express";
import morgan from "morgan";
import multer from "multer";
import cors from "cors";
import OSS from "ali-oss";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { isProd } from "./const";
import { log } from "./utils";
import sharp from "sharp";
import { musicRoute } from "./routes/music";
import { getAppContext } from "./ctx";

const VERSION = process.env.Version;

log("cwd:", process.cwd());
log("version:", VERSION);
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
    const { ossClient, authRoute } = await getAppContext();
    const app = express();

    app
      .use(
        isProd
          ? cors({
              origin: process.env.CORS_ORIGIN,
            })
          : cors()
      )
      .use(express.json())
      .use(express.urlencoded())
      .use(morgan("tiny"))
      .use("/upload", express.static("uploads"))
      .use(authRoute)
      .use(await musicRoute());

    app.get("/ping", (req, rep) => {
      return rep.end("pong");
    });

    app.get("/version", (req, rep) => {
      log("version:", VERSION);
      return rep.end(VERSION);
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

    app.listen(3500);
    console.log("start server at port 3500");
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
