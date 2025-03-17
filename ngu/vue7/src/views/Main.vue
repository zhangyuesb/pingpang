<template>
    <div class="main">
        <!-- 视频播放区域 -->
        <EChartsDemo id="app"/>
        <EChartsRingChart id="app1"/>
        <sixChart id="app2"/>
        <el-card>
            <template #header>
                <h2>视频播放</h2>
            </template>
            <video ref="videoPlayer" controls>
                <source :src="videoUrl" type="video/mp4">
            </video>
        </el-card>
        <!-- 上传视频/摄像头按钮 -->
        <el-card>
            <template #header>
                <h2>视频操作</h2>
            </template>
            <el-upload
                action="#"
                :on-change="uploadVideo"
                :before-upload="beforeUpload"
                accept="video/*"
            >
                <el-button slot="trigger" type="primary">上传视频</el-button>
            </el-upload>
            <el-button @click="openCamera">打开摄像头</el-button>
        </el-card>
        <!-- AI问答 -->
        <el-card>
            <template #header>
                <h2>AI问答</h2>
            </template>
            <el-button @click="toggleAIQnA">AI问答</el-button>
            <el-dialog :visible.sync="showAIQnA" title="AI问答">
                <template #content>
                    <!-- AI问答对话框内容 -->
                    <el-input v-model="question" placeholder="请输入问题"></el-input>
                    <el-button @click="askQuestion">提问</el-button>
                </template>
                <template #footer>
                    <el-button @click="showAIQnA = false">关闭</el-button>
                </template>
            </el-dialog>
        </el-card>
         <!-- 分析报告 -->
         <el-card v-if="analysisReport">
            <template #header>
                <h2>分析报告</h2>
            </template>
            <p>{{ analysisReport }}</p>
            <el-input v-model="userInput" placeholder="输入训练数据获取更详细建议"></el-input>
            <el-button @click="getMoreSuggestions">获取更多建议</el-button>
        </el-card>
        <!-- 用户头像及下拉列表 -->
        <el-dropdown @command="handleCommand">
            <img :src="form.avatarUrl" class="user-avatar" slot="reference">
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="userInfo" @click="isVisible = true">用户信息</el-dropdown-item>
                    <el-dropdown-item command="history">历史记录</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    <el-dropdown-item command="settings">设置</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
    <div class="container">
    <!-- 遮罩层（点击关闭） -->
    <div v-if="isVisible" class="overlay" @click="closeDrawer"></div>

    <!-- 右侧滑动面板 -->
    <transition name="slide"> 
      <div v-if="isVisible" class="drawer">
        <el-row style="height: 100vh; display: flex; justify-content: center; align-items: center; position: relative;">
    
    <!-- 右上角关闭按钮 -->
    <el-icon class="close-btn" :size="30" @click="isVisible=false">
      <Close />
    </el-icon>

    <el-col :span="12" 
            style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; height: 80vh; margin-top: 10vh;">
      
      <div class="demo-basic--circle" style="display: flex; flex-direction: column; align-items: center;">
        <!-- 头像 -->
        <div class="block">
          <el-avatar :size="180" :src="form.avatarUrl" />
        </div>

        <!-- 用户名 -->
        <div style="margin-top: 20px; font-size: 30px;">{{ infoStore.name }}</div>
      </div>

      <!-- 用户信息条 -->
            <el-divider />

            <el-row class="info-row">
              <el-col :span="6" class="info-label">邮箱</el-col>
              <el-col :span="18" class="info-content">{{ infoStore.mail }}</el-col>
            </el-row>
            <el-divider />

            <el-row class="info-row">
              <el-col :span="6" class="info-label">电话</el-col>
              <el-col :span="18" class="info-content">{{ infoStore.phone }}</el-col>
            </el-row>
            <el-divider />

            <el-row class="info-row">
              <el-col :span="6" class="info-label">地址</el-col>
              <el-col :span="18" class="info-content">{{ infoStore.address }}</el-col>
            </el-row>
            <el-divider />

      <!--设置按钮-->  
        <el-icon class="user-settings-btn"size="30" @click="dialogFormVisible=true"><Setting /></el-icon>
    </el-col>
  </el-row>

      </div>
    </transition>
     
  </div>
  <div>
   <!-- 用户信息修改框 -->
  <el-dialog v-model="dialogFormVisible" title="修改信息" width="500" @open="openDialog">
    <el-form :model="tempForm">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="tempForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="tempForm.mail" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="tempForm.address" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="tempForm.phone" autocomplete="off" />
      </el-form-item>

      <!-- 头像上传区域 -->
      <el-form-item label="头像" :label-width="formLabelWidth">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadAvatar"
        >
          <img v-if="tempForm.avatarUrl" :src="tempForm.avatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelUpdate">取消</el-button>
        <el-button type="primary" @click="confirmUpdate">确定</el-button>
      </div>
    </template>
  </el-dialog>
  </div>

  <div
            ref="floatingBall"
            class="floating-ball"
            :style="{ left: ballLeft + 'px', top: ballTop + 'px' }"
            @mousedown="startDrag"
            @dblclick="toggleDialog"
        ></div>

     <div
            class="dialog-container"
            :class="{ 'dialog-left': isDialogLeft, 'dialog-right': !isDialogLeft }"
            v-if="showDialog"
            :style="{
                left: dialogLeft + 'px',
                top: dialogTop + 'px',
                transform: dialogTransform,
            }"
        >
            <el-card>
                <template #header>
                    <h2>悬浮球对话框</h2>
                </template>
              
                   <div class="chat-messages" id="chatMessages"></div>
                    <div class="input-area">
                        <input type="text" id="user-input" placeholder="输入你的问题...">
                        <button id="send-button" @click="sendMessage">发送</button>
                    </div>
                
                <template #footer>
                    <el-button @click="toggleDialog">关闭</el-button>
                </template>
            </el-card>
        </div>

    
     <!-- 聊天框
     <div v-show="isChatOpen" class="chat-container" ref="chatContainer" id="chatContainer">

      <div class="chat-messages" id="chatMessages"></div>
      <div class="input-area">
          <input type="text" id="user-input" placeholder="输入你的问题...">
          <button id="send-button" @click="sendMessage">发送</button>
      </div>
  </div> -->
  
