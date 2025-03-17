<template>
  <nav>
    <router-link to="/main">返回</router-link> 
  </nav>
  <div class="settings-page">
    <el-card>
      <template #header>
        <h1>设置</h1>
      </template>
      <el-form label-width="120px">
        <!-- 清除数据 -->
        <el-form-item label="清除数据">
          <el-button type="danger" @click="clearData">清除所有数据</el-button>
        </el-form-item>
        <!-- 修改密码 -->
        <el-form-item label="修改密码">
          <el-button @click="openChangePasswordDialog">修改密码</el-button>
        </el-form-item>
        <!-- 绑定手机 -->
        <el-form-item label="绑定手机">
          <template #content>
            <span v-if="isPhoneBound">已绑定: {{ phoneNumber }}</span>
            <span v-else>未绑定</span>
            <el-button @click="openBindPhoneDialog" v-if="!isPhoneBound">绑定手机</el-button>
            <el-button @click="openUnbindPhoneDialog" v-else>解除绑定</el-button>
          </template>
        </el-form-item>
        <!-- 版本信息 -->
        <el-form-item label="版本信息">
          <span>{{ version }}</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog :visible.sync="changePasswordDialogVisible" title="修改密码">
      <template #content>
        <el-form :model="passwordForm" ref="passwordFormRef" label-width="120px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="changePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitChangePassword">确定</el-button>
      </template>
    </el-dialog>

    <!-- 绑定手机对话框 -->
    <el-dialog :visible.sync="bindPhoneDialogVisible" title="绑定手机">
      <template #content>
        <el-form :model="phoneForm" ref="phoneFormRef" label-width="120px">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="phoneForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="phoneForm.code"></el-input>
            <el-button @click="sendVerificationCode">获取验证码</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="bindPhoneDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBindPhone">确定</el-button>
      </template>
    </el-dialog>

    <!-- 解除绑定手机对话框 -->
    <el-dialog :visible.sync="unbindPhoneDialogVisible" title="解除绑定手机">
      <template #content>
        <p>确认要解除当前绑定的手机号码吗？</p>
      </template>
      <template #footer>
        <el-button @click="unbindPhoneDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUnbindPhone">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 模拟数据
const isPhoneBound = ref(false);
const phoneNumber = ref('');
const version = ref('1.0.0');

// 清除数据
const clearData = () => {
  // 这里添加清除数据的逻辑，例如清除本地存储等
  console.log('清除所有数据');
};

// 修改密码相关
const changePasswordDialogVisible = ref(false);
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordFormRef = ref(null);

const openChangePasswordDialog = () => {
  changePasswordDialogVisible.value = true;
};

const submitChangePassword = () => {
  // 这里添加修改密码的逻辑，例如发送请求到后端
  console.log('提交修改密码表单', passwordForm);
  changePasswordDialogVisible.value = false;
};

// 绑定手机相关
const bindPhoneDialogVisible = ref(false);
const phoneForm = reactive({
  phone: '',
  code: ''
});
const phoneFormRef = ref(null);

const openBindPhoneDialog = () => {
  bindPhoneDialogVisible.value = true;
};

const sendVerificationCode = () => {
  // 这里添加发送验证码的逻辑，例如发送请求到后端
  console.log('发送验证码到', phoneForm.phone);
};

const submitBindPhone = () => {
  // 这里添加绑定手机的逻辑，例如发送请求到后端
  console.log('提交绑定手机表单', phoneForm);
  isPhoneBound.value = true;
  phoneNumber.value = phoneForm.phone;
  bindPhoneDialogVisible.value = false;
};

// 解除绑定手机相关
const unbindPhoneDialogVisible = ref(false);

const openUnbindPhoneDialog = () => {
  unbindPhoneDialogVisible.value = true;
};

const submitUnbindPhone = () => {
  // 这里添加解除绑定手机的逻辑，例如发送请求到后端
  console.log('解除绑定手机');
  isPhoneBound.value = false;
  phoneNumber.value = '';
  unbindPhoneDialogVisible.value = false;
};
</script>

<style scoped>
.settings-page {
  padding: 20px;
}
</style>