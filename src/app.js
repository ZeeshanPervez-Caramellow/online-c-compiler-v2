import express from 'express';
import bodyParser from 'body-parser';
import compilerRoutes from './routes/compilerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import privacyRoutes from './routes/privacyRoutes.js';
import termsRoutes from './routes/termsRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/compiler', compilerRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/report', reportRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/help', helpRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/privacy', privacyRoutes);
app.use('/api/v1/terms', termsRoutes);
app.use('/api/v1/about', aboutRoutes);

export default app;

