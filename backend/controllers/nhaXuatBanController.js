import NhaXuatBan from '../models/NhaXuatBan.js';
import Sach from '../models/Sach.js';

export const getAllNXB = async (req, res) => {
    try {
        const dsNXB = await NhaXuatBan.find();
        res.status(200).json(dsNXB);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

export const createNXB = async (req, res) => {
    try {
        const { MaNXB, TenNXB, DiaChi } = req.body;

        const tonTai = await NhaXuatBan.findOne({ MaNXB });
        if (tonTai) {
            return res.status(400).json({ message: 'Mã nhà xuất bản này đã tồn tại!' });
        }

        const nxbMoi = new NhaXuatBan({ MaNXB, TenNXB, DiaChi });
        await nxbMoi.save();

        res.status(201).json({ message: 'Thêm NXB thành công!', data: nxbMoi });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm NXB: ' + error.message });
    }
};

export const updateNXB = async (req, res) => {
    try {
        const { maNXB } = req.params;
        const { TenNXB, DiaChi } = req.body;

        const nxbCapNhat = await NhaXuatBan.findOneAndUpdate(
            { MaNXB: maNXB },
            { TenNXB, DiaChi },
            { new: true, runValidators: true }
        );

        if (!nxbCapNhat) {
            return res.status(404).json({ message: 'Không tìm thấy Nhà xuất bản!' }); // Mã 404: Không tìm thấy
        }

        res.status(200).json({ message: 'Cập nhật thành công!', data: nxbCapNhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật: ' + error.message });
    }
};

export const deleteNXB = async (req, res) => {
    try {
        const { maNXB } = req.params;
        const sachLienQuan = await Sach.findOne({ MaNXB: maNXB });
        if (sachLienQuan) {
            return res.status(400).json({
                message: `Không thể xóa! Vẫn còn sách (${sachLienQuan.TenSach}) thuộc Nhà xuất bản này trong kho.`
            });
        }
        const nxbDaXoa = await NhaXuatBan.findOneAndDelete({ MaNXB: maNXB });

        if (!nxbDaXoa) {
            return res.status(404).json({ message: 'Không tìm thấy Nhà xuất bản để xóa!' });
        }

        res.status(200).json({ message: 'Đã xóa Nhà xuất bản thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa: ' + error.message });
    }
};
