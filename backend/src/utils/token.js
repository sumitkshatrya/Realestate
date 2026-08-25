import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_jwt_secret";
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

  const accessToken = jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

