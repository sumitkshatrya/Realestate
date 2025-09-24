import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  // Access Token (short-lived)
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // 15 minutes
  );

  // Refresh Token (long-lived)
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7 days
  );

  return { accessToken, refreshToken };
};
