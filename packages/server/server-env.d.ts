declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
    }
  }
}

export {};
