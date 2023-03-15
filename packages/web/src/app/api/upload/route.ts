import { parseBuffer } from "music-metadata";
import sharp from "sharp";
import OSS from "ali-oss";
import { NextResponse } from "next/server";

const sharpImageToWebp = async (buf: Buffer) => {
  const output = await sharp(buf)
    .resize(200)
    .webp({ lossless: true })
    .toBuffer();
  return output;
};

const ossPut = async (
  client: OSS,
  files: { name: string; buffer: Buffer }[]
): Promise<Record<string, string>> => {
  try {
    const entry = await Promise.all(
      files.map(async (file) => {
        const [id, filename] = file.name.split(":");
        // if (ENABLE_OSS) {
        //   log(`putting ${file.filename} to oss...`);
        await client.put(filename, file.buffer);
        // }
        return [id, filename];
      })
    );
    return Object.fromEntries(entry);
  } catch (error) {
    throw error;
  }
};

export async function POST(req: Request) {
  const form = await req.formData();
  const audioFiles = form.getAll("audio");
  const coverFiles = form.getAll("cover");
  const client = new OSS({
    region: process.env.Bucket_Region,
    accessKeyId: process.env.Ali_AccessKey_Id!,
    accessKeySecret: process.env.Ali_AccessKey_Secret!,
    bucket: process.env.Bucket,
  });

  try {
    const cover = await Promise.all(
      coverFiles.map(async (file) => {
        const f = file as File;
        const arrayBuffer = await f.arrayBuffer();

        return {
          name: f.name,
          buffer: await sharpImageToWebp(Buffer.from(arrayBuffer)),
        };
      })
    );

    // check audio length
    // audio is mp3 file.
    const audio = [];
    for (const file of audioFiles) {
      const f = file as File;
      const arrayBuffer = await f.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const meta = await parseBuffer(buffer);
      const duration = Math.floor(meta.format.duration!);
      if (duration > 18) {
        return new Response(
          `Music ${
            meta.common.title ?? ""
          } too long. Uploading ${duration}s, but expect 15s`,
          {
            status: 400,
          }
        );
      }
      audio.push({
        name: f.name,
        buffer,
      });
    }
    // console.log(cover, audio);
    const audioMap = await ossPut(client, audio);
    const coverMap = await ossPut(client, cover);
    return NextResponse.json({
      audio: audioMap,
      cover: coverMap,
    });
  } catch (error) {
    console.log(error);
    return new Response((error as Error).message, { status: 400 });
  }
}
