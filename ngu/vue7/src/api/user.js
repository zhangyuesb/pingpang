import axios from 'axios';
import { ElMessage } from 'element-plus';

/*存放与后端交互的函数*/
// 登录请求
export const userLoginService = async (data) => {

    try {
        const params = new URLSearchParams();
    for(let key in data){
        params.append(key,data[key]);
    }
        const response = await axios.post('/api/user/login', params);
        return response.data; // 返回后端数据
    } catch (error) {
        console.error('登录失败:', error);
        throw error; // 抛出错误
    }
};

// 注册请求
export const userRegisterService = async (data) => {
    try {
        const params = new URLSearchParams();
    for(let key in data){
        params.append(key,data[key]);
    }
        const response = await axios.post('/api/user/register', params);
        return response.data; // 返回后端数据
    } catch (error) {
        console.error('注册失败:', error);
        throw error; // 抛出错误，便于调用方处理
    }
};

export const updateUserInfoService = async (data) => {
  try {
      const response = await axios.post('/api/user/updateInfo', data, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      return response.data; // 返回后端数据
  } catch (error) {
      console.error('修改用户信息失败:', error.response?.data || error.message);
      throw error; // 抛出错误，便于调用方处理
  }
};

// 上传头像请求
export const uploadAvatarService = async (formData) => {
    try {
      const response = await axios.post("/api/user/uploadAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // 返回后端数据
    } catch (error) {
      console.error("头像上传失败:", error);
      throw error;
    }
  };

// 获取用户信息
export const getUserInfoService = async (username) => {
    
    try {
      const response = await axios.get('/api/user/getUserInfo', {
        params: { username }});
        
      return response.data.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  };
