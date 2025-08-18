
import dotenv from "dotenv";
dotenv.config();

// import fetch from "node-fetch";
// global.fetch = fetch;

import express from "express";
import cors from "cors";

import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";


import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();

// Connect DB safely
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// Stripe webhook BEFORE json middleware
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

// Local dev
if (process.env.NODE_ENV !== "production") {
  const port = 3000;
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
}

// Export for Vercel
module.exports=app;


