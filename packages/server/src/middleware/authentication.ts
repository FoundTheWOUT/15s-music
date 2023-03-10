import { RequestHandler } from "express";
import { log } from "../utils";

export const auth = (options?: { allowGuest?: boolean }): RequestHandler => {
  const { allowGuest = false } = options ?? {};
  return (req, res, next) => {
    log("passing authentication middleware.");
    if (req.method === "POST" || "GET") {
      const { Basic } = req.headers.authorization
        ? Object.fromEntries(
            req.headers.authorization.split(",").map((auth) => auth.split(" "))
          )
        : ({} as any);

      if (allowGuest && Basic == "guest") {
        return next();
      }

      if (Basic !== process.env.MASTER_TOKEN) {
        return res.status(401).end();
      }
    }

    return next();
  };
};
