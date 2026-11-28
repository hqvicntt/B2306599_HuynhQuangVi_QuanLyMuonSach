<template>
  <div>
    <h3 class="text-primary mb-3">THEO DÕI MƯỢN / TRẢ SÁCH</h3>

    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-light fw-bold">Lập Phiếu Mượn Sách Mới</div>
      <div class="card-body">
        <form @submit.prevent="lapPhieuMuon" class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Chọn Độc Giả</label>
            <select v-model="form.MaDocGia" class="form-select" required>
              <option value="" disabled>-- Chọn Độc Giả --</option>
              <option v-for="dg in dsDocGia" :key="dg.MaDocGia" :value="dg.MaDocGia">
                {{ dg.MaDocGia }} - {{ dg.HoLot }} {{ dg.Ten }}
              </option>
            </select>
          </div>

          <div class="col-md-5">
            <label class="form-label">Chọn Sách Mượn</label>
            <select v-model="form.MaSach" class="form-select" required>
              <option value="" disabled>-- Chọn Sách --</option>
              <option v-for="s in dsSach" :key="s.MaSach" :value="s.MaSach" :disabled="s.SoQuyen <= 0">
                {{ s.MaSach }} - {{ s.TenSach }} (Còn: {{ s.SoQuyen }} quyển)
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <button type="submit" class="btn btn-primary w-100">Xác Nhận Cho Mượn</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-5">
        <input 
          v-model="tuKhoaTimKiem" 
          type="text" 
          class="form-control" 
          placeholder="Tìm theo mã hoặc tên độc giả, tên sách..." 
        />
      </div>
      <div class="col-md-4">
        <select v-model="boLocTrangThai" class="form-select">
          <option value="ALL">Tất cả trạng thái</option>
          <option value="DANG_MUON">Đang mượn</option>
          <option value="QUA_HAN">Quá hạn (trên 14 ngày)</option>
          <option value="DA_TRA">Đã trả sách</option>
        </select>
      </div>
    </div>

    <div class="table-responsive shadow-sm">
      <table class="table table-bordered table-hover align-middle bg-white">
        <thead class="table-primary">
          <tr>
            <th>Mã Độc Giả</th>
            <th>Mã Sách</th>
            <th>Nhân Viên Lập</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Trạng Thái</th>
            <th class="text-center">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="phieu in dsMuonDaLoc" :key="phieu._id">
            <td>
              <span class="fw-bold">{{ phieu.MaDocGia }}</span><br />
              <small class="text-muted">{{ getTenDocGia(phieu.MaDocGia) }}</small>
            </td>
            <td>
              <span class="fw-bold">{{ phieu.MaSach }}</span><br />
              <small class="text-muted">{{ getTenSach(phieu.MaSach) }}</small>
            </td>
            <td>{{ phieu.MSNV || 'Tự đăng ký' }}</td>
            <td>{{ formatDateTime(phieu.NgayMuon) }}</td>
            <td>{{ phieu.NgayTra ? formatDateTime(phieu.NgayTra) : '---' }}</td>
            <td>
              <span v-if="phieu.NgayTra && isTraTre(phieu.NgayMuon, phieu.NgayTra)" class="badge bg-secondary">
                Đã trả (Trễ {{ tinhSoNgayTre(phieu.NgayMuon, phieu.NgayTra) }} ngày)
              </span>
              <span v-else-if="phieu.NgayTra" class="badge bg-success">Đã trả đúng hạn</span>
              <span v-else-if="isQuaHan(phieu.NgayMuon)" class="badge bg-danger">
                Quá hạn ({{ tinhSoNgayMuon(phieu.NgayMuon) }} ngày)
              </span>
              <span v-else class="badge bg-warning text-dark">Đang mượn</span>
            </td>
            <td class="text-center">
              <button v-if="!phieu.NgayTra" @click="xacNhanTraSach(phieu._id)" class="btn btn-sm btn-success me-2">
                Trả Sách
              </button>
              <button @click="xoaPhieu(phieu._id)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
          <tr v-if="dsMuonDaLoc.length === 0">
            <td colspan="7" class="text-center text-muted py-3">Chưa có lịch sử mượn sách nào</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

const dsMuon = ref([]);
const dsDocGia = ref([]);
const dsSach = ref([]);
const form = ref({ MaDocGia: '', MaSach: '' });

