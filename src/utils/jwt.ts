import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret-key";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};
