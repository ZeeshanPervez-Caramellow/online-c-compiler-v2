import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/compiler', compilerRoutes);

export default app;