const tuKhoaTimKiem = ref('');
const boLocTrangThai = ref('ALL');

// 1. Hàm ánh xạ từ MaDocGia sang Họ Tên đầy đủ
const getTenDocGia = (maDG) => {
  const dg = dsDocGia.value.find(item => item.MaDocGia === maDG);
  return dg ? `${dg.HoLot} ${dg.Ten}` : 'Không xác định';
};

// 2. Hàm ánh xạ từ MaSach sang Tên Sách
const getTenSach = (maSach) => {
  const sach = dsSach.value.find(item => item.MaSach === maSach);
  return sach ? sach.TenSach : 'Không xác định';
};

// 3. Hàm tính số ngày đã mượn tính đến hiện tại
const tinhSoNgayMuon = (ngayMuon) => {
  const diffTime = Math.abs(new Date() - new Date(ngayMuon));
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Chia cho số mili-giây của 1 ngày
};

// 4. Kiểm tra xem phiếu mượn có vượt quá 14 ngày chưa
const isQuaHan = (ngayMuon) => {
  return tinhSoNgayMuon(ngayMuon) > 14;
};

// Tính số ngày trả trễ đối với phiếu đã trả
const tinhSoNgayTre = (ngayMuon, ngayTra) => {
  const diffTime = Math.abs(new Date(ngayTra) - new Date(ngayMuon));
  const tongNgay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return tongNgay > 14 ? tongNgay - 14 : 0;
};

const isTraTre = (ngayMuon, ngayTra) => {
  return tinhSoNgayTre(ngayMuon, ngayTra) > 0;
};

// 5. Danh sách phiếu mượn tự động lọc theo từ khóa và trạng thái
const dsMuonDaLoc = computed(() => {
  return dsMuon.value.filter(phieu => {
    // Lọc theo trạng thái
    if (boLocTrangThai.value === 'DA_TRA' && !phieu.NgayTra) return false;
    if (boLocTrangThai.value === 'DANG_MUON' && phieu.NgayTra) return false;
    if (boLocTrangThai.value === 'QUA_HAN' && (phieu.NgayTra || !isQuaHan(phieu.NgayMuon))) return false;

    // Lọc theo từ khóa (Mã hoặc Tên độc giả, Mã hoặc Tên sách)
    const kw = tuKhoaTimKiem.value.toLowerCase().trim();
    if (!kw) return true;

    const tenDG = getTenDocGia(phieu.MaDocGia).toLowerCase();
    const tenSach = getTenSach(phieu.MaSach).toLowerCase();
    return (
      phieu.MaDocGia.toLowerCase().includes(kw) ||
      tenDG.includes(kw) ||
      phieu.MaSach.toLowerCase().includes(kw) ||
      tenSach.includes(kw)
    );
  });
});

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN');
};

const loadAllData = async () => {
  try {
    const [resMuon, resDG, resSach] = await Promise.all([
      api.get('/muonsach'),
      api.get('/docgia'),
      api.get('/sach')
    ]);
    dsMuon.value = resMuon.data;
    dsDocGia.value = resDG.data;
    dsSach.value = resSach.data;
  } catch (error) {
    alert('Lỗi tải dữ liệu mượn trả sách!');
  }
};

const lapPhieuMuon = async () => {
  try {
    const nhanVien = JSON.parse(localStorage.getItem('nhanVien'));
    const payload = {
      MaDocGia: form.value.MaDocGia,
      MaSach: form.value.MaSach,
      MSNV: nhanVien ? nhanVien.MSNV : null
    };

    await api.post('/muonsach', payload);
    alert('Lập phiếu mượn thành công! Kho sách đã tự động trừ 1 quyển.');
    form.value = { MaDocGia: '', MaSach: '' };
    loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi lập phiếu mượn!');
  }
};

const xacNhanTraSach = async (id) => {
  if (!confirm('Xác nhận độc giả đã trả cuốn sách này?')) return;
  try {
    await api.put(`/muonsach/tra/${id}`);
    alert('Đã trả sách! Số lượng sách trong kho đã được cộng lại.');
    loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi xác nhận trả sách!');
  }
};

const xoaPhieu = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa phiếu mượn này?')) return;
  try {
    await api.delete(`/muonsach/${id}`);
    loadAllData();
  } catch (error) {
    alert('Lỗi xóa phiếu mượn!');
  }
};

onMounted(loadAllData);
</script>
