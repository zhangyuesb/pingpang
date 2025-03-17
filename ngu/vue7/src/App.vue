<template>
  <div id="app">
    <nav v-if="showNav">
      <router-link to="/">Home</router-link>
    </nav>
    <router-view/>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showNav = ref(false);

// 监听路由变化
watch(() => router.currentRoute.value.path, (newPath) => {
  showNav.value = newPath !== '/';
}, { immediate: true });
</script>


<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #21288f;
}

nav {
  padding: 30px;
  background-color:#21288f;;

  a {
    font-weight: bold;
    color: #000000;

    &.router-link-exact-active {
      color: #eb0d5b;
    }
  }
}
</style>
