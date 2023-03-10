export const PAGE_SIZE = 36; // factor of 2,4,6
export const isBrowser = typeof window !== "undefined";
export const ENABLE_OSS = process.env.NEXT_PUBLIC_ENABLE_OSS
  ? process.env.NEXT_PUBLIC_ENABLE_OSS === "true"
    ? true
    : false
  : true;
export const STATIC_HOST = ENABLE_OSS
  ? process.env.NEXT_PUBLIC_OSS
  : `${process.env.NEXT_PUBLIC_API_GATE}/uploads`;
