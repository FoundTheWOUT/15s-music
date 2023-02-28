declare global {
  namespace NodeJS {
    interface ProcessEnv {
      Ali_AccessKey_Id: string;
      Ali_AccessKey_Secret: string;
      Bucket: string;
      ENVIRONMENT: string;
      DatabaseName: string;
      DatabaseUser: string;
      DatabasePW: string | undefined;
      DatabaseHost: string;
      DatabasePort: string;
    }
  }
}

export {};
