// userInfoStore.js
import { defineStore } from 'pinia';
import { toRaw } from 'vue';



export const userInfoStore = defineStore('userInfo', {
  state: () => ({
    name: '',
    mail: '',
    address: '',
    phone: '',
    avatarUrl: ''
  }),

  actions: {
    // 初始化时检查是否有存储的用户信息
    initUserInfo() {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        this.$state = JSON.parse(storedUserInfo);  // 恢复存储的数据
      }
    },

    // 更新用户信息，并保存到 localStorage
    setUserInfo(userInfo) {
      this.name = userInfo.name;
      this.mail = userInfo.mail;
      this.address = userInfo.address;
      this.phone = userInfo.phone;
      this.avatarUrl = userInfo.avatarUrl;


      // 将数据保存到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(toRaw(this.$state)));
    }
    ,
    clearUserInfo() {
        // 清空 store 的状态
        this.$reset();
    
        // 删除 localStorage 中存储的用户信息
        localStorage.removeItem('userInfo');
      }
  },

  
  
  
});