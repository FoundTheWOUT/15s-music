import OSS from "ali-oss";
import { DataSource } from "typeorm";
import { createAppDataSource } from "./data-source";

let context: AppContext | null = null;
class AppContext {
  dbSource: DataSource;
  ossClient: OSS;
  constructor() {
    this.ossClient = new OSS({
      region: process.env.Bucket_Region,
      accessKeyId: process.env.Ali_AccessKey_Id,
      accessKeySecret: process.env.Ali_AccessKey_Secret,
      bucket: process.env.Bucket,
    });
    return this;
  }

  async setup() {
    this.dbSource = await createAppDataSource().initialize();
  }
}

export const getAppContext = async () => {
  if (!context) {
    context = new AppContext();
    await context.setup();
  }
  return context;
};
