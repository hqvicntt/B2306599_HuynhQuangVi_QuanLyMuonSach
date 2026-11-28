import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SachView from '../views/SachView.vue';
import NhaXuatBanView from '../views/NhaXuatBanView.vue';
import DocGiaView from '../views/DocGiaView.vue';
import MuonSachView from '../views/MuonSachView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/login', component: LoginView },
    { path: '/sach', component: SachView, meta: { requiresAuth: true } },
    { path: '/nxb', component: NhaXuatBanView, meta: { requiresAuth: true } },
    { path: '/docgia', component: DocGiaView, meta: { requiresAuth: true } },
    { path: '/muonsach', component: MuonSachView, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const nhanVien = localStorage.getItem('nhanVien');
    if (to.meta.requiresAuth && !nhanVien) {
        next('/login');
    } else {
        next();
    }
});

export default router;
