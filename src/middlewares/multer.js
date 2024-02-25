import fs from "fs";
import path from "path";
import multer from "multer";

import generateUniqueString from "../utils/generateUniqueString.js";
import { allowedExtesions } from "../utils/allowedExtesions.js";

export const multerMiddlewareLocal = ({
  extension = allowedExtesions.image,
  fileName = "general",
}) => {
  const destinationPath = path.resolve(`./src/uploads/${fileName}`);

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },

    filename: (req, file, cb) => {
      const newFileName = generateUniqueString(5) + _ + file.originalname;
      cb(null, newFileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (extension.includes(file.mimetype.split("/")[1])) {
      cb(null, true);
    } else {
      cb(new Error("File format is not allowed!"), false);
    }
  };

  return multer({ fileFilter, storage });
};

export const multerMiddlewareHost = ({
  extension = allowedExtesions.image,
}) => {
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const newFileName = generateUniqueString(5) + "-" + file.originalname;
      cb(null, newFileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (extension.includes(file.mimetype.split("/")[1])) {
      cb(null, true);
    } else {
      cb(new Error("File format is not allowed!"), false);
    }
  };

  return multer({ fileFilter, storage });
};
