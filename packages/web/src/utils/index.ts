import crypto from "crypto";

export function generateFilename(): Promise<string> {
  return new Promise((res, rej) => {
    crypto.randomBytes(16, function (err, raw) {
      if (err) rej(err);
      res(raw.toString("hex"));
    });
  });
}