</template>

<script setup>
import { ref ,onMounted,reactive,onUnmounted,computed } from 'vue';
import { useRouter } from 'vue-router';
import EChartsRingChart from '../components/EChartsRingChart.vue';
import EChartsDemo from '../components/EChartsDemo.vue';
import sixChart from '../components/six.vue';

const videoUrl = ref('');
const analysisReport = ref('');
const showAIQnA = ref(false);
const userAvatar = ref('user-avatar-url');
const userInput = ref('');
const question = ref('');
const router = useRouter();

const uploadVideo = (file) => {
    // 调用后端接口上传视频并获取分析报告
    console.log('上传视频:', file);
};

const beforeUpload = (file) => {
    // 上传前的校验逻辑
    return true;
};

const openCamera = () => {
    // 打开摄像头逻辑
    console.log('打开摄像头');
};

const toggleAIQnA = () => {
    showAIQnA.value =!showAIQnA.value;
};

const askQuestion = () => {
    // 调用AI问答接口逻辑
    console.log('提问:', question.value);
};

const getMoreSuggestions = () => {
    // 根据用户输入获取更多训练建议逻辑
    console.log('获取更多建议:', userInput.value);
};

const handleCommand = (command) => {
  switch (command) {
        case 'userInfo':
            console.log('查看用户信息');
            break;
        case 'history':
            console.log('查看历史记录');
            router.push('/history');
            break;
        case 'logout':
            // 退出登录逻辑，如清除本地存储的用户信息，跳转到登录页面
            router.push('/login');
            break;
        case 'settings':
            console.log('进入设置页面');
            router.push('/setting');
            break;
    }
};

/*此部分为用户信息模块部分*/
//页面滑动效果有关
const isVisible = ref(false);
    // 关闭抽屉
    const closeDrawer = () => {
      isVisible.value = false;
    };

