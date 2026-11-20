<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5">
      <div class="card shadow">
        <div class="card-header bg-primary text-white text-center">
          <h4 class="mb-0">ĐĂNG NHẬP THỦ THƯ</h4>
        </div>
        <div class="card-body p-4">
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label fw-bold">Mã số nhân viên (MSNV)</label>
              <input v-model="form.MSNV" type="text" class="form-control" placeholder="VD: NV01" required />
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Mật khẩu</label>
              <input v-model="form.Password" type="password" class="form-control" placeholder="Nhập mật khẩu" required />
            </div>

            <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const form = ref({ MSNV: '', Password: '' });
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    errorMessage.value = '';
    const res = await api.post('/nhanvien/login', form.value);
    
    localStorage.setItem('nhanVien', JSON.stringify(res.data.nhanVien));
    
    window.dispatchEvent(new Event('auth-change'));
    
    router.push('/sach');
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại!';
  }
};
</script>
