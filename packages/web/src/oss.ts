import OSS from "ali-oss";

let client: OSS | null = null;
export const getOSSClient = () => {
  if (client) return client;

  client = new OSS({
    region: "oss-cn-guangzhou",
    accessKeyId: process.env.Ali_AccessKey_Id as string,
    accessKeySecret: process.env.Ali_AccessKey_Secret as string,
    bucket: process.env.Bucket,
  });

  return client;
};
