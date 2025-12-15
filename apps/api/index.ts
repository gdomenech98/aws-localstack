import express, { Express } from 'express';
import { BundleApi } from './src';
import cookieParser from 'cookie-parser';
import cors from 'cors';

require('dotenv').config();

const app: Express = express();// SERVER Setup
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())// Parse JSON payloads
app.use(cookieParser()); // to get cookies
app.use(cors());

// Set a higher limit for JSON and URL-encoded requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

BundleApi(app)

app.listen(port, () => {// Server Start
    console.log(`Running on port ${port}`)
}); 