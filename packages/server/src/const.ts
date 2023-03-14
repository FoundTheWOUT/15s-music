export const isProd = process.env.ENVIRONMENT === "prod";
export const VERSION = process.env.Version;
export const ENABLE_OSS = process.env.ENABLE_OSS
  ? process.env.ENABLE_OSS === "true"
    ? true
    : false
  : isProd;
export const ENABLE_HTTPS = process.env.ENABLE_HTTPS
  ? process.env.ENABLE_HTTPS === "true"
    ? true
    : false
  : false;
