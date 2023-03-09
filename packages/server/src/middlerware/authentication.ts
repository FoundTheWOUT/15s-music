import { RequestHandler } from "express";

export const auth = (): RequestHandler => {
  return (req, res, next) => {
    if (req.method === "POST" || "GET") {
      const { Basic } = req.headers.authorization
        ? Object.fromEntries(
            req.headers.authorization.split(",").map((auth) => auth.split(" "))
          )
        : ({} as any);

      if (Basic !== process.env.MASTER_TOKEN) {
        return res.status(401).end();
      }
    }

    next();
  };
};
