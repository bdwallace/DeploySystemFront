<template>
  <el-container style="height: 100%">
    <div class="create-server-block">
      <el-form label-width="100px">
          <el-row>
              <el-col :span="5">
                  <el-form-item label="任务标题:">
                      {{ Title }}
                  </el-form-item>

                  <el-form-item label="服务名称:">
                      {{formData.svc_name}}
                  </el-form-item>

                  <el-form-item label="页面上传:">
                      <el-upload
                          class="upload-demo"
                          action="http://127.0.0.1:8192"
                          accept=".zip"
                          :http-request = "handleGetFile">
                          <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                  </el-form-item>

              </el-col>

              <el-col :span="19">
                  <el-form-item label="部署路径:">
                      {{formData.upload_path}}
                  </el-form-item>

                  <el-form-item label="绑定域名:">
                      <span v-for="item in formData.domains" :key="item.domain">
                          {{ item.domain }}、
                      </span>
                  </el-form-item>

                  <el-form-item label="Build ip:">
                      <!-- <span v-for="host in service.Hosts" :key="host"> -->
                        <div style="display: inline-block;margin-right: 20px" v-for="item in formData.host_list">
                            <el-tag size="small">{{item['public_ip']}}</el-tag>
                            <el-tag size="small" style="margin-left: 5px">{{item['inner_ip']}}</el-tag>
                        </div>
                      <!-- </span> -->
                  </el-form-item>

              </el-col>
          </el-row>
          <el-row>
              <el-col :span="5">
                  <el-form-item>
                      <el-button type="primary" @click="buildClick">
                          Build
                      </el-button>
                      <el-button type="primary" @click="quickDeployClick" >
                          快速部署
                      </el-button>
                  <!-- <el-button @click="$router.back()">取消</el-button> -->

              <!-- </div> -->
                  </el-form-item>
              </el-col>
              <el-col :span="19">
                  <el-form-item label="tag标签:">
                      {{formData.target_tag}}
                  </el-form-item>
              </el-col>
          </el-row>
      </el-form>
      <div class="log">
        <code style="background-color: rgb(0, 0, 0);color:#00ff00">
            <br>
            <span v-for="(n, i) in showText" :style="{'color': n.color}" :key="i"> <pre style=" white-space: pre-wrap;" v-html="n.text"></pre> <br></span>
            <br>
        </code>
      </div>

    </div>

  </el-container>
</template>

<script>

import {addProcess, buildCode, buildLog, getService, uploadCode} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'UploadSvc',
  data() {
    return {
      id: this.$route.params.id,
      Title: "页面上传",
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      dialogCreatePlatformVisable: false,
      showText:[
        {}
      ],
      timer: null,
      formData: {

      }
    }
  },
  created() {
    this.fetchData()

  },
  methods: {
    async fetchData() {
      this.params.search = this.$route.params.id
      var resp = await getService(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.formData = resp.data[0]
        this.Title = this.formData.svc_name + "_页面上传"
        this.getLog()
      }
    },
    handleGetFile(data) {
      this.on_submit_loading = true
      var name = this.formData.svc_name + ".zip"
      var formdata = new FormData()
      formdata.append("file", data.file)
      formdata.append("name", name)

      uploadCode(formdata).then(resp =>{
        if (resp.code !== 200){
          this.$message({type: 'warning', message: resp.msg})
        }else {
          this.$message({type: 'success', message: resp.msg})
        }
      }).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
      })
    },
    async on_submit_build(){

    },
    buildClick(){
      // console.log("????????????")
      buildCode({svc_name: this.formData.svc_name}).then(resp => {
        if (resp.code !== 200){
          this.$message({type: 'warning', message: resp.msg})
          return 0
        }else {
          this.$message({type: 'success', message: resp.msg})
          this.timer = setInterval(() => {
          setTimeout(this.getLog,1)
        }, 60*30)
        }
      }).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
      })
    },
    async quickDeployClick(){
      var response = await addProcess({"id": this.formData.id}).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
        return
      } else {
        this.$message({type: "success", message: response.msg})
      }
      // console.log(response.data)
      this.$router.push('/services/deploy/' + response.data.task_id)
    },
    getLog(){
      console.log({svc_name: this.formData.svc_name})
      buildLog({svc_name: this.formData.svc_name}).then(resp => {
        let text_list = resp.data.text.split("\n")
        this.showText = []
        text_list.forEach(item => {
          let i = {}
          // console.log(item.indexOf('成功'))
          if (item.indexOf('成功') !== -1) {

            i.color = '#00ff00'
            i.text = item
            this.showText.push(i)
          } else {
            i.color = '#FDFEFE'
            i.text = item
            this.showText.push(i)
          }
          if (item.indexOf('编译成功') !== -1 || item.indexOf('发布失败') !== -1) {
            clearInterval(this.timer)
            this.timer = null
          }
        })
        // console.log(this.showText)
        this.formData.target_tag = resp.data.target_tag
        }).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
        })

    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main {
  margin-top: 1px;
  width: 100%;
  height: 90%;
  margin-left: 15px;
}

.search-bock {
  margin-top: 15px;
}

.el-table {
  width: 100%;
//height: 100vh;
}

.certTable {
  width: 99%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100vh;*/
}

.certTable ::v-deep .el-table .cell {
  white-space: pre-line;
}


.create-server-block {
  background-color: white;
  padding: 20px;
  margin-top: 15px;
  width: 97%;
  margin-left: 20px;
  margin-right: 10px;
}



.log {
  width: 99%;
  margin-top: 5px;
  padding: 3px;
  border: 1px dashed rgb(0, 160, 198);
  background-color: rgb(0,0,0);
}
</style>