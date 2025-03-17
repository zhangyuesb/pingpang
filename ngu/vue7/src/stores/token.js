// stores/token.js (Pinia store)
import { defineStore } from 'pinia';

export const useTokenStore = defineStore('token', {
    state: () => ({
      token: localStorage.getItem('token') || '',  // 从 localStorage 获取 token
    }),
    actions: {
      setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);  // 存储 token 到 localStorage
        this.startIdleTimer(); // 每次设置 token 时启动定时清除
      },
      removeToken() {
        this.token = '';
        localStorage.removeItem('token');  // 移除 token
        clearTimeout(this.idleTimer); // 清除定时器
      },
      startIdleTimer() {
        // 定义定时清除 token 的时间间隔 (例如 1 小时)
        const CLEAR_INTERVAL_TIME = 1000*60*60; 
  
        // 如果定时器已经存在，先清除它
        if (this.idleTimer) {
          clearTimeout(this.idleTimer);
        }
  
        // 设置新的定时器
        this.idleTimer = setTimeout(() => {
          this.removeToken(); // 超过时间未活动则清除 token
        }, CLEAR_INTERVAL_TIME);
  
        // 监听用户活动
        window.addEventListener('mousemove', this.resetIdleTimer);
        window.addEventListener('keydown', this.resetIdleTimer);
      },
      resetIdleTimer() {
        // 重置定时器
        clearTimeout(this.idleTimer);
        this.startIdleTimer();
      },
    },
    // Store内的额外状态（定时器）
    persist: true,  // 开启本地持久化，存储 token
    getters: {
      isLoggedIn: (state) => {
        return state.token !== '';
      }
    },
    // 用于销毁事件监听器和定时器
    onBeforeDispose() {
      clearTimeout(this.idleTimer);
      window.removeEventListener('mousemove', this.resetIdleTimer);
      window.removeEventListener('keydown', this.resetIdleTimer);
    },
  });