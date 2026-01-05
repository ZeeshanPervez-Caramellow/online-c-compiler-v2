import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compilerRoutes from './routes/compiler.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1/home', (req,res)=>{
    res.sendFile(path.join(__dirname, "temp","homepage.html"))
});
app.use('/api/v1/compiler', compilerRoutes);

export default app;