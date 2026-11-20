import express from 'express';
import { getAllNhanVien, createNhanVien, loginNhanVien } from '../controllers/nhanVienController.js';

const router = express.Router();

router.get('/', getAllNhanVien);
router.post('/', createNhanVien);
router.post('/login', loginNhanVien); // POST /api/nhanvien/login

export default router;
