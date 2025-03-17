import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/HomeView.vue';
import Login from '@/views/Login.vue';
import Main from '@/views/Main.vue';
import Setting from '@/views/Setting.vue';
import History from '@/views/History.vue';
import { useTokenStore } from '@/stores/token'; 
import { userInfoStore } from '@/stores/userInfoStore';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false } // 不需要 Token
    },
    {
        path: '/main',
        name: 'Main',
        component: Main,
        meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'History',
      component: History,
      meta: { requiresAuth: true }
   },
  {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      meta: { requiresAuth: true }
  }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

// 全局路由守卫
router.beforeEach((to, from, next) => {
    const tokenStore = useTokenStore();  // 获取 Pinia 中的 token 状态
    const userInfoStoreInstance = userInfoStore();

    // 如果进入登录页面，清除 token
  if (to.name === 'Home') {
    tokenStore.removeToken();  // 清除 token
    userInfoStoreInstance.clearUserInfo();
  }
  
    // 检查路由是否需要认证
    if (to.meta.requiresAuth) {
      // 如果目标页面需要认证，检查是否有 token
      if (tokenStore.token) {
        next();  // 有 Token，允许访问
      } else {
        next({ name: 'Home' });  // 没有 Token，跳转到登录页面
      }
    } else {
      next();  // 不需要 Token，直接访问
    }
  });

export default router;