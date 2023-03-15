import { atomWithStorage } from "jotai/utils";

export const autoPlayAtom = atomWithStorage("auto-play", false);
export const autoPlayNextAtom = atomWithStorage("auto-play-next", false);

export const tokenAtom = atomWithStorage("token", "guest");
export const likedSongAtom = atomWithStorage<string[]>("liked", []);
