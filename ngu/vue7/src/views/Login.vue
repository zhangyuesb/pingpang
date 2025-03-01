<template>
    <div class="login">
        <el-card>
            <template #header>
                <h1>登录/注册</h1>
            </template>
            <el-form :model="form" ref="formRef" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin">登录</el-button>
                    <el-button @click="handleRegister">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const formRef = ref(null);
const form = ref({
    username: '',
    password: ''
});
const router = useRouter();

const handleLogin = () => {
    // 调用登录接口逻辑
    console.log('登录操作:', form.value);
    router.push('/main');
};

const handleRegister = () => {
    // 调用注册接口逻辑
    console.log('注册操作:', form.value);
};
</script>

<style scoped>
.login {
    text-align: center;
    padding: 20px;
}
</style>