export type { Music } from "@15s-music/server/src/entry";

let audio: HTMLAudioElement | null = null;
export const playMusic = (blob: Blob): Promise<HTMLAudioElement | null> => {
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
  }
  audio.src = URL.createObjectURL(blob);
  return new Promise(async (res, rej) => {
    await audio?.play().catch(rej);
    res(audio);
  });
};
