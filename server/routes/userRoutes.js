
import express from "express";
import { getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js";
import { syncUser } from "../middleware/syncUser.js";

const userRouter = express.Router();

// Run syncUser middleware before controller
userRouter.get('/bookings', syncUser, getUserBookings);
userRouter.post('/update-favorite', syncUser, updateFavorite);
userRouter.get('/favorites', syncUser, getFavorites);

export default userRouter;





