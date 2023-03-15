import OSS from "ali-oss";
import crypto from "crypto";
import sharp from "sharp";
import { ENABLE_OSS } from "./const";

export const log = (...args: any) =>
  console.log(
    "%c 15s-music-server ",
    "background-color:#6965db;color:white;padding: 2px 4px; border-radius: 4px;",
    ...args
  );

export function generateFilename(): Promise<string> {
  return new Promise((res, rej) => {
    crypto.randomBytes(16, function (err, raw) {
      if (err) rej(err);
      res(raw.toString("hex"));
    });
  });
}

export const sharpImageToWebp = async (buf: Buffer) => {
  const output = await sharp(buf)
    .resize(200)
    .webp({ lossless: true })
    .toBuffer();
  return output;
};

