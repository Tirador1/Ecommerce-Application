import { customAlphabet } from "nanoid";

const generateUniqueString = (length = 10) => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", length);
  return nanoid();
};

export default generateUniqueString;
