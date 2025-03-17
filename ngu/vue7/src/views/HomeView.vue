<template>
    <div class="home">
            <el-button  class="enter-button"  @click="togglePanel">  <span class="button-text">{{ buttonText }}</span></el-button>
   
    <transition name="slide">
    <div v-show="isPanelOpen" class="login-page">
     <div class="login-content">

     <form>
     <div class="input-group">
                  <input 
                    type="text" 
                    id="username" 
                    v-model="form.username" 
                    class="input-field" 
                    @focus="handleFocus('username')"
                    @blur="handleBlur('username')"
                  />
                  <label 
                    class="input-label" 
                    :class="{ active: isUsernameActive || form.username }"
                    for="username"
                  >
                    用户名
                  </label>
                </div>
                <div class="input-group">
                  <input 
                    type="password" 
                    id="password" 
                    v-model="form.password" 
                    class="input-field" 
                    @focus="handleFocus('password')"
                    @blur="handleBlur('password')"
                  />
                  <label 
                    class="input-label" 
                    :class="{ active: isPasswordActive || form.password }"
                    for="password"
                  >
                    密码
                  </label>
                </div>
                <div  class="button-container">
                    <el-button class="login-button" type="primary" @click="handleLogin">登录</el-button>
                    <el-button class="login-button" @click="handleRegister">注册</el-button>
                  </div>
              </form>
         </div>
    </div>
    </transition>

    </div>
</template>




<script setup>
import { ref,computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userRegisterService, userLoginService,getUserInfoService } from '@/api/user';
import { useTokenStore } from '@/stores/token';
import { jwtUtil } from '@/utils/jwtUtils';
import {userInfoStore} from '@/stores/userInfoStore'

const isRegister = ref(false);
//定义数据模型
const form = ref({
    username:'',
    password:'',
    rePassword:''
})
//校验密码的函数
const checkRePassword = (rule,value,callback)=>{
    if(value==''){
        callback(new Error('请再次确认密码'))
    }else if(value !== form.value.password){
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

    try {

        // 调用登录接口
        const result = await userLoginService(form.value); 

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
    try {
        const result = await userRegisterService(form.value); // 调用登录接口
        if (result.code === 0) {
            ElMessage.success(result.msg || '注册成功');
        } else {
            ElMessage.error(result.msg || '注册失败');
        }
    } catch (error) {
        ElMessage.error('注册失败，y');
    }
};







/*输入框*/
const isUsernameActive = ref(false);
const isPasswordActive = ref(false);
// 处理输入框获取焦点
const handleFocus = (field) => {
  if (field === 'username') isUsernameActive.value = true;
  if (field === 'password') isPasswordActive.value = true;
};

// 处理输入框失去焦点
const handleBlur = (field) => {
  if (field === 'username' && !form.value.username) isUsernameActive.value = false;
  if (field === 'password' && !form.value.password) isPasswordActive.value = false;
};

/*页面*/
const isPanelOpen = ref(false);
const buttonText = computed(() => {
  return isPanelOpen.value ? '返回' : '开始体验'
});

const togglePanel = () => {
  const buttonTextElement = document.querySelector('.button-text');
  if (buttonTextElement) {
    buttonTextElement.classList.add(isPanelOpen.value ? 'leave' : 'enter');
    setTimeout(() => {
      isPanelOpen.value = !isPanelOpen.value;
      buttonTextElement.classList.remove('enter', 'leave');
    }, 150);
  }
};

</script>





<style scoped>
.home {
    min-height: 100vh;
    padding: 20px;
    /*背景*/
    background-image: url('@/assets/background/pingpong6.jpg'); 
    background-size: cover;
    background-position: center; 
    background-repeat: no-repeat; 
}
.enter-button {
    /* 位置 */
    position: fixed;
    top: 50px;
    right: 60px;
    
    /* 大小 */
    width: 150px;
    height: 60px;
    border-radius: 20px !important;
    font-size:20px;
    font-weight: 600;
    letter-spacing: 2px;       
    font-family: 'Microsoft YaHei', sans-serif;

    /* 边框和颜色 */
    border: 2px solid #eb0d5b !important;
    background-color: inherit !important;
    color: #eb0d5b !important;
    
    /* 过渡效果 */
    transition: all 0.3s ease-in-out;
    outline: none !important;
    z-index: 1001;
}

.enter-button:hover {
    background-color: #eb0d5b  !important;
    color:#fff !important;
    transform: scale(1.05);
}
.enter-button:active {
    transform: scale(0.95);
}
.slide-enter-active {
  transition: all 0.5s ease-out;
}

.slide-leave-active {
  transition: all 0.3s ease-in;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.button-text {
  display: inline-block;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

/*文字效果 */
.button-text.enter {
  opacity: 0;
  transform: translateY(-10px);
}
.button-text.leave {
  opacity: 0;
  transform: translateY(10px);
}

/*登录表单*/
.login-page {
    position: fixed;
    TOP: 32%;
    left: 37%;
    transform: translateX(-50%,-50%);
    width: 400px;
    background: #ECF0F1;
    border-radius: 12px 12px 12px 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.356); 
    padding: 20px;
    z-index: 1000;
}

.login-content {
  display: flex;
  justify-content: center; 
  align-items: center; 
  padding: 20px;
}

/* 输入框组 */
.input-group {
  position: relative;
  margin: 40px 0;
}

.input-field {
  width: 100%;
  padding: 10px 10px 10px 5px;
  border: none;
  border-bottom: 2px solid#BDC3C7;
  background: transparent;
  font-size: 16px;
  outline: none;
}

.input-field:focus {
  border-bottom: 2px solid #002878;
}

.input-label {
  position: absolute;
  left: 5px;
  top: 15px;
  color:#7F8C8D;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-label.active {
  top: -12px;
  left: 5px;
  font-size: 12px;
  color: #002878;
}

/*登录注册按钮*/
.button-container {
  display: flex;
  justify-content: space-between;
  gap: 20px; 
}
.login-button {
  background: linear-gradient(
    135deg,
    rgba(0, 123, 255, 0.8), 
    rgba(255, 105, 180, 0.8) 
  ) !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3) !important; 
  color: #fff !important;
  font-family: 'Microsoft YaHei', sans-serif !important;
  font-weight: 600 !important;
  padding: 12px 24px !important;
  transition: all 0.3s ease !important;
}

.login-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 8px rgba(255, 105, 180, 0.5) !important; 
}

.login-button:active {
  transform: translateY(0) !important;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3) !important; 
}

</style>