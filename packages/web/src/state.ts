import { atomWithStorage } from "jotai/utils";

export const autoPlayAtom = atomWithStorage("auto-play", false);

export const tokenAtom = atomWithStorage("token", "");
