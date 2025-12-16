// import jwt from "jsonwebtoken";
// import Admin from "@/models/Admin";
// import { connectDB } from "@/lib/mongodb";

// export async function getCurrentUser(req) {
//   try {
//     // Get token from cookies (HttpOnly cookie)
//     const token = req.cookies.get("token")?.value;
//     if (!token) return null;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded?.id) return null;

//     await connectDB();
//     const user = await Admin.findById(decoded.id).select("-password");

//     return user || null;
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return null;
//   }
// }


import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import { connectDB } from "@/lib/mongodb";

export async function getCurrentUser(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return null;

    await connectDB();
    const user = await Admin.findById(decoded.id).select("-password");

    if (!user) return null;

    return user;
  } catch (err) {
    console.error("Auth error:", err.message);
    return null;
  }
}
