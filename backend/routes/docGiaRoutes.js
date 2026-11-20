import express from 'express';
import { getAllDocGia, createDocGia, updateDocGia, deleteDocGia } from '../controllers/docGiaController.js';

const router = express.Router();

router.get('/', getAllDocGia);
router.post('/', createDocGia);
router.put('/:maDocGia', updateDocGia);
router.delete('/:maDocGia', deleteDocGia);

export default router;
