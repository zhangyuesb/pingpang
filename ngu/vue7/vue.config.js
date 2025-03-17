module.exports = {
  transpileDependencies: true,
  devServer: {
    port: 8081,  // 修改默认端口为 
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 设置代理，后端 API 地址
        changeOrigin: true,  // 允许跨域
        pathRewrite: { '^/api': '' },  // 去掉前缀
      },
      '/baidu-api': {
        target: 'https://aip.baidubce.com',  // 设置百度 API 地址
        changeOrigin: true,  // 允许跨域
        pathRewrite: { '^/baidu-api': '' },  // 去掉前缀
      },
    },
    hot: true,  // 开启热更新
  },
};

