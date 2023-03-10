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
import { auth } from "./middleware/authentication";
import { parseFile, parseBuffer } from "music-metadata";

const VERSION = process.env.Version;
const ENABLE_OSS = process.env.ENABLE_OSS
  ? process.env.ENABLE_OSS === "true"
    ? true
    : false
  : isProd;

log("cwd:", process.cwd());
log("version:", VERSION);
log("environment:", isProd ? "production" : "other");
// dev load .env.dev, prod load .env
const dotenvPath = resolve(process.cwd(), isProd ? ".env" : ".env.dev");
dotenv.config({ path: dotenvPath });

const upload = multer({
  storage: ENABLE_OSS
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: "uploads/",
      }),
});

const webpUpload = multer({
  storage: ENABLE_OSS
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: "uploads/",
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `local-${uniqueSuffix}.webp`);
        },
      }),
});

// return the Map<nanoid(from front_end),new_file_name(from multer)>
// the new_file_name will store into db. And frontend will concat the value with Static path later.
const ossPut = async (
  client: OSS,
  files: Express.Multer.File[],
  filenameFormatter?: (name: string) => string
): Promise<Record<string, string>> => {
  try {
    const entry = await Promise.all(
      files.map(async (file) => {
        const id = file.originalname;
        const name = ENABLE_OSS
          ? filenameFormatter
            ? filenameFormatter(id)
            : id
          : file.filename;

        if (ENABLE_OSS) {
          await client.put(name, file.buffer);
        }
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
    const { ossClient } = await getAppContext();
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
      .use("/uploads", express.static("uploads"))
      .use(await musicRoute());

    app.get("/ping", (req, rep) => {
      return rep.end("pong");
    });

    app.get("/version", (req, rep) => {
      log("version:", VERSION);
      return rep.end(VERSION);
    });

    app.post(
      "/upload/image",
      auth({ allowGuest: true }),
      webpUpload.array("file", 20),
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
                buffer: file.buffer && (await sharpImageToWebp(file.buffer)),
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

    app.post(
      "/upload/song",
      auth({ allowGuest: true }),
      upload.array("file", 20),
      async function (req, rep) {
        // TODO: check music length
        if (!Array.isArray(req.files)) {
          return rep.status(400).send("files is not array.");
        }
        try {
          for (const file of req.files) {
            const meta = file.buffer
              ? await parseBuffer(file.buffer)
              : await parseFile(`uploads/${file.filename}`);
            if (meta.format.duration > 18) {
              return rep.status(400).send("Music too long.");
            }
          }
        } catch (error) {
          log(error);
          return rep.status(400).send((error as Error).message);
        }
        try {
          const fileMap = await ossPut(ossClient, req.files);
          return rep.send(fileMap);
        } catch (error) {
          log(error);
          return rep.status(400).send(`Put Music Failed`);
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
