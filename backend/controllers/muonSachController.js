import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';
import DocGia from '../models/DocGia.js';
import Sach from '../models/Sach.js';
import NhanVien from '../models/NhanVien.js';

export const getAllMuonSach = async (req, res) => {
    try {
        const dsMuon = await TheoDoiMuonSach.find().sort({ createdAt: -1 });
        res.status(200).json(dsMuon);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách mượn: ' + error.message });
    }
};

export const muonSach = async (req, res) => {
    try {
        const { MaDocGia, MaSach, MSNV } = req.body;

        const docGia = await DocGia.findOne({ MaDocGia });
        if (!docGia) {
            return res.status(404).json({ message: `Không tìm thấy độc giả có mã ${MaDocGia}!` });
        }

        const sach = await Sach.findOne({ MaSach });
        if (!sach) {
            return res.status(404).json({ message: `Không tìm thấy sách có mã ${MaSach}!` });
        }
        if (sach.SoQuyen <= 0) {
            return res.status(400).json({ message: 'Sách này hiện đã hết trong kho, không thể mượn!' });
        }

        if (MSNV) {
            const nv = await NhanVien.findOne({ MSNV });
            if (!nv) {
                return res.status(404).json({ message: `Mã nhân viên ${MSNV} không tồn tại!` });
            }
        }

        // Kiểm tra vi phạm quá hạn của Độc giả (Quy định mượn tối đa 14 ngày)
        const HAN_MUON_NGAY = 14;
        const MS_MOT_NGAY = 1000 * 60 * 60 * 24;
        const hienTai = new Date();

        // Lấy tất cả lịch sử mượn của độc giả này
        const lichSuMuon = await TheoDoiMuonSach.find({ MaDocGia });

        for (const phieu of lichSuMuon) {
            const ngayMuon = new Date(phieu.NgayMuon);

            // Trường hợp 1: Độc giả đang giữ một cuốn sách khác bị quá hạn chưa trả
            if (phieu.NgayTra === null) {
                const soNgayDangGiu = Math.floor((hienTai - ngayMuon) / MS_MOT_NGAY);
                if (soNgayDangGiu > HAN_MUON_NGAY) {
                    return res.status(400).json({
                        message: `Độc giả đang giữ sách (${phieu.MaSach}) quá hạn ${soNgayDangGiu - HAN_MUON_NGAY} ngày chưa trả. Không thể mượn thêm!`
                    });
                }
            }
            // Trường hợp 2: Đã trả sách nhưng trước đó trả trễ hạn -> Khóa quyền mượn tương ứng số ngày trễ
            else {
                const ngayTra = new Date(phieu.NgayTra);
                const tongNgayMuon = Math.floor((ngayTra - ngayMuon) / MS_MOT_NGAY);

                if (tongNgayMuon > HAN_MUON_NGAY) {
                    const soNgayTre = tongNgayMuon - HAN_MUON_NGAY;
                    // Tính ngày được phép mượn lại = Ngày trả + Số ngày trễ
                    const ngayMoKhoa = new Date(ngayTra.getTime() + soNgayTre * MS_MOT_NGAY);

                    if (hienTai < ngayMoKhoa) {
                        return res.status(400).json({
                            message: `Độc giả từng trả trễ ${soNgayTre} ngày (sách ${phieu.MaSach}). Bị tạm khóa quyền mượn đến hết ngày ${ngayMoKhoa.toLocaleDateString('vi-VN')}!`
                        });
                    }
                }
            }
        }

        const dangMuonChuaTra = await TheoDoiMuonSach.findOne({
            MaDocGia,
            MaSach,
            NgayTra: null
        });
        if (dangMuonChuaTra) {
            return res.status(400).json({ message: 'Độc giả này đang mượn cuốn sách này và chưa trả!' });
        }

        const phieuMuonMoi = new TheoDoiMuonSach({
            MaDocGia,
            MaSach,
            MSNV: MSNV || null
        });
        await phieuMuonMoi.save();

        sach.SoQuyen -= 1;
        await sach.save();

        res.status(201).json({
            message: 'Lập phiếu mượn sách thành công!',
            data: phieuMuonMoi,
            soQuyenConLai: sach.SoQuyen
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi mượn sách: ' + error.message });
    }
};

export const traSach = async (req, res) => {
    try {
        const { id } = req.params;

        const phieuMuon = await TheoDoiMuonSach.findById(id);
        if (!phieuMuon) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn này!' });
        }

        if (phieuMuon.NgayTra !== null) {
            return res.status(400).json({ message: 'Phiếu mượn này đã được trả trước đó rồi!' });
        }

        phieuMuon.NgayTra = new Date();
        await phieuMuon.save();

        const sach = await Sach.findOne({ MaSach: phieuMuon.MaSach });
        if (sach) {
            sach.SoQuyen += 1;
            await sach.save();
        }

        res.status(200).json({
            message: 'Xác nhận trả sách thành công!',
            data: phieuMuon
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi trả sách: ' + error.message });
    }
};

export const deleteMuonSach = async (req, res) => {
    try {
        const { id } = req.params;
        const phieuMuon = await TheoDoiMuonSach.findById(id);
        if (!phieuMuon) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn!' });
        }

        if (phieuMuon.NgayTra === null) {
            const sach = await Sach.findOne({ MaSach: phieuMuon.MaSach });
            if (sach) {
                sach.SoQuyen += 1;
                await sach.save();
            }
        }

        await TheoDoiMuonSach.findByIdAndDelete(id);
        res.status(200).json({ message: 'Đã xóa phiếu mượn thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa phiếu mượn: ' + error.message });
    }
};
