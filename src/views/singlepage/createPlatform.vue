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

              <tr v-for="(item, index) in formData.params" :key="item" style="margin-bottom:50px">

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

              <tr><td> &nbsp; </td></tr>
            </table>
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
  name: 'CreatePlatform',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      itemDockerPort: [2375, 32375],
      on_submit_loading: false,
      input: {},
      formData: {
        params: [
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