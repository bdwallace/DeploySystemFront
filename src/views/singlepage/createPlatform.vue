<template>
  <el-container style="height: 100%">
    <div class="create-server-block">
      <el-form :model="formData" ref="formData" label-width="110px" style="width: 60%" size="medium">
        <el-form-item prop="platform_name" label="平台名称" required label-width="120px" style="margin-top: 10px">
          <el-input v-model="formData.platform_name" placeholder="请输入平台名称" ></el-input>
        </el-form-item>
        <el-form-item prop="platform_code" label="平台编号" required label-width="120px" style="margin-top: 10px">
          <el-input v-model="formData.platform_code" placeholder="请输入平台编号" ></el-input>
        </el-form-item>
        <el-form-item label="平台参数" label-width="120px">
          <table class="table">
              <tr>
                <th style="text-align:right;width:300px;padding-right:10px">key值</th>
                <th style="text-align:left;width:600px;padding-left:10px">value值</th>
                <th style="padding-left: 20px">删除</th>
              </tr>

              <tr v-for="(item, index) in formData.config" :key="index" style="margin-bottom:50px">

                <td style="text-align:right;width:300px;padding-right:10px">
                    <el-input type="textarea" autosize placeholder="输入内容" style="direction: rtl;" v-model="item.name"></el-input>
                </td>

                <td style="text-align:left;width:600px;padding-left:10px">
                    <el-input type="textarea" autosize placeholder="输入内容" v-model="item.content"></el-input>
                </td>

                <td style="padding-left: 20px">
                  <el-button type="danger" size="mini" @click="del_value(index)">
                      <i class="el-icon-delete"></i>
                  </el-button>
                </td>
              </tr>

              <tr><td> &nbsp; </td></tr>

              <tr>
                <!-- <td> &nbsp; </td>
                <td> &nbsp; </td> -->
                <td style="text-align:right;width:300px;padding-right:10px">
                    <el-input type="textarea" autosize placeholder="输入内容" style="direction: rtl;" v-model="input.name"></el-input>
                </td>
                <td style="text-align:left;width:500px;padding-left:10px">
                    <el-input type="textarea" autosize placeholder="输入内容" v-model="input.content"></el-input>
                </td>
                <td style="padding-left: 20px;">
                  <el-button type="primary" icon="el-icon-plus" size="mini"   @click="add_value()"></el-button>
                </td>
              </tr>

              <tr><td> &nbsp </td></tr>
            </table>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="createTemplateCommit('create')" v-if="id==='0'">立即提交</el-button>
      <el-button type="primary" @click="createTemplateCommit('update')" v-else>立即提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </el-container>
</template>

<script>

import {addPlatform, getPlatform, editPlatform} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'CreatePlatform',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      itemDockerPort: [2375, 32375],
      on_submit_loading: false,
      id: this.$route.params.id,
      input: {},
      formData: {
        config: [
          {name: "CHANNEL_ID", content: ""},{name: "CHANNEL_NAME", content: ""},{name: "ENCRYPTED_KEY", content: ""},{name: "KEYWORDS", content: ""},
          {name: "META_DESC", content: ""},{name: "PLATFORM", content: ""},{name: "SKIN_NAME", content: ""},
        ],
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {

      if (this.$route.params.id === '0'){
        return
      }
      this.params.search = this.$route.params.id
      var resp = await getPlatform(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.formData = resp.data[0]
        this.params.total = resp.total
      }
    },
    del_value(index) {
        this.load_data = true
        delete this.formData.config.splice(index, 1)
        this.load_data = false
    },

    add_value() {
      this.formData.config.push({name:"", content: ""})
    },
    async createTemplateCommit(commit_type){
      if (commit_type === "create"){
        var response = await addPlatform(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      } else if (commit_type==='update'){
        var response = await editPlatform(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      }

      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      this.$router.push('/platform')
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