import express from 'express';
import { getAllSach, createSach, updateSach, deleteSach } from '../controllers/sachController.js';

const router = express.Router();

router.get('/', getAllSach);           // GET /api/sach
router.post('/', createSach);          // POST /api/sach
router.put('/:maSach', updateSach);    // PUT /api/sach/S001
router.delete('/:maSach', deleteSach); // DELETE /api/sach/S001

export default router;
