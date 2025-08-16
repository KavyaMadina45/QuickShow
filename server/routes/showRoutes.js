import express from "express";
import { addShow, getShows,getNowPlayingMovies } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";


const showRouter=express.Router();

showRouter.get('/now-playing',getNowPlayingMovies)
showRouter.post('/add',protectAdmin,addShow)
showRouter.get('/all',getShows)




export default showRouter;








