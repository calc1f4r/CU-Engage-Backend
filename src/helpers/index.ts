import crypto from "crypto";
import { UserModel } from "../models/user.model";
const SECRET = process.env.SECRET!;

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (password: string, salt: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join(SECRET))
    .digest("hex");
};

export const returnResetToken = () =>
  crypto.createHash("sha256").update(crypto.randomBytes(20)).digest("hex");
