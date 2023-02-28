import { atomWithStorage } from "jotai/utils";

export const autoPlayAtom = atomWithStorage(
  "@15s-music/store/auto-play",
  false
);
