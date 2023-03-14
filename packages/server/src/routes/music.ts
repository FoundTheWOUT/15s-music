import { Music } from "../entry/Music";
import { v4 as uuidv4 } from "uuid";
import express, { Router } from "express";
import { getAppContext } from "../ctx";
import { auth } from "../middleware/authentication";

export async function musicRoute(): Promise<Router> {
  const { dbSource } = await getAppContext();

  const music = express.Router();

  music.post("/music", async function (req, rep) {
    const data = req.body as { musics: Music[] };
    const musicRepository = dbSource.getRepository(Music);
    const musics = data.musics.map((music) =>
      musicRepository.create({ ...music, uuid: uuidv4() })
    );
    const res = dbSource.getRepository(Music).save(musics);
    return rep.send(res);
  });

  music.get("/music", async function (req, rep) {
    let page = req.query.page;
    let limit = req.query.limit ?? "30";
    if (typeof page !== "string" || typeof limit !== "string") {
      rep.status(400);
      return rep.send("page,limit query is require.");
    }
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    if (Number.isNaN(pageNum)) {
      rep.status(400);
      return rep.send("page query must be a num.");
    }
    const musicRepository = dbSource.getRepository(Music);

    const musics = await musicRepository
      .createQueryBuilder("music")
      .where("music.censored = true")
      .orderBy("music.createdAt", "DESC")
      .take(pageLimit)
      .skip(pageNum * pageLimit)
      .getMany();

    return rep.send({ total: await musicRepository.count(), musics });
  });

  // all music but with out censor
  music.get("/music/list", auth(), async function (req, rep) {
    const page = (req.query.page as string) ?? "0";
    const pageNum = parseInt(page);

    try {
      const musics = await dbSource
        .getRepository(Music)
        .createQueryBuilder("music")
        .orderBy("music.createdAt", "DESC")
        .take(30)
        .skip(pageNum * 30)
        .getMany();
      return rep.send({ musics });
    } catch (error) {
      return rep.end(error);
    }
  });

  music.get("/music/meta", async function (req, rep) {
    const musicRepository = dbSource.getRepository(Music);
    const total = await musicRepository.count();
    return rep.send({
      total,
    });
  });

  return music;
}
