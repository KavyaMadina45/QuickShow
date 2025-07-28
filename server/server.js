import fetch from 'node-fetch';
global.fetch = fetch;

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
console.log("TMDB_API_KEY", process.env.TMDB_API_KEY);

import connectDB from './configs/db.js';

import {clerkMiddleware} from '@clerk/express'


import {serve} from "inngest/express";
import {inngest,functions} from "./inngest/index.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';



//using express create an application 
const app=express();
//for running application 

const port=3000;

//database connection 

await connectDB()
//stripe webhook route

app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)




//middleware (all the request pass from json method)
app.use(express.json())

app.use(cors())

app.use(clerkMiddleware())



//create first api route that is home route - API routes
app.get('/',(req,res)=>res.send('Server is Live!'))

app.use('/api/inngest',serve({client:inngest,functions}))
app.use('/api/show',showRouter)

app.use('/api/booking',bookingRouter)

app.use('/api/admin',adminRouter)

app.use('/api/user',userRouter)


app.listen(port,()=>console.log(`Server listening at http://localhost:${port}`));












