import mongoose from 'mongoose';

const theoDoiMuonSachSchema = new mongoose.Schema({
    MaDocGia: { type: String, required: true, ref: 'DocGia' },
    MaSach: { type: String, required: true, ref: 'Sach' },
    MSNV: { type: String, ref: 'NhanVien' },
    NgayMuon: { type: Date, default: Date.now, required: true },
    NgayTra: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