//解析用户名有关
import { useTokenStore } from '@/stores/token';
import { jwtUtil } from '@/utils/jwtUtils';
const username = ref('');
const tokenStore = useTokenStore();
const fetchUsername = async () => {
  if (!tokenStore.token) return;

  username.value = form.value.name;
};

import { Close,Setting,Plus } from '@element-plus/icons-vue'; 


//修改用户信息界面
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = ref({
  name: '',
  mail: '',
  address: '',
  phone: '',
  avatarUrl: '',
});

import { updateUserInfoService, uploadAvatarService,getUserInfoService } from '@/api/user';
import { ElMessage } from 'element-plus';

// 修改头像逻辑
// 头像上传成功后处理
// 上传头像
const uploadAvatar = async (param) => {
  try {
    
    let formData = new FormData();
    formData.append("file", param.file);  // 头像文件
    formData.append("username", infoStore.name); // 用户名

    const response = await uploadAvatarService(formData); // 调用后端接口
    
      form.value.avatarUrl = response.data; // 更新本地头像 URL
      tempForm.value.avatarUrl = response.data;
      infoStore.setUserInfo(form.value);
      userAvatar.value = form.value.avatarUrl;
      ElMessage.success("头像上传成功");
  } catch (error) {
    ElMessage.error("头像上传失败");
  }
};


// 上传前的校验
const beforeAvatarUpload = (file) => {
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    ElMessage.error('头像必须是 JPG/PNG 格式');
    return false;
  } else if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB');
    return false;
  }
  return true;
};

//pinia仓库
import {userInfoStore} from '@/stores/userInfoStore'
const infoStore = userInfoStore();

//更新数据
// 临时存储用户修改数据的对象
const tempForm = ref({
  name: '',
  mail: '',
  address: '',
  phone: '',
  avatarUrl: ''
});

import { toRaw } from 'vue';
// 取消修改，直接关闭弹框
const cancelUpdate = () => {
  dialogFormVisible.value = false;

  //恢复原样
  tempForm.value.name = form.value.name;
  tempForm.value.mail = form.value.mail;
  tempForm.value.address = form.value.address;
  tempForm.value.phone = form.value.phone;
  tempForm.value.avatarUrl = form.value.avatarUrl;
};

// 确认修改，更新数据到 Pinia
const confirmUpdate = async() => {
  //更新后端数据
  const plainData = toRaw(tempForm.value);
  const decoded = jwtUtil.parseJwt(tokenStore.token);
  plainData.id = decoded.id
  const response =  await updateUserInfoService(plainData);
  if(response.code === 0){
     // 更新 Pinia Store
  infoStore.setUserInfo(tempForm.value);

  // 同步更新 form 里的数据
  username.value = tempForm.value.name;
  form.value.name = tempForm.value.name;
  form.value.address = tempForm.value.address;
  form.value.mail = tempForm.value.mail;
  form.value.phone = tempForm.value.phone;
  form.value.avatarUrl = tempForm.value.avatarUrl;
  
  ElMessage.success('更新成功！')

  // 关闭弹框
  dialogFormVisible.value = false;
  }else{
    ElMessage.error('更新失败')
  }

 
};


//AI问答按钮
const API_KEY = "	CeOnIuApShDRXrJ0rPPIlwku";
const SECRET_KEY = "V9ixqzT0D0LHul3TWQe5UzerhY10zjIW";

let accessToken = "";
let tokenExpireTime = 0; // 记录 token 过期时间（时间戳）

const getAccessToken = async () => {
    const currentTime = Math.floor(Date.now() / 1000); // 获取当前时间（秒）

    // 1️⃣ 如果 accessToken 存在且未过期，直接返回
    if (accessToken && currentTime < tokenExpireTime) {
        console.log("使用缓存的 access_token");
        return accessToken;
    }

    try {
        // 2️⃣ 发送请求获取新的 access_token
        console.log("请求新的 access_token...");
        const response = await fetch(
            `/baidu-api/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`,
            { method: "POST" }
        );

        if (!response.ok) {
            throw new Error(`请求失败，状态码: ${response.status}`);
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error(`获取 access_token 失败: ${JSON.stringify(data)}`);
        }

        // 3️⃣ 存储 access_token，并记录过期时间
        accessToken = data.access_token;
        tokenExpireTime = currentTime + (data.expires_in || 2592000); // 默认 30 天

        console.log("获取新的 access_token:", accessToken);
        return accessToken;
    } catch (error) {
        console.error("获取 access_token 失败:", error);
        return null;
    }
};


