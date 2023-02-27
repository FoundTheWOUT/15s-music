import { AppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import { Music } from "./entry/Music";
import multer from "multer";
import cors from "cors";
import OSS from "ali-oss";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { createReadStream } from "fs";

dotenv.config();

const upload = multer({ dest: "uploads/" });

async function bootstrap() {
  try {
    const source = await AppDataSource.initialize();
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
      console.log(req.files);
      if (!Array.isArray(req.files)) {
        return rep.status(400).send("files is not array.");
      }
      // await Promise.all(
      //   req.files.map((file) =>
      //     ossClient.put(file.fieldname, resolve(file.path))
      //   )
      // );
      // if files not match upload size, return not finished.
      return rep.send(
        Object.fromEntries(
          // return the Map<nanoid(from front_end),new_file_name(from multer)>
          req.files?.map((file) => [file.originalname, file.filename])
        )
      );
    });

    app.post("/music", async function (req, rep) {
      const data = req.body as { musics: Music[] };
      const musicRepository = source.getRepository(Music);
      const musics = data.musics.map((music) => musicRepository.create(music));
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

    app.get("/15s/:src", async function (req, rep) {
      const { src } = req.params;
      const stream = createReadStream(resolve("uploads", src));
      stream.pipe(rep);
      return;
    });

    app.listen(3500);
    console.log("start server at port 3500");
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
