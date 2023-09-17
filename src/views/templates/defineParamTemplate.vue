<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="dialogAddVisable=true">创建模板</el-button>

      </div>


      <div class="certTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="template_name" label="模板名称" width="300" align="center"></el-table-column>
          <el-table-column prop="param_list" label="参数内容" fit align="center">
            <template slot-scope="scope">
              <el-tag size="mini" v-for="item in scope.row.param_list" style="margin-right: 3px">{{ item.value }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="with_service" label="服务关联" fit align="center">
            <template slot-scope="scope">
              <el-tag size="small" style="margin-right: 3px;margin-top: 5px;" v-for="item in scope.row.with_service">{{ item.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>
<!--          <el-table-column prop="remark" label="备注" width="180" align="center"></el-table-column>-->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteApiClick(scope.row)">删除</el-button>

            </template>

          </el-table-column>

        </el-table>
      </div>

      <el-dialog title="创建模板" :visible.sync="dialogAddVisable" width="50%">
        <el-form :model="formData">
          <el-form-item label="模板名称" :label-width="formLabelWidth">
            <el-input v-model="formData.template_name" style="width: 85%" placeholder="请输入模板名称"></el-input>
          </el-form-item>

          <el-form-item label="自定义参数" :label-width="formLabelWidth" v-for="(item, index) in formData.param_list">
            <el-input v-model="item.value" placeholder="请输入自定义参数" style="width: 75%"></el-input>
            <el-button type="warning" size="mini" style="margin-left: 5px" @click.prevent="removeParams(item)" icon="el-icon-delete">删除</el-button>

          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogAddVisable=false">取 消</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addParams">添加</el-button>
          <el-button type="primary" @click="addTemplateCommit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑" :visible.sync="dialogEditVisable" width="50%">
        <el-form :model="editData">
          <el-form-item label="模板名称" :label-width="formLabelWidth">
            <el-input v-model="editData.template_name" style="width: 85%" placeholder="请输入模板名称"></el-input>
          </el-form-item>

          <el-form-item label="自定义参数" :label-width="formLabelWidth" v-for="(item, index) in editData.param_list">
            <el-input v-model="item.value" placeholder="请输入自定义参数" style="width: 75%"></el-input>
            <el-button type="warning" size="mini" style="margin-left: 5px" @click.prevent="removeEditParams(item)" icon="el-icon-delete">删除</el-button>

          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogAddVisable=false">取 消</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addEditParams">添加</el-button>
          <el-button type="primary" @click="addTemplateCommit">确 定</el-button>
        </div>
      </el-dialog>


      <div style="padding: 10px 16px;text-align: right;">
        <el-pagination background  layout="total, sizes, prev, pager, next, jumper"
                     :page-size="params.pagesize" :page-sizes="[10,30,50,100]"
                     :total="params.total"
                     @current-change="currentChange"
                     @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
  </el-container>
</template>

<script>

import {
  getApis, getApiGroup, addApiGroup, addApis, deleteApis, editApis
} from "@/api";

export default {
  name: "domain_manage",
  data() {
    return {
      dialogAddVisable: false,
      dialogAddApiVisable: false,
      dialogEditVisable: false,
      formLabelWidth: "100px",
      api_groups: [],
      input: {},
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      multipleSelection: [],
      projects: [],
      formData: {
        param_list: [{}],
        template_name: ""
      },
      editData: {
        param_list: [{}],
        template_name: ""
      },
      tableData: [
        {template_name: "zuul参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "eureka参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "config_remoteservice_provider参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "lottery_api参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "config_timer参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "lottery_risk参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "HK-azkaijiang-akbet参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        {template_name: "kaijiang_6hao参数模板", param_list:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},

      ]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {

    currentChange(page){
      this.params.page = page
      this.fetchData()
    },
    handleSizeChange(pagesize){
      this.params.pagesize = pagesize
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async fetchData(){
      var response = await getApis(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        // this.getSpanArr(response.data)
        this.tableData = response.data
        this.params.total = response.total
      }
    },

    deleteApiClick(row) {
      this.$confirm('是否确认删除 ' + row.api_url + ' 路由权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteApis({"id": row.id})
        if (response.code === 200) {
          this.$message({type: 'success', message: '删除成功!'});
          await this.fetchData()
        } else {
          this.$message({type: 'error', message: '删除失败'});
        }
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      })
    },

    editClick(row){
      console.log(row)
      this.editData = row
      this.dialogEditVisable = true
    },
    async editApiCommit(){
      var response = await editApis(this.editData).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
      } else {
        this.$message({type: "success", message: response.msg})
      }
      this.dialogEditVisable = false
      await this.fetchData()
    },
    async addTemplateCommit(){
      var response = await addApiGroup(this.addApiGroup).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
      } else {
        this.$message({type: "success", message: response.msg})
      }
      this.dialogAddVisable = false
      await this.fetchData()
    },
    removeParams(item) {
      var index = this.formData.param_list.indexOf(item)
      if (index !== -1) {
        this.formData.param_list.splice(index, 1)
      }
    },
    addParams() {
      this.formData.param_list.push({
        value: '',
        key: Date.now()
      });
    },
    removeEditParams(item) {
      var index = this.editData.param_list.indexOf(item)
      if (index !== -1) {
        this.editData.param_list.splice(index, 1)
      }
    },
    addEditParams() {
      this.editData.param_list.push({
        value: '',
        key: Date.now()
      });
    },

  }
}
</script>

<style scoped>
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
.certTable ::v-deep .el-table .cell{
  white-space: pre-line;
}
.el-input {
  width: 70%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}


</style>