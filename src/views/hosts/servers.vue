<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="dialogAddVisable = true">新增主机</el-button>
        <el-button type="success" icon="el-icon-circle-check" size="small" style="margin-left: 20px" @click="dockerCheckClick">容器检测</el-button>
      </div>


      <div class="certTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
           stripe
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="host_name" label="主机名称" width="180" align="center"></el-table-column>
          <el-table-column prop="public_ip" label="公网IP" width="150" align="center"></el-table-column>
          <el-table-column prop="inner_ip" label="内外IP" width="150" align="center"></el-table-column>
          <el-table-column prop="project" label="项目环境" width="150" align="center"></el-table-column>
          <el-table-column prop="service" label="运行容器" fit align="center">
            <template slot-scope="scope" >
              <div v-for="item in scope.row.services">
                <el-tag size="small" style="margin-right: 3px;margin-top: 3px;width: 200px" >{{ item.docker_name }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;margin-top: 3px;width: 100px"
                        v-if="item.run_time==='未知' || item.run_time===''" type="warning" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 100px" v-else-if="item.run_time.indexOf('Up')===0" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;margin-top: 3px;width: 100px" v-else type="danger">{{ item.run_time }}</el-tag>
                <el-tooltip effect="light" content="http://54.179.119.160:8134/login" placement="left">
                  <el-tag v-if="item.health==='200'" size="small" type="success" >运行中</el-tag>
                  <el-tag v-else-if="item.health==='未知'" size="small" type="warning" style="width: 52px">未知</el-tag>
                  <el-tag v-else type="danger" size="small" style="width: 52px">异常</el-tag>
                </el-tooltip>
              </div>

            </template>
          </el-table-column>
          <el-table-column prop="host_status" label="主机状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.host_status==='正常'" size="small" type="success" >正常</el-tag>
              <el-tag v-else-if="scope.row.host_status==='未知' " size="small" type="warning" style="width: 52px">未知</el-tag>
              <el-tag v-else type="danger" size="small" style="width: 52px">异常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="更新时间" width="160" align="center"></el-table-column>
          <el-table-column prop="option" label="操作" width="170" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteHostClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>



      <el-dialog title="新增主机" :visible.sync="dialogAddVisable">
        <el-form :model="addHost"  label-width="130px" width="40%">
          <el-form-item prop="host_name" label="主机名" required style="margin-top: 10px">
            <el-input v-model="addHost.host_name" placeholder="请输入主机名" ></el-input>
          </el-form-item>
          <el-form-item prop="project" label="项目环境">
            <el-select v-model="addHost.project" placeholder="请选择项目环境" style="width: 70%">
              <el-option v-for="item in project_list" :label="item.project_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="inner_ip" label="内网IP" required>
            <el-input v-model="addHost.inner_ip" placeholder="请输入内网IP" ></el-input>
          </el-form-item>
          <el-form-item prop="public_ip" label="外网IP" required>
            <el-input v-model="addHost.public_ip" placeholder="请输入外网IP" ></el-input>
          </el-form-item>
          <el-form-item prop="docker_port" label="Docker Port">
            <el-select v-model="addHost.docker_port" placeholder="请选择容器端口" style="width: 70%">
              <el-option v-for="item in itemDockerPort" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addHostCommit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑" :visible.sync="dialogEditVisable" width="50%">
        <el-form :model="editHost"  label-width="130px" width="40%">
          <el-form-item prop="host_name" label="主机名" required style="margin-top: 10px">
            <el-input v-model="editHost.host_name" placeholder="请输入主机名" ></el-input>
          </el-form-item>
          <el-form-item prop="project" label="项目环境">
            <el-select v-model="editHost.project_id" placeholder="请选择项目环境" style="width: 70%">
              <el-option v-for="item in project_list" :label="item.project_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="inner_ip" label="内网IP" required>
            <el-input v-model="editHost.inner_ip" placeholder="请输入内网IP" ></el-input>
          </el-form-item>
          <el-form-item prop="public_ip" label="外网IP" required>
            <el-input v-model="editHost.public_ip" placeholder="请输入外网IP" ></el-input>
          </el-form-item>
          <el-form-item prop="docker_port" label="Docker Port">
            <el-select v-model="editHost.docker_port" placeholder="请选择容器端口" style="width: 70%">
              <el-option v-for="item in itemDockerPort" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogEditVisable = false">取 消</el-button>
          <el-button type="primary" @click="editHostCommit">确 定</el-button>
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
  addHost,
  deleteHost, dockerCheck, editHost, getHosts, getProject
} from "@/api";

