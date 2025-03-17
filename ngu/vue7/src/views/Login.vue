<template>
    <div class="login">
        <!--Element Plus 的 列（column）布局组件，必须放在 <el-row> 里面。
        :span="30" 代表该列占据 30 格（一般 24 格为最大值，30 超出标准）。
        :offset="1" 代表该列在左侧偏移 1 格，让其不会紧贴左侧。
        class="bg" 和 class="form" 是自定义的 CSS 类(在下面的style标签里)，可用于设置背景、样式等。-->
        <el-col :span="24" class="bg">
        <el-col :span="8" :offset="1" class="form">
        
        <!-- 注册表单 -->
        <el-form ref="form" size="large" autocomplete="off" v-if="isRegister":model="registerData":rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="handleRegister">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info":underline="false" @click="isRegister = false" class="returnToLogin">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else="isRegister":model="registerData":rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="handleLogin">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true" class="returnToRegister">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
        </el-col>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userRegisterService, userLoginService,getUserInfoService } from '@/api/user';
import { useTokenStore } from '@/stores/token';
import { jwtUtil } from '@/utils/jwtUtils';
import {userInfoStore} from '@/stores/userInfoStore'

const form = ref(null);
const isRegister = ref(false);
//定义数据模型
const registerData = ref({
    username:'',
    password:'',
    rePassword:''
})
//校验密码的函数
const checkRePassword = (rule,value,callback)=>{
    if(value==''){
        callback(new Error('请再次确认密码'))
    }else if(value !== registerData.value.password){
        callback(new Error('请保持两次输入的密码一样'))
    }else{
        callback()
    }
}
//定义表单校验规则
const rules = {
    username: [
        {required:true,message:'请输入用户名',trigger:'blur'},
        {min: 5,max: 16,message:'长度为5~16位非空字符',trigger:'blur'}
    ],
    password: [
        {required:true,message:'请输入密码',trigger:'blur'},
        {min: 5,max: 16,message:'长度为5~16位非空字符',trigger:'blur'}
    ],
    rePassword: [
        {validator:checkRePassword,trigger:'blur'}
    ]
}
const router = useRouter();
const tokenStore = useTokenStore();

const InfoStore = userInfoStore();

const handleLogin = async () => {
    // 校验表单数据
    if (!form.value) return;

    try {
        // 校验表单
        await form.value.validate(); 

        // 调用登录接口
        const result = await userLoginService(registerData.value); 

        if (result.code === 0) {
            // 登录成功，存储 token
            tokenStore.setToken(result.data);
            const token = tokenStore.token;

            // 解码 token 获取用户名
            const decoded = jwtUtil.parseJwt(token);

            // 获取用户信息并存储
            
            const userInfo = await getUserInfoService(decoded.username);
     
            
            InfoStore.setUserInfo(userInfo);// 将用户信息存储到 Pinia

            // 显示欢迎信息
            ElMessage.success(result.msg || `欢迎回来，用户 ${decoded.username}`);
            
            // 跳转到主页
            router.push('/main');
        } else {
            ElMessage.error(result.msg || '登录失败');
        }
    } catch (error) {
        ElMessage.error('登录失败，请检查输入信息');
    }
};

const handleRegister = async() => {
    if (!form.value) return;
    try {
        await form.value.validate(); // 校验表单
        const result = await userRegisterService(registerData.value); // 调用登录接口
        if (result.code === 0) {
            ElMessage.success(result.msg || '注册成功');
        } else {
            ElMessage.error(result.msg || '注册失败');
        }
    } catch (error) {
        ElMessage.error('注册失败，y');
    }
};




</script>

<style scoped>
/* 
   登录页面样式表 (login.css)

   主要样式说明：
   - `.login` ：整体布局，居中显示，带有圆角边框
   - `.bg` ：背景图片样式，包含圆角、大小和定位
   - `.form` ：登录注册表单布局，使用 flex 居中排列(登录注册的表单在同一个页面中，无需分开两个页面来美化)
   - `.title` ：标题居中
   - `.button` ：按钮宽度100%
   - `.flex` ：用于两个元素水平排列并均分空间
   - `.returnToLogin` / `.returnToRegister` ：调整返回登录/注册的字体大小

*/
.login {
    text-align: center;
    padding: 20px;
    height: 100vh;
    
    border: solid black;
    border-radius: 20px 20px 20px 20px;

    .bg {
        
        border-radius: 20px 20px 20px 20px;/* 图片圆角 */
        background: url() no-repeat;
        background-size: 700px 700px; /* 设置图片宽度 ，高度  */
        background-position: 100% 50%; /* 水平，垂直 */
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;
        
        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .returnToLogin{
            font-size: 15px;
        }
        .returnToRegister{
            font-size: 15px;
        }
    }
}

</style>