import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import nhaXuatBanRoutes from './routes/nhaXuatBanRoutes.js';
import sachRoutes from './routes/sachRoutes.js';
import docGiaRoutes from './routes/docGiaRoutes.js';
import nhanVienRoutes from './routes/nhanVienRoutes.js';
import muonSachRoutes from './routes/muonSachRoutes.js';

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Hệ thống Quản lý mượn sách đang hoạt động!');
});
app.use('/api/nxb', nhaXuatBanRoutes);
app.use('/api/sach', sachRoutes);
app.use('/api/docgia', docGiaRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/muonsach', muonSachRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại địa chỉ: http://localhost:${PORT}`);
});
