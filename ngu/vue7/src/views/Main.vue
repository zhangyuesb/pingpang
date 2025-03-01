<template>
    <div class="main">
        <!-- 视频播放区域 -->
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
            <img :src="userAvatar" class="user-avatar" slot="reference">
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
                    <el-dropdown-item command="history">历史记录</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    <el-dropdown-item command="settings">设置</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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
            break;
        case 'logout':
            // 退出登录逻辑，如清除本地存储的用户信息，跳转到登录页面
            router.push('/login');
            break;
        case 'settings':
            console.log('进入设置页面');
            break;
    }
};
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
</style>