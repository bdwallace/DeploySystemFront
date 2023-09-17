<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createService">创建服务</el-button>
        <el-button type="success" icon="el-icon-circle-check" size="small" style="margin-left: 20px" @click="helthCheckClick">服务检测</el-button>
        <el-button type="danger" icon="el-icon-s-promotion" size="small" style="margin-left: 20px" @click="dialogAddVisable=true">服务发布</el-button>
      </div>


      <div class="serviceTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange" >

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="service_name" label="服务名称" width="150" align="center"></el-table-column>
          <el-table-column prop="platform" label="平台所属" width="150" align="center"></el-table-column>
          <el-table-column prop="envir" label="项目环境" width="120" align="center"></el-table-column>
          <el-table-column prop="ports" label="端口" width="90px"  align="center"></el-table-column>
          <el-table-column prop="host" label="主机" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.servers">
                <el-tag size="small" style="margin-right: 3px;width: 110px;margin-top: 3px" >{{ item.public_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 110px" type="info">{{ item.inner_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-if="item.run_time==='未知'" type="warning" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;" v-else>{{ item.run_time }}</el-tag>
                <el-tooltip effect="light" content="http://54.179.119.160:8134/login" placement="left" style="margin-right: 5px">
                  <el-tag v-if="item.health==='200'" size="small" type="success" >健康</el-tag>
                  <el-tag v-else-if="item.health==='未知'" size="small" type="warning">未知</el-tag>
                  <el-tag v-else type="danger" size="small">异常</el-tag>
                </el-tooltip>
                <el-button size="mini" type="primary" @click="restartClick(item)">重启</el-button>
                <el-button size="mini" type="primary" @click="closeClick(item)" style="margin-left: 3px">关闭</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="run_version" label="运行版本" width="240px" align="center">
            <template slot-scope="scope">
              {{scope.row.servers[0].run_version}}
            </template>
          </el-table-column>
          <el-table-column prop="online" label="上下线" width="75px" align="center">
            <template scope="scope">
              <div v-for="item in scope.row.servers">
                <el-tooltip :content="item.online" placement="top">
                  <el-switch v-model="item.online"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="上线"
                    inactive-value="下线"
                    @change="linechange(scope.row)">
                  </el-switch>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column prop="deploy_time" label="发布时间" width="150" align="center"></el-table-column>-->
<!--          <el-table-column prop="platform" label="发布用户" width="90" align="center"></el-table-column>-->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-s-promotion" size="small" @click="deployClick(scope.row)">发布</el-button>
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteUserClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>



      <el-dialog title="编辑" :visible.sync="dialogEditVisable" width="50%">
        <el-form :model="editData">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="editData.user_name" disabled style="width: 85%" placeholder="一行一个"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" >
            <el-input v-model="editData.email" placeholder="请输入邮箱" style="width: 85%"></el-input>
          </el-form-item>

          <el-form-item label="部门" :label-width="formLabelWidth">
            <el-select v-model="editData.department" placeholder="请选择部门" style="width: 85%">
              <el-option
                v-for="item in departments"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="editData.role" placeholder="请选择角色" style="width: 85%">
              <el-option
                v-for="item in role_groups"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogEditVisable = false">取 消</el-button>
          <el-button type="primary" @click="editUserCommit">确 定</el-button>
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
 getUsers, deleteUsers, updateUser, editUsers
} from "@/api";

export default {
  name: "PlatformServices",
  data() {
    return {
      dialogVisable: false,
      dialogAddVisable: false,
      dialogEditVisable: false,
      formLabelWidth: "100px",
      addDepartment: {},
      addUsers: {},
      editData: {},
      role_groups:[],
      departments: [],
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      multipleSelection: [],
      projects: [],
      tableData: [
        {service_name: "share_agent_6hao", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "预生产3300-U8", servers: [
          {public_ip: "152.221.175.184", inner_ip: "172.166.107.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        },
        {service_name: "download_6hao_2", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "Pre-桑巴舞-3302", servers: [
          {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        },
        {service_name: "customer_6hao", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "aozhou_kaijiang", servers: [
          {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "200", run_time: "Up 37 hours", online: "上线"},
          {public_ip: "18.136.78.59",inner_ip: "172.166.97.68", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},],
        },
          {service_name: "agent_6hao", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "aozhou_kaijiang", servers: [
          {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        },
          {service_name: "merchant_6hao", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "aozhou_kaijiang", servers: [
          {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        },
          {service_name: "chat-backend-6hao", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "Pre-桑巴舞-3302", servers: [
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        },
          {service_name: "sedie_6hao", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "Pre-桑巴舞-3302", servers: [
          {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        },
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
      var resp = await getUsers(this.params).catch(() => {
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


    },
    deleteUserClick(row) {
      this.$confirm('是否确认删除 ' + row.user_name+ ' 用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteUsers({"id": row.id})
        if (response.code === 200) {
          this.$message({type: 'success', message: response.msg});
          await this.fetchData()
        } else {
          this.$message({type: 'error', message: response.msg});
        }
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      })
    },
    async switchStatus(row){
      let params = {'id': row.id, "mfa_on": row.mfa_on}
      this.editData['mfa_on'] = row.mfa_on
      var response = await updateUser(params)
      if (response.code === 200) {
          this.$message({type: 'success', message: response.msg});
        } else {
          this.$message({type: 'error', message: response.msg});
        }
    },
    editClick(row){
      this.editData = row
      this.$router.push('/services/cs/' + row.service_name)
    },
    createService(){
      this.$router.push('/services/cs/0')
    },
    editUserCommit(){},
    linechange(){
      this.on_submit_loading = true
      this.load_data = true
      // let host_port = host + ":" + service.Port.split(",")[0].split(":")[0]

      this.on_submit_loading = false
      this.load_data = false
    },
    helthCheckClick(){
      this.tableData.forEach((item) => {
        console.log(item)
        item.servers.forEach((server) => {
          server.health = "200"
          server.run_time = 'Up 7 weeks'
        })
      })
    },
    deployClick(row){
      this.editData = row
      this.$router.push('/services/deploy/' + row.service_name)
    },
    restartClick(item){

    },
    closeClick(item){

    }

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

.serviceTable {
    width: 99%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*height: 100vh;*/
}
.serviceTable ::v-deep .el-table .cell{
  white-space: pre-line;
}
.el-input {
  width: 70%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}





</style>