import { randomBytes } from "crypto";

export function generateSecurePassword(length: number) {
  const password = randomBytes(Math.ceil(length * 0.75))
    .toString("base64")       
    .replace(/\+/g, "0")     
    .replace(/\//g, "1")
    .replace(/=/g, "2")
    .slice(0, length);       
  return password;
}