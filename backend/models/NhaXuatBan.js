import mongoose from 'mongoose';

const nhaXuatBanSchema = new mongoose.Schema({
    MaNXB: { type: String, required: true, unique: true },
    TenNXB: { type: String, required: true },
    DiaChi: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('NhaXuatBan', nhaXuatBanSchema);
