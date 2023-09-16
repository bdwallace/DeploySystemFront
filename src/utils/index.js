import axios from "axios";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ3YWxsYWNlIiwicGFzc3dvcmQiOiIyYjNiYjMwYjQ0ZjQ1M2M0ZjE4OGRkODVkZWUwYTk2MGVmMzY0YjI0In0.6JltaGkc-OTe13dnmxtZQuJfZm7-v7-hsckBPzB4Tfc"
// axios.defaults.baseURL = 'http://jsonplaceholder.typicode.com'

const errorHandle = (status, other) => {
  switch (status) {
    case 400:
      console.log('信息认证失败');
      break
    case 401:
      console.log('认证失败')
      break
    case 403:
      console.log('token校验失败');
      break
    case 404:
      console.log('请求资源不存在')
      break
    default :
      console.log(other)
      break
  }
}
// 添加请求拦截器
axios.interceptors.request.use(function (config){
  // 在请求之前做些什么
  if (localStorage.token){
    config.headers.Authorization=localStorage.token;
  }
  // config.headers.Authorization = token

  return config;
}, function (error){
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response){
  // 对响应数据做预处理
  // var data = JSON.stringify(response.data)
  console.log('from interceptor:', typeof response.data)
  // return response.data
  return response.status === 200 ? Promise.resolve(response.data): Promise.reject(response.status);
}, function (error){
  // 对响应错误做预处理
  if (error){
    console.log(error);
    // errorHandle(error.status, error.data.message)
    return Promise.reject(error);
  }else {
    console.log('连接断开');
  }
});

export default axios

