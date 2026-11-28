<template>
  <div>
    <h3 class="text-primary mb-3">QUẢN LÝ ĐỘC GIẢ</h3>

    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-light fw-bold">
        {{ isEditing ? 'Cập nhật Thông Tin Độc Giả' : 'Thêm Độc Giả Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="saveDocGia" class="row g-3">
          <div class="col-md-2">
            <label class="form-label">Mã Độc Giả</label>
            <input v-model="form.MaDocGia" :disabled="isEditing" type="text" class="form-control" placeholder="VD: DG02" required />
          </div>
          <div class="col-md-3">
            <label class="form-label">Họ Lót</label>
            <input v-model="form.HoLot" type="text" class="form-control" placeholder="VD: Lê Thị" required />
          </div>
          <div class="col-md-2">
            <label class="form-label">Tên</label>
            <input v-model="form.Ten" type="text" class="form-control" placeholder="VD: Hoa" required />
          </div>
          <div class="col-md-3">
            <label class="form-label">Ngày Sinh</label>
            <input v-model="form.NgaySinh" type="date" class="form-control" required />
          </div>
          <div class="col-md-2">
            <label class="form-label">Phái</label>
            <select v-model="form.Phai" class="form-select" required>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Số Điện Thoại</label>
            <input v-model="form.DienThoai" type="text" class="form-control" required />
          </div>
          <div class="col-md-8">
            <label class="form-label">Địa Chỉ</label>
            <input v-model="form.DiaChi" type="text" class="form-control" required />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-success me-2">
              {{ isEditing ? 'Lưu Thay Đổi' : 'Thêm Độc Giả' }}
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
            <th>Mã ĐG</th>
            <th>Họ và Tên</th>
            <th>Ngày Sinh</th>
            <th>Phái</th>
            <th>Điện Thoại</th>
            <th>Địa Chỉ</th>
            <th class="text-center" style="width: 160px;">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dg in dsDocGia" :key="dg.MaDocGia">
            <td class="fw-bold">{{ dg.MaDocGia }}</td>
            <td>{{ dg.HoLot }} {{ dg.Ten }}</td>
            <td>{{ formatDate(dg.NgaySinh) }}</td>
            <td>{{ dg.Phai }}</td>
            <td>{{ dg.DienThoai }}</td>
            <td>{{ dg.DiaChi }}</td>
            <td class="text-center">
              <button @click="editDocGia(dg)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="deleteDocGia(dg.MaDocGia)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
          <tr v-if="dsDocGia.length === 0">
            <td colspan="7" class="text-center text-muted py-3">Chưa có dữ liệu Độc Giả</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const dsDocGia = ref([]);
const isEditing = ref(false);
const form = ref({
  MaDocGia: '', HoLot: '', Ten: '', NgaySinh: '', Phai: 'Nam', DiaChi: '', DienThoai: ''
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const fetchDocGia = async () => {
  try {
    const res = await api.get('/docgia');
    dsDocGia.value = res.data;
  } catch (error) {
    alert('Lỗi tải danh sách độc giả!');
  }
};

const saveDocGia = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/docgia/${form.value.MaDocGia}`, form.value);
      alert('Cập nhật độc giả thành công!');
    } else {
      await api.post('/docgia', form.value);
      alert('Thêm độc giả mới thành công!');
    }
    resetForm();
    fetchDocGia();
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const editDocGia = (dg) => {
  const ngaySinhFormat = dg.NgaySinh ? dg.NgaySinh.split('T')[0] : '';
  form.value = { ...dg, NgaySinh: ngaySinhFormat };
  isEditing.value = true;
};

const deleteDocGia = async (maDocGia) => {
  if (!confirm(`Xóa độc giả ${maDocGia}?`)) return;
  try {
    await api.delete(`/docgia/${maDocGia}`);
    fetchDocGia();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi khi xóa dữ liệu!');
  }
};

const resetForm = () => {
  form.value = { MaDocGia: '', HoLot: '', Ten: '', NgaySinh: '', Phai: 'Nam', DiaChi: '', DienThoai: '' };
  isEditing.value = false;
};

onMounted(fetchDocGia);
</script>
