import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';

import {clerkMiddleware} from '@clerk/express'


import {serve} from "inngest/express";
import {inngest,functions} from "./inngest/index.js";

//using express create an application 
const app=express();
//for running application 

const port=3000;

//database connection 

await connectDB()


//middleware (all the request pass from json method)
app.use(express.json())
app.use(cors())

app.use(clerkMiddleware())



//create first api route that is home route - API routes
app.get('/',(req,res)=>res.send('Server is Live!'))

app.use('/api/inngest',serve({client:inngest,functions}))

 
app.listen(port,()=>console.log(`Server listening at http://localhost:${port}`));















