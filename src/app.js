import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import compilerRoutes from './routes/compiler.routes.js';
import authRoutes from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// /**
//  * The absolute file path of the current module.
//  * Derived from ES module metadata using import.meta.url and fileURLToPath.
//  * Provides compatibility with CommonJS __filename in ES modules.
//  * @type {string}
//  */
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/temp/homepage.html"));
});

app.get("/compiler", (req, res) => {
  res.sendFile(path.resolve("src/temp/compiler.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.resolve("src/temp/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.resolve("src/temp/signup.html"));
});



app.use('/api/v1/compiler', compilerRoutes);
app.use('/api/v1/auth', authRoutes);


export default app;