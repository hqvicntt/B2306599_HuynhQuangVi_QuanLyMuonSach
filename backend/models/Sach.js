import mongoose from 'mongoose';

const sachSchema = new mongoose.Schema({
    MaSach: { type: String, required: true, unique: true },
    TenSach: { type: String, required: true },
    DonGia: { type: Number, required: true, min: 0 },
    SoQuyen: { type: Number, required: true, min: 0 },
    NamXuatBan: { type: Number, required: true },
    MaNXB: { type: String, required: true, ref: 'NhaXuatBan' },
    NguonGocTacGia: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Sach', sachSchema);
