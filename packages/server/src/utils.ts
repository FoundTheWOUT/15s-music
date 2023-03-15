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

// return the Map<nanoid(from front_end),new_file_name(from multer)>
// the new_file_name will store into db. And frontend will concat the value with Static path later.
export const ossPut = async (
  client: OSS,
  files: Express.Multer.File[],
  filenameFormatter?: (name: string) => string
): Promise<Record<string, string>> => {
  try {
    const entry = await Promise.all(
      files.map(async (file) => {
        const [id, filename] = file.originalname.split(":");
        if (ENABLE_OSS) {
          log(`putting ${file.filename} to oss...`);
          await client.put(filename, file.buffer);
        }
        return [id, filename];
      })
    );
    return Object.fromEntries(entry);
  } catch (error) {
    throw error;
  }
};
