import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Hệ thống Quản lý mượn sách đang hoạt động!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại địa chỉ: http://localhost:${PORT}`);
});
