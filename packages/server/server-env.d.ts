declare global {
  namespace NodeJS {
    interface ProcessEnv {
      Version: string;
      Ali_AccessKey_Id: string;
      Ali_AccessKey_Secret: string;
      Bucket: string;
      Bucket_Region: string;
      ENVIRONMENT: string;
      DatabaseName: string;
      DatabaseUser: string;
      DatabasePW: string | undefined;
      DatabaseHost: string;
      DatabasePort: string;
      CORS_ORIGIN: string;
      MASTER_TOKEN: string;
      ENABLE_OSS: string;

      GATEWAY_PORT: string;
      ENABLE_HTTPS: string
    }
  }
}

export {};
