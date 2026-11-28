<template>
  <div>
    <h3 class="text-primary mb-4">THỐNG KÊ TỔNG QUAN THƯ VIỆN</h3>

    <!-- Hàng 1: 4 Thẻ chỉ số KPI -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card text-white bg-primary shadow-sm h-100">
          <div class="card-body">
            <h6 class="card-title text-uppercase">Tổng Đầu Sách</h6>
            <h2 class="fw-bold mb-1">{{ dsSach.length }}</h2>
            <small>Tổng tồn kho: {{ tongSoQuyenTonKho }} quyển</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-white bg-success shadow-sm h-100">
          <div class="card-body">
            <h6 class="card-title text-uppercase">Tổng Độc Giả</h6>
            <h2 class="fw-bold mb-1">{{ dsDocGia.length }}</h2>
            <small>Đang hoạt động trên hệ thống</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-dark bg-warning shadow-sm h-100">
          <div class="card-body">
            <h6 class="card-title text-uppercase">Sách Đang Mượn</h6>
            <h2 class="fw-bold mb-1">{{ soPhieuDangMuon }}</h2>
            <small>Tổng lượt mượn: {{ dsMuon.length }} phiếu</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-white bg-danger shadow-sm h-100">
          <div class="card-body">
            <h6 class="card-title text-uppercase">Phiếu Quá Hạn</h6>
            <h2 class="fw-bold mb-1">{{ soPhieuQuaHan }}</h2>
            <small>Vượt quá 14 ngày chưa trả</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Hàng 2: 2 Bảng thống kê chi tiết -->
    <div class="row g-4">
      <!-- Bảng 1: Top 5 Sách được mượn nhiều nhất -->
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold text-primary">
            TOP SÁCH ĐƯỢC MƯỢN NHIỀU NHẤT
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Mã Sách</th>
                  <th>Tên Sách</th>
                  <th class="text-center">Số Lượt Mượn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in topSachMuon" :key="item.MaSach">
                  <td class="fw-bold">{{ item.MaSach }}</td>
                  <td>{{ item.TenSach }}</td>
                  <td class="text-center">
                    <span class="badge bg-primary rounded-pill">{{ item.soLuot }}</span>
                  </td>
                </tr>
                <tr v-if="topSachMuon.length === 0">
                  <td colspan="3" class="text-center text-muted py-3">Chưa có dữ liệu mượn sách</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bảng 2: Cảnh báo Sách sắp hết trong kho (<= 3 quyển) -->
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold text-danger">
            CẢNH BÁO SÁCH SẮP HẾT TRONG KHO (≤ 3 QUYỂN)
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Mã Sách</th>
                  <th>Tên Sách</th>
                  <th class="text-center">Còn Lại</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sach in sachSapHet" :key="sach.MaSach">
                  <td class="fw-bold">{{ sach.MaSach }}</td>
                  <td>{{ sach.TenSach }}</td>
                  <td class="text-center">
                    <span :class="sach.SoQuyen === 0 ? 'badge bg-danger' : 'badge bg-warning text-dark'">
                      {{ sach.SoQuyen }} quyển
                    </span>
                  </td>
                </tr>
                <tr v-if="sachSapHet.length === 0">
                  <td colspan="3" class="text-center text-muted py-3">Tất cả đầu sách đều còn đủ số lượng</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const dsSach = ref([]);
const dsDocGia = ref([]);
const dsMuon = ref([]);

// Tải đồng thời dữ liệu từ 3 API
const fetchDashboardData = async () => {
  try {
    const [resSach, resDG, resMuon] = await Promise.all([
      api.get('/sach'),
      api.get('/docgia'),
      api.get('/muonsach')
    ]);
    dsSach.value = resSach.data;
    dsDocGia.value = resDG.data;
    dsMuon.value = resMuon.data;
  } catch (error) {
    console.error('Lỗi tải dữ liệu thống kê:', error);
  }
};

// 1. Tính tổng số quyển sách đang nằm trong kho bằng hàm reduce()
const tongSoQuyenTonKho = computed(() => {
  return dsSach.value.reduce((tong, sach) => tong + sach.SoQuyen, 0);
});

// 2. Đếm số phiếu đang mượn (NgayTra === null)
const soPhieuDangMuon = computed(() => {
  return dsMuon.value.filter(p => !p.NgayTra).length;
});

// 3. Đếm số phiếu quá hạn (> 14 ngày chưa trả)
const soPhieuQuaHan = computed(() => {
  const now = new Date();
  return dsMuon.value.filter(p => {
    if (p.NgayTra) return false;
    const soNgay = Math.floor(Math.abs(now - new Date(p.NgayMuon)) / (1000 * 60 * 60 * 24));
    return soNgay > 14;
  }).length;
});

// 4. Gom nhóm và xếp hạng Top 5 sách được mượn nhiều nhất
const topSachMuon = computed(() => {
  const demLuot = {};
  dsMuon.value.forEach(p => {
    demLuot[p.MaSach] = (demLuot[p.MaSach] || 0) + 1;
  });

  return Object.keys(demLuot)
    .map(maSach => {
      const sach = dsSach.value.find(s => s.MaSach === maSach);
      return {
        MaSach: maSach,
        TenSach: sach ? sach.TenSach : 'Sách đã xóa',
        soLuot: demLuot[maSach]
      };
    })
    .sort((a, b) => b.soLuot - a.soLuot) // Sắp xếp giảm dần theo số lượt mượn
    .slice(0, 5); // Lấy 5 cuốn đầu tiên
});

// 5. Lọc danh sách các cuốn sách có số lượng tồn kho <= 3
const sachSapHet = computed(() => {
  return dsSach.value.filter(s => s.SoQuyen <= 3);
});

onMounted(fetchDashboardData);
</script>
