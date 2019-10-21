import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
const port = process.env.SERVER_PORT;
const url = `${process.env.MONGODB_USER}`;
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
routes(app);


mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then(() => app.listen(
    port,
    () => console.log(`Listening on ${port}`),
  ));
