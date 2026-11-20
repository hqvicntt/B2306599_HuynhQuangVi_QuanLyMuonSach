import DocGia from '../models/DocGia.js';

export const getAllDocGia = async (req, res) => {
    try {
        const dsDocGia = await DocGia.find();
        res.status(200).json(dsDocGia);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

export const createDocGia = async (req, res) => {
    try {
        const { MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai } = req.body;

        // Kiểm tra trùng mã độc giả
        const tonTai = await DocGia.findOne({ MaDocGia });
        if (tonTai) {
            return res.status(400).json({ message: 'Mã độc giả này đã tồn tại!' });
        }

        const docGiaMoi = new DocGia({ MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai });
        await docGiaMoi.save();

        res.status(201).json({ message: 'Thêm độc giả thành công!', data: docGiaMoi });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm độc giả: ' + error.message });
    }
};

export const updateDocGia = async (req, res) => {
    try {
        const { maDocGia } = req.params;
        const docGiaCapNhat = await DocGia.findOneAndUpdate(
            { MaDocGia: maDocGia },
            req.body,
            { new: true, runValidators: true }
        );

        if (!docGiaCapNhat) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả!' });
        }

        res.status(200).json({ message: 'Cập nhật độc giả thành công!', data: docGiaCapNhat });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật: ' + error.message });
    }
};

export const deleteDocGia = async (req, res) => {
    try {
        const { maDocGia } = req.params;
        const docGiaDaXoa = await DocGia.findOneAndDelete({ MaDocGia: maDocGia });

        if (!docGiaDaXoa) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả để xóa!' });
        }

        res.status(200).json({ message: 'Đã xóa độc giả thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa độc giả: ' + error.message });
    }
};
