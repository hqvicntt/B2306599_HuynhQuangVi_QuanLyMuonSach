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
          <tr v-for="phieu in dsMuon" :key="phieu._id">
            <td class="fw-bold">{{ phieu.MaDocGia }}</td>
            <td class="fw-bold">{{ phieu.MaSach }}</td>
            <td>{{ phieu.MSNV || 'Tự đăng ký' }}</td>
            <td>{{ formatDateTime(phieu.NgayMuon) }}</td>
            <td>{{ phieu.NgayTra ? formatDateTime(phieu.NgayTra) : '---' }}</td>
            <td>
              <span v-if="phieu.NgayTra" class="badge bg-success">Đã trả sách</span>
              <span v-else class="badge bg-warning text-dark">Đang mượn</span>
            </td>
            <td class="text-center">
              <button v-if="!phieu.NgayTra" @click="xacNhanTraSach(phieu._id)" class="btn btn-sm btn-success me-2">
                Trả Sách
              </button>
              <button @click="xoaPhieu(phieu._id)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
          <tr v-if="dsMuon.length === 0">
            <td colspan="7" class="text-center text-muted py-3">Chưa có lịch sử mượn sách nào</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const dsMuon = ref([]);
const dsDocGia = ref([]);
const dsSach = ref([]);
const form = ref({ MaDocGia: '', MaSach: '' });

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