// 发送消息到文心大模型
const sendMessage=async()=> {
            const input = document.getElementById('user-input');
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            input.value = '';

            try {
                // 调用文心API

                // 检查access_token有效性
                if (!accessToken) {
                    accessToken = await getAccessToken();
                }
                const response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k?access_token=${accessToken}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: "user", content: message }
                        ],
                        stream: false
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.error_code) {
                    throw new Error(data.error_msg);
                }

                const botReply = data.result;
                addMessage(botReply, 'bot');

            } catch (error) {
                console.error(error);
                addMessage("请求失败，请检查网络和API配置", 'bot');
            }
        }

        const addMessage=async(text, sender)=> {
            const messagesDiv = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            console.log(messageDiv.className)
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // 自动滚动到底部
        }

  

// 悬浮球的位置
const ballLeft = ref(0);
const ballTop = ref(0);
// 鼠标按下时的初始偏移量
const offsetX = ref(0);
const offsetY = ref(0);

// 是否正在拖动
const isDragging = ref(false);

// 对话框的显示状态
const showDialog = ref(false);

// 悬浮球的 DOM 元素
const floatingBall = ref(null);
// 对话框的位置
const dialogLeft = ref(0);
const dialogTop = ref(0);

// 对话框的延伸方向
const isDialogLeft = computed(() => ballLeft.value < window.innerWidth / 2);

// 对话框的动画效果
const dialogTransform = computed(() => {
    return showDialog.value ? 'scale(1)' : 'scale(0)';
});
// 鼠标按下时开始拖动
const startDrag = (e) => {
    if (showDialog.value) return;
    isDragging.value = true;
    offsetX.value = e.clientX - ballLeft.value;
    offsetY.value = e.clientY - ballTop.value;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    floatingBall.value.style.transition = 'none';

};

// 拖动过程中更新悬浮球的位置
const onDrag = (e) => {
    if (isDragging.value) {
        requestAnimationFrame(() => {
            ballLeft.value = e.clientX - offsetX.value; 
            ballTop.value = e.clientY - offsetY.value; 
        });
    }
};

// 鼠标松开时停止拖动，并判断是否吸附到左右两侧
const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const ballWidth = floatingBall.value.offsetWidth;
    const ballHeight = floatingBall.value.offsetHeight;

    // 限制悬浮球的垂直范围，防止超出屏幕
    if (ballTop.value < 0) {
        ballTop.value = 0;
    } else if (ballTop.value > windowHeight - ballHeight) {
        ballTop.value = windowHeight - ballHeight;
    }

    // 判断吸附到左侧还是右侧
    if (ballLeft.value < windowWidth / 2) {
        ballLeft.value = 0; 
    } else {
        ballLeft.value = windowWidth - ballWidth; 
    }
    floatingBall.value.style.transition = 'left 0.3s ease, top 0.3s ease';
};

// 点击悬浮球时切换对话框的显示状态
const toggleDialog = () => {
    if (!isDragging.value) {
        showDialog.value = !showDialog.value;
    }

    // 更新对话框的位置
    if (showDialog.value) {
        const dialogWidth = 200; 
        const dialogHeight = 300;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算对话框的水平位置
        if (isDialogLeft.value) {
            dialogLeft.value = ballLeft.value + 50; 
        } else {
            dialogLeft.value = ballLeft.value - dialogWidth;
        }

        // 确保对话框不超出右边界
        if (dialogLeft.value + dialogWidth > windowWidth) {
            dialogLeft.value = windowWidth - dialogWidth;
        }

        // 确保对话框不超出左边界
        if (dialogLeft.value < 0) {
            dialogLeft.value = 0;
        }

        // 计算对话框的垂直位置
        dialogTop.value = ballTop.value;

        // 确保对话框不超出下边界
        if (dialogTop.value + dialogHeight > windowHeight) {
            dialogTop.value = windowHeight - dialogHeight;
        }

        // 确保对话框不超出上边界
        if (dialogTop.value < 0) {
            dialogTop.value = 0;
        }
    }
};


