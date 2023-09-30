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
                      <el-button type="primary" @click="on_submit_build">
                          Build
                      </el-button>
                      <el-button type="primary" @click="buildClick" >
                          快速部署
                      </el-button>
                  <!-- <el-button @click="$router.back()">取消</el-button> -->

              <!-- </div> -->
                  </el-form-item>
              </el-col>
              <el-col :span="19">
                  <el-form-item label="tag标签:">
                      {{formData.run_tag}}
                  </el-form-item>
              </el-col>
          </el-row>
      </el-form>


    </div>
  </el-container>
</template>

<script>

import {getService, uploadCode} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'UploadSvc',
  data() {
    return {
      id: this.$route.params.id,
      Title: "download_6hao_页面上传",
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      dialogCreatePlatformVisable: false,
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

    }
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
</style>