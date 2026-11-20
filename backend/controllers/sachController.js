import Sach from '../models/Sach.js';
import NhaXuatBan from '../models/NhaXuatBan.js';

export const getAllSach = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.TenSach = { $regex: search, $options: 'i' };
        }

        const dsSach = await Sach.find(query);
        res.status(200).json(dsSach);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách sách: ' + error.message });
    }
};

export const createSach = async (req, res) => {
    try {
        const { MaSach, TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, NguonGocTacGia } = req.body;

        const sachTonTai = await Sach.findOne({ MaSach });
        if (sachTonTai) {
            return res.status(400).json({ message: 'Mã sách này đã tồn tại!' });
        }

        const nxbTonTai = await NhaXuatBan.findOne({ MaNXB });
        if (!nxbTonTai) {
            return res.status(400).json({ message: `Mã NXB (${MaNXB}) không tồn tại trong hệ thống!` });
        }

        const sachMoi = new Sach({
            MaSach, TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, NguonGocTacGia
        });
        await sachMoi.save();

        res.status(201).json({ message: 'Thêm sách thành công!', data: sachMoi });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm sách: ' + error.message });
    }
};

export const updateSach = async (req, res) => {
    try {
        const { maSach } = req.params;
        const duLieuMoi = req.body;

        if (duLieuMoi.MaNXB) {
            const nxbTonTai = await NhaXuatBan.findOne({ MaNXB: duLieuMoi.MaNXB });
            if (!nxbTonTai) {
                return res.status(400).json({ message: `Mã NXB (${duLieuMoi.MaNXB}) không tồn tại!` });
            }
        }

        const sachCapNhat = await Sach.findOneAndUpdate(
            { MaSach: maSach },
            duLieuMoi,
            { new: true, runValidators: true }
        );

        if (!sachCapNhat) {
            return res.status(404).json({ message: 'Không tìm thấy sách!' });
        }

        res.status(200).json({ message: 'Cập nhật sách thành công!', data: sachCapNhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật sách: ' + error.message });
    }
};

export const deleteSach = async (req, res) => {
    try {
        const { maSach } = req.params;
        const sachDaXoa = await Sach.findOneAndDelete({ MaSach: maSach });

        if (!sachDaXoa) {
            return res.status(404).json({ message: 'Không tìm thấy sách để xóa!' });
        }

        res.status(200).json({ message: 'Đã xóa sách thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa sách: ' + error.message });
    }
};
