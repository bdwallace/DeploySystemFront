const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: '/',  // history 模式引起的资源请求404问题,生产环境要用绝对路径/ 不能用./
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    proxy: {
      '/v1/api': {
        // target : 'http://192.168.10.10:8000'
        target : 'http://127.0.0.1:5000'
        // target: 'http://52.79.252.25:6000'
      }
    }
  }

})