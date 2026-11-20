import mongoose from 'mongoose';

const docGiaSchema = new mongoose.Schema({
    MaDocGia: { type: String, required: true, unique: true },
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    NgaySinh: { type: Date, required: true },
    Phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    DiaChi: { type: String, required: true },
    DienThoai: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('DocGia', docGiaSchema);
