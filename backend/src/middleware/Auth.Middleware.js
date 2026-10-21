import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "testing-realstate");

    req.admin = decoded; // { id, role, email }
    next();
  } catch (error) {
    res.status(401).json({ error: "Token failed or expired" });
  }
};
