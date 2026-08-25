import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.cookies?.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "default_jwt_secret";
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id).select("-passwordHash");
    if (!admin) {
      return res.status(401).json({ error: "Not authorized, admin account not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token failed or expired" });
  }
};

