<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="text-primary">QUẢN LÝ KHO SÁCH</h3>
      <div class="d-flex gap-2">
        <input v-model="searchQuery" @input="fetchSach" type="text" class="form-control" placeholder="Tìm tên sách..." />
      </div>
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-light fw-bold">
        {{ isEditing ? 'Cập nhật thông tin Sách' : 'Thêm Sách Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="saveSach" class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Mã Sách</label>
            <input v-model="form.MaSach" :disabled="isEditing" type="text" class="form-control" placeholder="VD: S002" required />
          </div>
          <div class="col-md-5">
            <label class="form-label">Tên Sách</label>
            <input v-model="form.TenSach" type="text" class="form-control" required />
          </div>
          <div class="col-md-4">
            <label class="form-label">Nhà Xuất Bản</label>
            <select v-model="form.MaNXB" class="form-select" required>
              <option value="" disabled>-- Chọn Nhà Xuất Bản --</option>
              <option v-for="nxb in dsNXB" :key="nxb.MaNXB" :value="nxb.MaNXB">
                {{ nxb.TenNXB }} ({{ nxb.MaNXB }})
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Đơn Giá (VNĐ)</label>
            <input v-model.number="form.DonGia" type="number" min="0" class="form-control" required />
          </div>
          <div class="col-md-2">
            <label class="form-label">Số Quyển</label>
            <input v-model.number="form.SoQuyen" type="number" min="0" class="form-control" required />
          </div>
          <div class="col-md-2">
            <label class="form-label">Năm Xuất Bản</label>
            <input v-model.number="form.NamXuatBan" type="number" class="form-control" required />
          </div>
          <div class="col-md-5">
            <label class="form-label">Tác Giả / Nguồn Gốc</label>
            <input v-model="form.NguonGocTacGia" type="text" class="form-control" required />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-success me-2">
              {{ isEditing ? 'Lưu Thay Đổi' : 'Thêm Sách' }}
            </button>
            <button v-if="isEditing" @click="resetForm" type="button" class="btn btn-secondary">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <div class="table-responsive shadow-sm">
      <table class="table table-bordered table-hover align-middle bg-white">
        <thead class="table-primary">
          <tr>
            <th>Mã Sách</th>
            <th>Tên Sách</th>
            <th>Mã NXB</th>
            <th>Đơn Giá</th>
            <th>Số Quyển</th>
            <th>Năm XB</th>
            <th>Tác Giả</th>
            <th class="text-center">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sach in dsSach" :key="sach.MaSach">
            <td class="fw-bold">{{ sach.MaSach }}</td>
            <td>{{ sach.TenSach }}</td>
            <td>{{ sach.MaNXB }}</td>
            <td>{{ sach.DonGia.toLocaleString() }} đ</td>
            <td>
              <span :class="sach.SoQuyen > 0 ? 'badge bg-success' : 'badge bg-danger'">
                {{ sach.SoQuyen }}
              </span>
            </td>
            <td>{{ sach.NamXuatBan }}</td>
            <td>{{ sach.NguonGocTacGia }}</td>
            <td class="text-center">
              <button @click="editSach(sach)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="deleteSach(sach.MaSach)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
          <tr v-if="dsSach.length === 0">
            <td colspan="8" class="text-center text-muted py-3">Chưa có dữ liệu sách</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const dsSach = ref([]);
const dsNXB = ref([]);
const searchQuery = ref('');
const isEditing = ref(false);

const form = ref({
  MaSach: '', TenSach: '', DonGia: 0, SoQuyen: 1, NamXuatBan: 2024, MaNXB: '', NguonGocTacGia: ''
});

const fetchSach = async () => {
  try {
    const res = await api.get('/sach', { params: { search: searchQuery.value } });
    dsSach.value = res.data;
  } catch (error) {
    alert('Lỗi tải danh sách sách!');
  }
};

const fetchNXB = async () => {
  const res = await api.get('/nxb');
  dsNXB.value = res.data;
};

const saveSach = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/sach/${form.value.MaSach}`, form.value);
      alert('Cập nhật sách thành công!');
    } else {
      await api.post('/sach', form.value);
      alert('Thêm sách mới thành công!');
    }
    resetForm();
    fetchSach();
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

// Đổ dữ liệu cuốn sách được chọn lên form để sửa
const editSach = (sach) => {
  form.value = { ...sach }; // Copy đối tượng để tránh làm thay đổi trực tiếp bảng khi chưa bấm Lưu
  isEditing.value = true;
};

// Xóa sách
const deleteSach = async (maSach) => {
  if (!confirm(`Bạn có chắc muốn xóa sách ${maSach} không?`)) return;
  try {
    await api.delete(`/sach/${maSach}`);
    fetchSach();
  } catch (error) {
    alert('Lỗi khi xóa sách!');
  }
};

const resetForm = () => {
  form.value = { MaSach: '', TenSach: '', DonGia: 0, SoQuyen: 1, NamXuatBan: 2024, MaNXB: '', NguonGocTacGia: '' };
  isEditing.value = false;
};

// onMounted: Tự động chạy ngay khi trang web vừa được mở lên
onMounted(() => {
  fetchSach();
  fetchNXB();
});
</script>
