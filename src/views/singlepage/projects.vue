<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="dialogCreateProjectVisable=true">创建项目</el-button>
      </div>


      <div class="certTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="project_name" label="项目名称" fit align="center"></el-table-column>
          <el-table-column prop="alias" label="别名" fit align="center"></el-table-column>
          <el-table-column prop="nacos_addr" label="Nacos地址" fit align="center"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" fit align="center"></el-table-column>
          <el-table-column prop="update_time" label="更新时间" fit align="center"></el-table-column>
<!--          <el-table-column prop="remark" label="备注" fit align="center"></el-table-column>-->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" style="color: #f56c6c" @click="deleteDomainClick(scope.row)">删除</el-button>

            </template>

          </el-table-column>

        </el-table>
      </div>

      <el-dialog title="创建项目" :visible.sync="dialogCreateProjectVisable" width="50%">
        <el-form :model="addProjectData">
          <el-form-item label="项目名称" :label-width="formLabelWidth" required>
            <el-input v-model="addProjectData.project_name" style="width: 85%" placeholder="项目名称"></el-input>
          </el-form-item>

          <el-form-item label="项目别名" :label-width="formLabelWidth" required>
            <el-input v-model="addProjectData.alias" style="width: 85%" placeholder="项目别名"></el-input>
          </el-form-item>

          <el-form-item label="Nacos地址" :label-width="formLabelWidth">
            <el-input v-model="addProjectData.nacos_addr" style="width: 85%" placeholder="Nacos地址"></el-input>
          </el-form-item>
          <el-form-item label="Nacos用户名" :label-width="formLabelWidth">
            <el-input v-model="addProjectData.nacos_user" style="width: 85%" placeholder="Nacos用户名"></el-input>
          </el-form-item>
          <el-form-item label="Nacos密码" :label-width="formLabelWidth">
            <el-input v-model="addProjectData.nacos_password" style="width: 85%" placeholder="Nacos密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogCreateProjectVisable=false">取 消</el-button>
          <el-button type="primary" @click="addRoleCommit">确 定</el-button>
        </div>
      </el-dialog>


      <el-dialog title="编辑" :visible.sync="dialogEditVisable" width="50%">
        <el-form :model="editData">
          <el-form-item label="项目名称" :label-width="formLabelWidth" required>
            <el-input v-model="editData.project_name" style="width: 85%" placeholder="项目名称"></el-input>
          </el-form-item>

          <el-form-item label="项目别名" :label-width="formLabelWidth" required>
            <el-input v-model="editData.alias" style="width: 85%" placeholder="项目别名"></el-input>
          </el-form-item>

          <el-form-item label="Nacos地址" :label-width="formLabelWidth">
            <el-input v-model="editData.nacos_addr" style="width: 85%" placeholder="Nacos地址"></el-input>
          </el-form-item>
          <el-form-item label="Nacos用户名" :label-width="formLabelWidth">
            <el-input v-model="editData.nacos_user" style="width: 85%" placeholder="Nacos用户名"></el-input>
          </el-form-item>
          <el-form-item label="Nacos密码" :label-width="formLabelWidth">
            <el-input v-model="editData.nacos_password" style="width: 85%" placeholder="Nacos密码"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogEditVisable = false">取 消</el-button>
          <el-button type="primary" @click="editRoleCommit">确 定</el-button>
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
  deleteDomains,
  getMenusGroup,
  getApiGroup,
  addRoles,
  getRoles, editRoles, deleteRoles, getGroups
} from "@/api";

export default {
  name: "Projects",
  data() {
    return {
      dialogCreateProjectVisable: true,
      dialogEditVisable: false,
      formLabelWidth: "100px",
      addProjectData: {
        menu_groups: [],
        api_groups: []
      },
      editData: {
        role_name: "",
        menu_groups: [],
        api_groups: []
      },
      menu_groups:[],
      api_groups:[],
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      multipleSelection: [],
      projects: [],
      tableData: [
        {project_name: "预生产", alias: "Pre", nacos_addr: "172.166.13.201:8848", create_time: "2020-05-19 18:59:54", update_time: "2023-05-07 15:39:45"},
        {project_name: "步多多", alias: "bdd", nacos_addr: "10.9.100.51:8848", create_time: "2020-07-01 14:23:14", update_time: "2023-05-07 15:39:45"},
        {project_name: "微聊", alias: "wl", nacos_addr: "10.210.0.91:8080", create_time: "2020-07-21 17:32:01", update_time: "2023-05-07 15:39:45"},
        {project_name: "开发环境钱包", alias: "wallet-dev", nacos_addr: "10.210.1.233:8080", create_time: "2021-04-15 13:03:40", update_time: "2023-05-07 15:39:45"},
        {project_name: "预生产环境钱包", alias: "wallet-pre", nacos_addr: "172.166.8.54:8848", create_time: "2021-07-27 17:04:06", update_time: "2023-05-07 15:39:45"},
        {project_name: "开发C2C", alias: "c2c-dev", nacos_addr: "172.166.13.201:8848", create_time: "2022-01-28 13:13:17", update_time: "2023-05-07 15:39:45"},
        {project_name: "预生产c2c", alias: "c2c-pre", nacos_addr: "172.166.13.201:8848", create_time: "2022-02-12 10:14:45", update_time: "2023-05-07 15:39:45"},

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
      console.log(val)
      this.multipleSelection = val
    },
    async fetchData(){
      var resp = await getRoles(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.tableData = resp.data
        this.params.total = resp.total
      }

      var response = await getGroups(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
        return 0
      }else {
        // this.menu_groups = response.data
        // this.params.total = response.total
        this.menu_groups = []
        this.api_groups = []
        response.data.forEach((item) => {
          if (item['group_type'] === "菜单组"){
            this.menu_groups.push({label: item['group_name'], value: item['id']})
          }else if (item['group_type'] === "权限组"){
            this.api_groups.push({label: item['group_name'], value: item['id']})
          }

        })
      }

    },
    deleteDomainClick(row) {
      // console.log(row)
      this.$confirm('是否确认删除 ' + row.project_name + ' 项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // var response = await deleteRoles({"id": row.id})
        // if (response.code === 200) {
        //   this.$message({type: 'success', message: response.msg});
        //   await this.fetchData()
        // } else {
        //   this.$message({type: 'error', message: response.msg});
        // }
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      })
    },

    editClick(row){
      this.editData = row
      this.dialogEditVisable = true
    },
    async editRoleCommit(){
      console.log(this.editData)
      var response = await editRoles(this.editData).catch(() => {
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
    async addRoleCommit(){
      // console.log(this.addProjectData)
      var response = await addRoles(this.addProjectData).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      this.dialogAddRoleVisable = false
      await this.fetchData()

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