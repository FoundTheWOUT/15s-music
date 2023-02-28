import { Music } from "./entry/Music";
import { DataSource } from "typeorm";
import { log } from "./utils";

export const createAppDataSource = () => {
  const { DatabaseUser, DatabasePW, DatabaseHost, DatabaseName, DatabasePort } =
    process.env;
  log(`connect to ${DatabaseHost}:${DatabasePort}`);
  return new DataSource({
    type: "postgres",
    host: DatabaseHost,
    port: parseInt(DatabasePort),
    username: DatabaseUser,
    password: DatabasePW ?? "",
    database: DatabaseName,
    synchronize: true,
    logging: true,
    entities: [Music],
    subscribers: [],
    migrations: [],
  });
};
