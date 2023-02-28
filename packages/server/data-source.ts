import { Music } from "./entry/Music";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "15-music-test",
  synchronize: true,
  logging: true,
  entities: [Music],
  subscribers: [],
  migrations: [],
});
