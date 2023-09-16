<template>
  <el-container style="height: 100%">
    <div class="create-server-block">
      <el-form :model="formData" ref="formData" label-width="110px" style="width: 50%" size="medium">
        <el-form-item prop="domain" label="域名" label-width="120px" required style="margin-top: 10px">
          <el-input type="textarea" v-model="formData.domain" placeholder="一行一个域名" ></el-input>
        </el-form-item>

        <el-form-item label="名称/备注" label-width="120px" required>
          <el-input v-model="formData.remark" placeholder="请输入备注" ></el-input>
        </el-form-item>

        <el-form-item label="Crt" label-width="120px" >
          <el-button type="primary" size="mini">查看</el-button>
          <el-button type="primary" size="mini" style="margin-left: 100px">上传</el-button>
        </el-form-item>

        <el-form-item label="Key" label-width="120px" >
          <el-button type="primary" size="mini">查看</el-button>
          <el-button type="primary" size="mini" style="margin-left: 100px">上传</el-button>
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
          <el-select v-model="formData.domain_svc_type" placeholder="请选择域名服务类型" style="width: 100%">
            <el-option v-for="item in all_svc_types" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="平台关联" label-width="120px" >
          <el-select v-model="formData.platform" multiple placeholder="请选择平台" style="width: 100%">
            <el-option v-for="item in all_platform" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <el-button type="primary" @click="createTemplateCommit" :loading="on_submit_loading">立即提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </el-container>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Platform',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      itemDockerPort: [2375, 32375],
      on_submit_loading: false,
      input: {},
      all_svc_types: ["H5", "download", "h5-proxy", "h5-site", "mqtt", "gateway"],
      all_platform: ['预生产共同-u8', '预生产3300-U8', 'Pre-桑巴舞-3302'],
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

    },
    del_value(index) {
        this.load_data = true
        delete this.formData.params.splice(index, 1)
        this.load_data = false
    },

    add_value() {
      for(var i in this.josns) {
        this.input.name=''
        return
      }
      this.formData.params.push({name:this.input.name, content:this.input.content})
      this.input.name=''
      this.input.content=''
      //可以强制重新渲染页面
      // this.$forceUpdate();
    },
    createTemplateCommit(){

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

</style>