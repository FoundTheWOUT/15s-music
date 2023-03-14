export type { Music } from "@15s-music/server/src/entry";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;
export const cutAudio = async (
  id: string,
  blob: Blob,
  start: number,
  end: number
) => {
  const {
    default: { createFFmpeg, fetchFile },
  } = await import("@/compiled/ffmpeg.min.js");
  if (!ffmpeg) {
    ffmpeg = createFFmpeg({
      log: true,
      corePath: new URL("ffmpeg-core.js", document.location.origin).href,
      //corePath:new URL('static/js/ffmpeg-core.js', document.location).href
    }) as FFmpeg;
    await ffmpeg.load();
  }
  ffmpeg.FS("writeFile", `${id}-in.mp3`, await fetchFile(blob));
  await ffmpeg.run(
    "-i",
    `${id}-in.mp3`,
    "-codec:a",
    "libmp3lame",
    "-ss",
    start.toString(),
    "-to",
    end.toString(),
    `${id}-out.mp3`
  );
  const data = ffmpeg.FS("readFile", `${id}-out.mp3`);
  return new Blob([data.buffer], { type: "audio/mp3" });
};

export const loadAudioMetaData = (blob: Blob) => {
  return new Promise<any>(async (resolve, reject) => {
    const { default: jsmediatags } = await import("@/compiled/jsmediatags.min");
    jsmediatags.read(blob, {
      onSuccess: function (tag: any) {
        resolve(tag);
        // let image = tag.tags.picture;
        // console.log(tag);
      },
      onError: function (error: unknown) {
        reject(error);
      },
    });
  });
};

export const checkAudioLength = (url: string) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = url;
    const resolver = () => {
      audio.removeEventListener("loadedmetadata", resolver);
      if (audio.duration <= 18) resolve(true);
      resolve(false);
    };
    audio.addEventListener("loadedmetadata", resolver);
    audio.addEventListener("error", reject);
  });
};