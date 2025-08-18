import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const syncUser = async (req, res, next) => {
  try {
    const { userId } = req.auth; // Clerk auth injects this
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Get Clerk user
    const clerkUser = await clerkClient.users.getUser(userId);

    // Sync to Mongo
    await User.findByIdAndUpdate(
      userId,
      {
        _id: clerkUser.id,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        image: clerkUser.imageUrl
      },
      { upsert: true, new: true }
    );

    next();
  } catch (error) {
    console.error("SyncUser error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
