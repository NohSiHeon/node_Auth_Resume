import express from 'express';
// import './utils/prisma.util.js';
import { prisma } from './utils/prisma.util.js';

const app = express();
const PORT = 3000;

app.use(express.json());


app.listen(PORT, () => {
	console.log(PORT, '포트로 서버가 열렸어요');
});