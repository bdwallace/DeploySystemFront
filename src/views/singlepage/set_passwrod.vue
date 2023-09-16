<template>
  <el-container style="height: 100%">
    <el-header height="70">
      <h1 >修改初始密码</h1>
    </el-header>
    <el-container class="con-main">
      <div style="width: 90%;height: 100px; margin-top: 50px">
        <el-steps :active="active" finish-status="success">
          <el-step title="首次登录"></el-step>
          <el-step title="修改初始密码"></el-step>
          <el-step title="添加Google身份验证器"></el-step>
          <el-step title="重新登录"></el-step>
        </el-steps>
      </div>

      <div style="margin-top: 30px;" v-if="form_show">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm" >
          <el-form-item label="用户名" prop="pass">
            <el-input v-model="ruleForm.user_name" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass" >
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" style="width: 500px"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 50px">
            <el-button type="primary" style="width: 500px" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="centered-content" v-else>
        <div class="vertical-container">
          <qr-code :text="text" style="border: 5px solid white"></qr-code>
          <span style="margin-top: 20px">密钥：{{ token }}</span>
          <el-button type="success" plain style="width: 200px;margin-top: 20px" @click="nextClick">下一步<i class="el-icon-arrow-right el-icon--right"/></el-button>
        </div>
      </div>

    </el-container>
</el-container>
</template>

<script>
import Vue from "vue";
import VueQRCodeComponent from 'vue-qrcode-component'
import {setPassword} from "@/api";
Vue.component('qr-code', VueQRCodeComponent)
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dashboard',
  components: {VueQRCodeComponent},
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.password === "4peK%UhTi^b%k6eN"){
            callback(new Error('不能与初始密码一样'));
          }
          let result = /[A-Z]/.test(this.ruleForm.password)
          if (!result){
            callback(new Error('密码应包含大写字母'));
          }
          result = /[0-9]/.test(this.ruleForm.password)
          if (!result){
            callback(new Error('密码应包含数字'));
          }
          result = /[a-z]/.test(this.ruleForm.password)
          if (!result){
            callback(new Error('密码应包含小写字母'));
          }
          result = /[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(this.ruleForm.password);
          if (!result){
            callback(new Error('密码应包含特殊字符'));
          }
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      active: 2,
      form_show: true,
      text: 'otpauth://totp/Oss Platform:nick?secret=7IN3UXTX3KMZTHZJBZSZ4NFAGUZZPNJF&issuer=Oss Platform',
      params: {page: 1, pagesize: 100, total: 0, search: ""},
      token: "7IN3UXTX3KMZTHZJBZSZ4NFAGUZZPNJF",
      ruleForm: {
        user_name: this.$route.params.user_name,
        password: '',
        checkPass: '',
      },
      rules:{
        pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
      },
      data: [],
    }
  },
  created() {
  },
  methods: {
    async submitForm() {
      this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            this.active = 2
            // this.text = 'otpauth://totp/Oss Platform:'+ this.ruleForm.user_name + '?secret=7IN3UXTX3KMZTHZJBZSZ4NFAGUZZPNJF&issuer=Oss Platform'
            var response = await setPassword(this.ruleForm).catch(() => {
              this.$message({type: 'error', message: "请求错误，请检查网络连接"})
            })
            if (response.code === 200) {
              this.$message({type: 'success', message: response.msg});
              this.active = 2
              this.text = 'otpauth://totp/Oss Platform:'+ this.ruleForm.user_name + '?secret='+response.data.token+'&issuer=Oss Platform'
              this.form_show = false
            } else {
              this.$message({type: 'error', message: response.msg});
            }

          } else {

          }
        });


    },

    nextClick(){
      this.active = 3
      setTimeout(() => {
        this.active = 4
        setTimeout(() => {this.active = 5}, 100)
        console.log('已完成')
        this.$router.push('/login')
      }, 400)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.el-header, .el-footer {
  background-color: #67C23A;
  color: white;
  text-align: center;
}

.con-main {
  background: rgb(217,248,201);
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
}
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vertical-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/deep/ .el-input__inner {
  height: 47px;
  background-color: rgba(255, 255, 255, 0.247);
}

/deep/ .el-form-item {
  background-color: unset !important;
}

body {
  height: 100%;
  //font-size: 20px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
