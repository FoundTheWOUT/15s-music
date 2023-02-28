declare global {
  namespace NodeJS {
    interface ProcessEnv {
      Ali_AccessKey_Id: string;
      Ali_AccessKey_Secret: string;
      Bucket: string;
    }
  }
}

export {};
