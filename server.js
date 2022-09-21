import express from 'express'
import dotenv, {config} from 'dotenv'
import referralRouter from './routes/referral.routes.js'
import userlRouter from './routes/user.routes.js'
import {mongodb} from './config/bd.js'
import cors from 'cors'

const port = process.env.PORT || 5015
const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: false}))

mongodb()

app.use('/api', referralRouter)
app.use('/api/user', userlRouter)

app.listen(port);
console.log(`server is running in port ${port}`);