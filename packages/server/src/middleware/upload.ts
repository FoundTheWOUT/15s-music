import multer from "multer";
import { ENABLE_OSS } from "../const";
import { generateFilename } from "../utils";

export const upload = multer({
  storage: ENABLE_OSS
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: "uploads/",
        async filename(req, file, cb) {
          const namePath = file.originalname.split(":");
          if (namePath.length === 2) {
            return cb(null, namePath[1]);
          }
          return cb(
            new Error("file name should like: [id]/[filename.ext]"),
            await generateFilename()
          );
        },
      }),
});

export const webpUpload = multer({
  storage: ENABLE_OSS
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: "uploads/",
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `local-${uniqueSuffix}.webp`);
        },
      }),
});
