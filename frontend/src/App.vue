<template>
  <div class="min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/sach">THƯ VIỆN SỐ</router-link>
        
        <div v-if="nhanVien" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" active-class="active fw-bold" to="/dashboard">Thống Kê</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active fw-bold" to="/sach">Quản Lý Sách</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active fw-bold" to="/nxb">Nhà Xuất Bản</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active fw-bold" to="/docgia">Độc Giả</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active fw-bold" to="/muonsach">Mượn / Trả Sách</router-link>
            </li>
          </ul>
          
          <div class="d-flex align-items-center text-white">
            <span class="me-3">Xin chào, <strong>{{ nhanVien.HoTenNV }}</strong> ({{ nhanVien.ChucVu }})</span>
            <button @click="logout" class="btn btn-sm btn-outline-light">Đăng xuất</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container py-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const nhanVien = ref(null);

const loadUser = () => {
  const data = localStorage.getItem('nhanVien');
  nhanVien.value = data ? JSON.parse(data) : null;
};

const logout = () => {
  localStorage.removeItem('nhanVien');
  nhanVien.value = null;
  router.push('/login');
};

onMounted(() => {
  loadUser();
  window.addEventListener('auth-change', loadUser);
});
</script>
