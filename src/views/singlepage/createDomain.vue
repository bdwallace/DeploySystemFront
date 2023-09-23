<template>
  <el-container style="height: 100%">
    <div class="create-server-block">
      <el-form :model="formData" ref="formData" label-width="110px" style="width: 50%" size="medium">
        <el-form-item prop="domain" label="域名" label-width="120px" required style="margin-top: 10px">
          <el-input type="textarea" v-model="formData.domain" placeholder="一行一个域名" ></el-input>
        </el-form-item>

        <el-form-item prop="project" label="项目环境" label-width="120px" required style="margin-top: 10px">
          <el-select v-model="formData.project" placeholder="请选择项目环境" style="width: 100%">
            <el-option v-for='item in projects' :label="item.project_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称/备注" label-width="120px" required>
          <el-input v-model="formData.remark" placeholder="请输入备注" ></el-input>
        </el-form-item>

<!--        <el-form-item label="Crt" label-width="120px" >-->
<!--          <el-button type="primary" size="mini">查看</el-button>-->
<!--          <el-button type="primary" size="mini" style="margin-left: 100px">上传</el-button>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="Key" label-width="120px" >-->
<!--          <el-button type="primary" size="mini">查看</el-button>-->
<!--          <el-button type="primary" size="mini" style="margin-left: 100px">上传</el-button>-->
<!--        </el-form-item>-->

        <el-form-item label="证书文件" label-width="120px">
           <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :limit="2"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="beforeUpload"
            action="-"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传crt/key文件，且不超过1M</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="是/否监控" label-width="120px">
          <el-radio-group v-model="formData.is_monitor">
            <el-radio label="否"></el-radio>
            <el-radio label="是"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是/否CDN加速" label-width="120px">
          <el-radio-group v-model="formData.is_speed">
            <el-radio label="否"></el-radio>
            <el-radio label="是"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="域名服务类型" label-width="120px">
          <el-select v-model="formData.domain_type" placeholder="请选择域名服务类型" style="width: 100%">
            <el-option v-for="item in all_svc_types" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="平台关联" label-width="120px" >
          <el-select v-model="formData.platform" multiple placeholder="请选择平台" style="width: 100%">
            <el-option v-for="item in all_platform" :label="item.platform_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <el-button type="primary" @click="createDomainCommit('create')" v-if="id==='0'">立即提交</el-button>
      <el-button type="primary" @click="createDomainCommit('update')" v-else>立即提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </el-container>
</template>

<script>

import {addDomain, editDomain, getDomain, getPlatform, getProject} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'CreateDomain',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      itemDockerPort: [2375, 32375],
      on_submit_loading: false,
      id: this.$route.params.id,
      input: {},
      fileList: [],
      uploadData: [],
      all_svc_types: ["H5", "download", "h5-proxy", "h5-site", "mqtt", "gateway"],
      all_platform: ['预生产共同-u8', '预生产3300-U8', 'Pre-桑巴舞-3302'],
      projects: [],
      formData: {
        domain: "",
        remark: "",
        is_monitor: "是",
        is_speed: "否",
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {

      var resp = await getPlatform(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.all_platform = resp.data
        // this.params.total = resp.total
      }

      var resp = await getProject(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.projects = resp.data
        // this.params.total = resp.total
      }

      if (this.$route.params.id === '0'){
        return
      }
      this.params.search = this.$route.params.id
      var resp = await getDomain(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.formData = resp.data[0]
        // this.params.total = resp.total
      }
    },
    del_value(index) {
        delete this.formData.params.splice(index, 1)
    },

    add_value() {
      this.formData.params.push({name: "", content: ""})
      //可以强制重新渲染页面
      // this.$forceUpdate();
    },
    async createDomainCommit(commit_type){
      // console.log(this.formData)
      const formdata = new FormData();
      formdata.append('crt', this.uploadData.crt)
      formdata.append('key', this.uploadData.key)
      formdata.append("data", JSON.stringify(this.formData))
      // console.log(formdata)
      if (commit_type === "create"){
        var response = await addDomain(formdata).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      } else if (commit_type==='update'){
        var response = await editDomain(formdata).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      }

      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      this.$router.push('/domains')
    },
    beforeUpload(file, arr) {
      // console.log(file)

      const extension = file.name.split('.').pop() === 'crt';
      const extension2 = file.name.split('.').pop() === 'key';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message.warning('上传模板只能是 crt、key格式!')
        this.fileList = []
        return
       }
       if (!isLt2M) {
        this.$message.warning('上传模板大小不能超过 5MB!')
        return
       }
      if (file.name.split('.').pop() === 'crt'){
        this.uploadData["crt"] = file.raw;
      }else if (file.name.split('.').pop() === 'key'){
        this.uploadData["key"] = file.raw;
      }

       this.uploadData["file_name"] = file.name;
       // console.log(this.uploadData)
       return false

    },
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

.el-upload-dragger {
  width: 685px;
}

</style>