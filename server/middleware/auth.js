
import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    console.log("User ID:", userId); // Debug log

    const user = await clerkClient.users.getUser(userId);

    console.log("User Private Metadata:", user.privateMetadata); // Debug log

    if (user.privateMetadata.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error); // Show real error
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
};







