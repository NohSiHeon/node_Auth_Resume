import express from 'express';
import { prisma } from './utils/prisma.util.js';
import authRouter from './routers/auth.router.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', [authRouter]);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(PORT, '포트로 서버가 열렸어요');
});