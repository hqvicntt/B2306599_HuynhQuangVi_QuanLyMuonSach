<template>
  <div>
    <h3 class="text-primary mb-3">QUẢN LÝ NHÀ XUẤT BẢN</h3>

    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-light fw-bold">
        {{ isEditing ? 'Cập nhật Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản Mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="saveNXB" class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Mã NXB</label>
            <input v-model="form.MaNXB" :disabled="isEditing" type="text" class="form-control" placeholder="VD: NXB02" required />
          </div>
          <div class="col-md-4">
            <label class="form-label">Tên Nhà Xuất Bản</label>
            <input v-model="form.TenNXB" type="text" class="form-control" placeholder="VD: NXB Trẻ" required />
          </div>
          <div class="col-md-5">
            <label class="form-label">Địa Chỉ</label>
            <input v-model="form.DiaChi" type="text" class="form-control" placeholder="VD: TP. Hồ Chí Minh" required />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-success me-2">
              {{ isEditing ? 'Lưu Thay Đổi' : 'Thêm NXB' }}
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
            <th>Mã NXB</th>
            <th>Tên Nhà Xuất Bản</th>
            <th>Địa Chỉ</th>
            <th class="text-center" style="width: 160px;">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nxb in dsNXB" :key="nxb.MaNXB">
            <td class="fw-bold">{{ nxb.MaNXB }}</td>
            <td>{{ nxb.TenNXB }}</td>
            <td>{{ nxb.DiaChi }}</td>
            <td class="text-center">
              <button @click="editNXB(nxb)" class="btn btn-sm btn-warning me-2">Sửa</button>
              <button @click="deleteNXB(nxb.MaNXB)" class="btn btn-sm btn-danger">Xóa</button>
            </td>
          </tr>
          <tr v-if="dsNXB.length === 0">
            <td colspan="4" class="text-center text-muted py-3">Chưa có dữ liệu Nhà Xuất Bản</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const dsNXB = ref([]);
const isEditing = ref(false);
const form = ref({ MaNXB: '', TenNXB: '', DiaChi: '' });

const fetchNXB = async () => {
  try {
    const res = await api.get('/nxb');
    dsNXB.value = res.data;
  } catch (error) {
    alert('Lỗi tải danh sách NXB!');
  }
};

const saveNXB = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/nxb/${form.value.MaNXB}`, form.value);
      alert('Cập nhật NXB thành công!');
    } else {
      await api.post('/nxb', form.value);
      alert('Thêm NXB mới thành công!');
    }
    resetForm();
    fetchNXB();
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const editNXB = (nxb) => {
  form.value = { ...nxb };
  isEditing.value = true;
};

const deleteNXB = async (maNXB) => {
  if (!confirm(`Xóa Nhà xuất bản ${maNXB}?`)) return;
  try {
    await api.delete(`/nxb/${maNXB}`);
    fetchNXB();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi khi xóa dữ liệu!');
  }
};

const resetForm = () => {
  form.value = { MaNXB: '', TenNXB: '', DiaChi: '' };
  isEditing.value = false;
};

onMounted(fetchNXB);
</script>
