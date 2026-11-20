import express from 'express';
import { getAllNXB, createNXB, updateNXB, deleteNXB } from '../controllers/nhaXuatBanController.js';

const router = express.Router();

router.get('/', getAllNXB);            // GET /api/nxb
router.post('/', createNXB);           // POST /api/nxb
router.put('/:maNXB', updateNXB);      // PUT /api/nxb/NXB01
router.delete('/:maNXB', deleteNXB);   // DELETE /api/nxb/NXB01

export default router;
