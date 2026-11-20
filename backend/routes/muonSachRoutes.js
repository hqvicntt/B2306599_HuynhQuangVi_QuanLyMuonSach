import express from 'express';
import { getAllMuonSach, muonSach, traSach, deleteMuonSach } from '../controllers/muonSachController.js';

const router = express.Router();

router.get('/', getAllMuonSach);
router.post('/', muonSach);
router.put('/tra/:id', traSach); // PUT /api/muonsach/tra/<id_phieu>
router.delete('/:id', deleteMuonSach);

export default router;
