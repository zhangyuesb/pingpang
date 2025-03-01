<template>
    <div class="home">
        <el-card>
            <template #header>
                <h1>欢迎使用系统</h1>
            </template>
            <el-button @click="goToLogin">开始体验</el-button>
        </el-card>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToLogin = () => {
    router.push('/login');
};
</script>

<style scoped>
.home {
    text-align: center;
    padding: 20px;
}
</style>