// load env
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { ENABLE_HTTPS, ENABLE_OSS, isProd, VERSION } from "./const";
import { log } from "./utils";
import { musicRoute } from "./routes/music";
import { getAppContext } from "./ctx";
import https from "https";
import { readFileSync, createWriteStream } from "fs";
import path from "path";

log("cwd:", process.cwd());
log("version:", VERSION);
log("environment:", isProd ? "production" : "other");
log("enabled oss:", ENABLE_OSS);

const accessLogStream = createWriteStream(
  path.join(process.cwd(), "logs", "access.log"),
  {
    // append mode
    flags: "a",
  }
);

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
      .use(
        morgan(
          "common",
          isProd
            ? {
                stream: accessLogStream,
              }
            : {}
        )
      )
      .use("/uploads", express.static("uploads"))
      .use(await musicRoute());

    app.get("/ping", (req, rep) => {
      return rep.end("pong");
    });

    app.get("/version", (req, rep) => {
      log("version:", VERSION);
      return rep.end(VERSION);
    });

    const PORT = parseInt(process.env.GATEWAY_PORT);
    ENABLE_HTTPS
      ? https
          .createServer(
            {
              key: readFileSync(process.env.SSL_KEY_PATH),
              cert: readFileSync(process.env.SSL_CERT_PATH),
              ca: readFileSync(process.env.SSL_CA_PATH),
            },
            app
          )
          .listen(PORT)
      : app.listen(PORT);
    console.log(`start server at port ${PORT}`);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
