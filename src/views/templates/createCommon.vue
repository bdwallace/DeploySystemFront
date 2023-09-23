<template>
  <el-container style="height: 100%">
    <div class="create-server-block">
      <el-form :model="formData" ref="formData" label-width="110px" style="width: 60%" size="medium">
        <el-form-item prop="name" label="参数模板名称" required style="margin-top: 10px" label-width="120px">
          <el-input v-model="formData.name" placeholder="请输入参数模板名称" ></el-input>
        </el-form-item>
        <el-form-item label="公共参数" label-width="120px">
          <table class="table">
              <tr>
                <th style="text-align:right;width:300px;padding-right:10px">key值</th>
                <th style="text-align:left;width:600px;padding-left:10px">value值</th>
                <th style="padding-left: 20px">删除</th>
              </tr>

              <tr v-for="(item, index) in formData.config" :key="index" style="margin-bottom:50px">

                <td style="text-align:right;width:300px;padding-right:10px">
                    <el-input type="textarea"  autosize placeholder="输入内容" v-model="item.name"></el-input>
                </td>

                <td style="text-align:left;width:600px;padding-left:10px">
                    <el-input type="textarea"  :autosize="{maxRows: 6}" placeholder="输入内容" v-model="item.content"></el-input>
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
                    <el-input type="textarea" autosize placeholder="输入内容"  v-model="input.name"></el-input>
                </td>
                <td style="text-align:left;width:500px;padding-left:10px">
                    <el-input type="textarea" :autosize="{maxRows: 6}" placeholder="输入内容" v-model="input.content"></el-input>
                </td>
                <td style="padding-left: 20px;">
                  <el-button type="primary" icon="el-icon-plus" size="mini"   @click="add_value()"></el-button>
                </td>
              </tr>

              <tr><td> &nbsp; </td></tr>
            </table>
        </el-form-item>
<!--        <el-form-item prop="relate_service" label="关联服务">-->
<!--          <el-transfer-->
<!--            filterable-->
<!--            :titles="titles"-->
<!--            filter-placeholder="请输入关键字"-->
<!--            v-model="formData.relate_services"-->
<!--            :data="services" style="margin-left: 10px">-->
<!--          </el-transfer>-->
<!--        </el-form-item>-->
      </el-form>

      <el-button type="primary" @click="createTemplateCommit('create')" v-if="id==='0'">立即提交</el-button>
      <el-button type="primary" @click="createTemplateCommit('update')" v-else>更新模板</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </el-container>
</template>

<script>

import {
  addCommonParamTemplate,
  addPlatform,
  editCommonParamTemplate,
  editPlatform,
  getCommonParamTemplate
} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Platform',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      itemDockerPort: [2375, 32375],
      on_submit_loading: false,
      id: this.$route.params.id,
      services: [
        {label: "zuul", key: "zuul"}, {label: "lottery_api", key: "lottery_api"}, {label: "lottery_remoteservice_provider", key: "lottery_remoteservice_provider"},
        {label: "lottery_admin_api", key: "lottery_admin_api"}, {label: "eureka", key: "eureka"}, {label: "config_task", key: "config_task"},
        {label: "common-api", key: "common-api"}, {label: "lottery_mqtt", key: "lottery_mqtt"}, {label: "data_center_api", key: "data_center_api"},
      ],
      titles: ["未关联", "已关联"],
      input: {},
      formData: {
        config: [{}],
        relate_services: [],
        temp_type: 'common'
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
      var response = await getCommonParamTemplate(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })

      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
        this.formData = response.data[0]
        console.log(this.formData)
      }
    },
    del_value(index) {
        delete this.formData.config.splice(index, 1)
    },

    add_value() {
      this.formData.config.push({name: '', content: ''})

      //可以强制重新渲染页面
      // this.$forceUpdate();
    },
    async createTemplateCommit(commit_type){
      console.log(this.formData)
      if (commit_type==='create'){
        var response = await addCommonParamTemplate(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      } else if (commit_type==='update'){
        var response = await editCommonParamTemplate(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      }


      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      this.$router.push('/templates/common')
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