export default {
  name: "servers_manage",
  data() {
    return {
      dialogVisable: false,
      dialogEditVisable: false,
      dialogAddVisable: false,
      formLabelWidth: "100px",
      itemDockerPort: [2375, 32375],
      project_list: [],
      addHost: {},
      editHost: {},
      params: {page: 1, pagesize: 10, total: 0, search: ""},
      multipleSelection: [],
      projects: [],
      tableData: [
        // {host_name: "pre-base-services-a", public_ip: "13.250.57.29",inner_ip: "172.166.10.50",services: [{docker_name: "zuul",health: "未知", run_time: "未知"},
        //     {docker_name: "common-api",health: "400", run_time: "Up 37 hours"},
        //     {docker_name: "eureka",health: "未知", run_time: "未知"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-base-services-b", public_ip: "13.229.239.172",inner_ip: "172.166.1.62",
        //   services: [{docker_name: "common-api",health: "200", run_time: "Up 37 hours"},{docker_name: "eureka",health: "200", run_time: "Up 37 hours"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-micro-services-a", public_ip: "54.169.77.132",inner_ip: "172.166.2.244",
        //   services: [], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-config-services-01-a", public_ip: "13.212.96.7",inner_ip: "172.166.9.34",
        //   services: [{docker_name: "config_issue_api",health: "200", run_time: "Up 37 hours"},
        //     {docker_name: "config_open_api",health: "200", run_time: "Up 37 hours"},
        //     {docker_name: "config_api",health: "200", run_time: "Up 37 hours"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-config-services-02-a", public_ip: "54.179.87.237",inner_ip: "172.166.13.180",
        //   services: [{docker_name: "config_mq_consumer",health: "200", run_time: "Up 37 hours"},{docker_name: "config_timer",health: "200", run_time: "Up 37 hours"},
        //     {docker_name: "config_admin_api",health: "200", run_time: "Up 37 hours"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-lottery-services-01-a", public_ip: "54.254.168.236",inner_ip: "172.166.11.97",
        //   services: [{docker_name: "zuul_u8-pre",health: "200", run_time: "Up 37 hours"},
        //     {docker_name: "cadvisor",health: "200", run_time: "Up 37 hours"},
        //     {docker_name: "mysql",health: "400", run_time: "Up 37 hours"},
        //     {docker_name: "nacos-standalone-mysql",health: "200", run_time: "Up 37 hours"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
      ]
    }
  },
  created() {
    this.fetchData()
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
    closeDialog(){
      this.dialogAddVisable = false
    },
    async fetchData(){
      var response = await getHosts(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.tableData = response.data
        this.params.total = response.total
      }

      var response = await getProject(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.project_list = response.data
      }
      
    },
    deleteHostClick(row) {
      this.$confirm('是否确认删除 ' + row.host_name + ' 主机?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteHost({"ids": row.id})
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
      this.editHost = row
      console.log(row)
      this.dialogEditVisable = true
    },
    async addHostCommit(){
      // console.log(this.addHost)
      var response = await addHost(this.addHost).catch(() => {
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
    async editHostCommit(){
      delete this.editHost.create_time
      delete this.editHost.update_time
      // console.log(this.editHost)
      var response = await editHost(this.editHost).catch(() => {
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
    // async dockerCheckCommit(i, data){
    //   var response = await dockerCheck(data).catch(() => {
    //     this.$message({type: "error", message: "请求失败"})
    //     return 0
    //   })
    //   if (response.code === 401){
    //     this.multipleSelection[i].host_status = "异常"
    //   }else if (response.code !== 200){
    //     this.$message({type: "error", message: response.msg})
    //   } else {
    //     // this.$message({type: "success", message: response.msg})
    //     this.multipleSelection[i].services = response.data.svc
    //   }
    // },
    async dockerCheckClick(){
      if (this.multipleSelection.length === 0) {
        this.$message({type: "warning", message: "选择不能为空"})
        return
      }
      let reqs = []
      for (const i in this.multipleSelection){
        let obj = this.multipleSelection[i]
        console.log(obj)
        let data = {
          id : obj.id,
          public_ip: obj.public_ip,
          inner_ip: obj.inner_ip,
          // docker_port: obj.docker_port,
          svc: obj.services
        }
        // await this.dockerCheckCommit(i, data)
        let req = new Promise((resolve, reject) =>{
          dockerCheck(data).then( res => {
            resolve(res)
          }).catch(err=>{
            reject(err)
          })
        })
        reqs.push(req)
      }
      this.$message({type: "success", message: "检测中,请稍后"})
      Promise.all(reqs).then( res => {
        // console.log(res)
        for (const i in res){
          if (res[i].code === 401){
            this.multipleSelection[i].host_status = "异常"
          }else if (res[i].code !== 200){
            this.$message({type: "error", message: res[i].msg})
          } else {
            // this.$message({type: "success", message: response.msg})
            this.multipleSelection[i].services = res[i].data.svc
          }
        }
        // this.$message({type: "success", message: "检测已完成"})
      })

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