/*该函数会在组件加载时调用，进入页面后需要调用的函数均放在这里 */
onMounted(async() => {
  accessToken = await getAccessToken();
  fetchUsername();
  infoStore.initUserInfo();

  form.value.name = infoStore.name;
  form.value.mail = infoStore.mail;
  form.value.address = infoStore.address;
  form.value.phone = infoStore.phone;
  form.value.avatarUrl = infoStore.avatarUrl;

  tempForm.value.name = form.value.name;
  tempForm.value.mail = form.value.mail;
  tempForm.value.address = form.value.address;
  tempForm.value.phone = form.value.phone;
  tempForm.value.avatarUrl = form.value.avatarUrl;



  const windowWidth = window.innerWidth;
    const ballWidth = floatingBall.value.offsetWidth;
    ballLeft.value = windowWidth - ballWidth; 
    ballTop.value = 100; 
});

// **清理监听器**
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.main {
    padding: 20px;
}
.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
}
.container {
  position: relative;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 右侧抽屉 */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  z-index: 1001;
}

/* 右上角 X 按钮 */
.close-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  color: #666;
  transition: 0.3s;
}

/*左下角设置按钮 */
.user-settings-btn {
  position: absolute;
  bottom: 25px;
  left: 0px;
  cursor: pointer;
  color: #666;
  transition: 0.3s;
}
/* 鼠标悬停时变 */
.user-settings-btn:hover {
  color: blue;
}

/* 鼠标悬停时变红 */
.close-btn:hover {
  color: red;
}

/* 信息行 */
.info-row {
  display: flex;
  align-items: center;
  width: 150%; 
  margin: 5px 0; 
}
/* 分割线 */
.el-divider {
  width: 150%; 
  border-color: rgba(0, 0, 0, 0.1);
  border-top-width: 0.8px; 
  margin: 15px 0;
}

/* 标签样式 */
.info-label {
  font-weight: bold;
  text-align: left;
}

/* 信息内容 */
.info-content {
  text-align: left;
  color: #666;
}



/* 滑动动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.avatar-uploader .avatar {
  width: 170px;
  height: 170px;
  display: block;
}

/*AI问答按钮*/
.chat-messages {
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    padding: 15px;
    overflow-y: auto;
}

.message {
    display: block;
    margin: 8px 0;
    padding: 10px;
    border-radius: 8px;
    max-width: 80%;
    word-wrap: break-word; 
}

.user-message {
    background: #007bff;
    color: white;
    align-self: flex-end; 
    text-align: right;
}

.bot-message {
    background: #f1f1f1;
    align-self: flex-start; 
    text-align: left;
}


.input-area {
    padding: 15px;
    border-top: 1px solid #ddd;
    display: flex;
    flex-direction: column; 
    align-items: center; 
    gap: 10px; 
}

#user-input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%; 
}

#send-button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: auto; 
    min-width: 100px; 
    text-align: center;
}


        

.floating-ball {
    right: 10px;
    top: 100px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, rgba(250, 165, 28, 0.9), rgba(236, 171, 86, 0.8));
    border-radius: 50%;
    position: fixed;
    cursor: pointer;
    user-select: none;
    z-index: 1000;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: none; 
}

.floating-ball::before {
    content: '😊';  
    font-size: 28px;
    color: #fff;   
}

.floating-ball:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.floating-ball:active {
    transform: scale(0.95);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.floating-ball:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); 
}

.floating-ball:active {
    transform: scale(0.95); 
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dialog-container {
    position: fixed;
    transform-origin: top center;
    transition: transform 0.3s ease;
    z-index: 999;
    z-index: 999;
    max-width: 90vw; 
    max-height: 90vh; 
    overflow: auto;
}

.dialog-left {
    transform-origin: top left;
}

.dialog-right {
    transform-origin: top right;
}
#app2 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 170px;
  height: 170px;
  text-align: center;
}
</style>