import NhanVien from '../models/NhanVien.js';

export const getAllNhanVien = async (req, res) => {
    try {
        const dsNhanVien = await NhanVien.find().select('-Password');
        res.status(200).json(dsNhanVien);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

export const createNhanVien = async (req, res) => {
    try {
        const { MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;

        const tonTai = await NhanVien.findOne({ MSNV });
        if (tonTai) {
            return res.status(400).json({ message: 'Mã số nhân viên này đã tồn tại!' });
        }

        const nvMoi = new NhanVien({ MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai });
        await nvMoi.save();

        res.status(201).json({ message: 'Tạo nhân viên thành công!', data: nvMoi });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo nhân viên: ' + error.message });
    }
};

export const loginNhanVien = async (req, res) => {
    try {
        const { MSNV, Password } = req.body;

        const nhanVien = await NhanVien.findOne({ MSNV });
        if (!nhanVien) {
            return res.status(404).json({ message: 'Mã số nhân viên không tồn tại!' });
        }

        if (nhanVien.Password !== Password) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
        }

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            nhanVien: {
                MSNV: nhanVien.MSNV,
                HoTenNV: nhanVien.HoTenNV,
                ChucVu: nhanVien.ChucVu,
                DiaChi: nhanVien.DiaChi,
                SoDienThoai: nhanVien.SoDienThoai
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập: ' + error.message });
    }
};
