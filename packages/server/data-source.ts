import { Music } from "./entry/Music";
import { DataSource } from "typeorm";

export const createAppDataSource = () => {
  const { DatabaseUser, DatabasePW, DatabaseHost, DatabaseName, DatabasePort } =
    process.env;
  return new DataSource({
    type: "postgres",
    host: DatabaseHost,
    port: DatabasePort,
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
