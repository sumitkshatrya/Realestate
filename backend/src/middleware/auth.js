// import jwt from "jsonwebtoken";
// import catchAsyncError from "../middleware/catchAsyncError.js";
// import User from "../models/User.js";

// export const verifyToken = catchAsyncError(async (req, res, next) => {
//   try {
//     const { authorization } =
//       req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//     if (!authorization || !authorization.startsWith("Bearer")) {
//       throw new Error("unauthorized access - no token provided");
//       const decoded = jwt.verify(
//         authorization,
//         process.env.ACCESS_TOKEN_SECRET
//       );
//       const user = await User.findById(decoded?.id).select(" -refresh_token");
//       if (!user) {
//         throw new Error("unauthorized access - user not found");
//         req.user = user;
//         next();
//       }
//     }
//   } catch (error) {
//     return res
//       .status(401)
//       .json({ message: "unauthorized access - invalid token" });
//   }
// });
import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/User.js";

// export const verifyToken = catchAsyncError(async (req, res, next) => {
//   try {
//     // ✅ Extract token from header OR cookies
//     const token =
//       req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     // ✅ Check if token exists
//     if (!token) {
//       throw new Error("unauthorized access - no token provided");
//     }

//     // ✅ Verify the token
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // ✅ Find user
//     const user = await User.findById(decoded?.id).select("-refresh_token");
//     if (!user) {
//       throw new Error("unauthorized access - user not found");
//     }

//     // ✅ Attach user to request and continue
//     req.user = user;
//     next();
//   } catch (error) {
//     return res
//       .status(401)
//       .json({ message: "unauthorized access - invalid token" });
//   }
// });
export const verifyToken = catchAsyncError(async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check cookie first
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2️⃣ Check Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized access - no token provided" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?.id).select("-refresh_token");

    if (!user) {
      return res
        .status(401)
        .json({ message: "unauthorized access - user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "unauthorized access - invalid token" });
  }
});
