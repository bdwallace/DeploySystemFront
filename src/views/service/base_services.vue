<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createService">创建服务</el-button>
        <el-button type="success" icon="el-icon-circle-check" size="small" style="margin-left: 20px" @click="helthCheckClick">服务检测</el-button>
        <el-button type="danger" icon="el-icon-s-promotion" size="small" style="margin-left: 20px" @click="batchDeployClick">批量发布</el-button>
      </div>


      <div class="serviceTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange" >

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="svc_name" label="服务名称" width="150" align="center"></el-table-column>
          <el-table-column prop="platform" label="平台所属" width="150" align="center">
            <template slot-scope="scope">
              <el-tag  size="mini" style="margin-right: 3px">{{ scope.row.platform }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="project" label="项目环境" width="120" align="center"></el-table-column>
          <el-table-column prop="svc_port" label="端口" width="100px"  align="center"></el-table-column>
          <el-table-column prop="servers" label="主机" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.servers">
                <el-tag size="small" style="margin-right: 3px;width: 110px;margin-top: 3px" >{{ item.public_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 110px" type="info">{{ item.inner_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-if="item.run_time==='未知' || item.run_time===''" type="warning" >未知</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-else-if="item.run_time.indexOf('exited')===0 || item.run_time.indexOf('restart')===0" type="danger" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-else>{{ item.run_time }}</el-tag>
                <el-tooltip effect="light" :content="item.url" placement="left" style="margin-right: 5px">
                  <el-tag v-if="item.health===200" size="small" type="success" >健康</el-tag>
                  <el-tag v-else-if="!item.health || item.health==='未知'" size="small" type="warning">未知</el-tag>
                  <el-tag v-else type="danger" size="small">异常</el-tag>
                </el-tooltip>
                <el-button size="mini" type="primary" @click="restartClick(scope.row, item)">重启</el-button>
                <el-button size="mini" type="primary" @click="closeClick(scope.row, item)" style="margin-left: 3px">关闭</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="run_tag" label="运行版本" width="240px" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.servers" v-if="item.run_tag">
                {{ item.run_tag}}
              </div>
              <div v-else>
                {{ scope.row.run_tag}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="online" label="上下线" width="75px" align="center">
            <template scope="scope">
              <div v-for="item in scope.row.servers" v-if="item.online">
<!--                {{item.online}}-->
                <el-tooltip :content="item.online" placement="top">
                  <el-switch v-model="item.online" v-if="item.svc_type==='java' || item.online"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="上线"
                    inactive-value="下线"
                    @change="linechange(scope.row, item)">
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
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteServiceClick(scope.row)">删除</el-button>

            </template>

          </el-table-column>

        </el-table>
      </div>


      <div style="padding: 10px 16px;text-align: right;">
        <el-pagination background  layout="total, sizes, prev, pager, next, jumper"
                     :page-size="params.pagesize" :page-sizes="[15,30,50,100]"
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
  svcCheck, getService, deleteService, addProcess, dockerCheck, serviceOption, lineChange
} from "@/api";

export default {
  name: "Services",
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
      params: {page: 1, pagesize: 15, total: 0, search: "", position: "基础服务"},
      multipleSelection: [],
      projects: [],
      tableData: [
        // {service_name: "zuul", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "6hao", servers: [
        //   {public_ip: "152.221.175.184", inner_ip: "172.166.107.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        // },
        // {service_name: "config_api", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "aozhou_kaijiang", servers: [
        //   {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
        //   {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],
        // },
        // {service_name: "lottery_api", envir: "预生产", ports: "8117:8117", deploy_time: "2023-9-12 12:00:00", platform: "8号", servers: [
        //   {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
        //   {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "200", run_time: "Up 37 hours", online: "上线"},
        //   {public_ip: "18.136.78.59",inner_ip: "172.166.97.68", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},],
        // },
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
    async fetchData(){
      var resp = await getService(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.tableData = resp.data
        console.log(this.tableData)
        this.params.total = resp.total
      }


    },
    deleteServiceClick(row) {
      this.$confirm('是否确认删除 ' + row.svc_name + ' 服务?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteService({"ids": row.id})
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
    // async switchStatus(row){
    //   let params = {'id': row.id, "mfa_on": row.mfa_on}
    //   this.editData['mfa_on'] = row.mfa_on
    //   var response = await updateUser(params)
    //   if (response.code === 200) {
    //       this.$message({type: 'success', message: response.msg});
    //     } else {
    //       this.$message({type: 'error', message: response.msg});
    //     }
    // },
    editClick(row){
      this.editData = row
      this.$router.push('/services/cs/' + row.id)
    },
    createService(){
      this.$router.push('/services/cs/0')
    },
    editUserCommit(){},
    async linechange(row, item){
      let data = {
        project: row.project,
        online: item.online,
        host_port: item.inner_ip + ":" + row.svc_port.split(':')[0],
      }

      var response = await lineChange(data).catch(() =>{
        this.$message({type: 'error', message: "请求错误"});
        return
      })
      if (response.code === 200) {
        this.$message({type: 'success', message: response.msg});
      } else {
        if (item.online === "上线"){

          item.online="下线"
        }
        else if(item.online === "下线"){item.online='上线'}
        this.$message({type: 'error', message: response.msg});
      }
    },
    async svcCheckCommit(i, data){
      var response = await svcCheck(data).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code === 401){
        this.multipleSelection[i].host_status = "异常"
      }else if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
      } else {
        // this.$message({type: "success", message: response.msg})
        this.multipleSelection[i].services = response.data.svc
      }
    },
    helthCheckClick(){
      // if (this.tableData.length === 0) {
      //   this.$message({type: "warning", message: "选择不能为空"})
      //   return
      // }
      // console.log(this.tableData)
      let reqs = []
      this.$message({type: "success", message: "检测中,请稍后"})
      for (const i in this.tableData){
        let obj = this.tableData[i]
        // let data = {
        //   id : obj.id,
        //   inner_ip: obj.inner_ip,
        //   docker_port: obj.docker_port,
        //   svc: obj.services
        // }
        var response = svcCheck({id: obj.id}).catch(() => {
          this.$message({type: "error", message: "请求失败"})
          return 0
        }).then(resp =>{
          if (resp.code === 401){
            this.tableData[i].host_status = "异常"
          }else if (resp.code !== 200){
            this.$message({type: "error", message: resp.msg})
          } else {
            // this.$message({type: "success", message: response.msg})
            this.tableData[i].servers = resp.data
            console.log(this.tableData[i])
          }
        })

        // let req = new Promise((resolve, reject) =>{
        //   svcCheck(data).then( res => {
        //     resolve(res)
        //   }).catch(err=>{
        //     reject(err)
        //   })
        // })
        // reqs.push(req)
      }
      // this.$message({type: "success", message: "检测中,请稍后"})
      // Promise.all(reqs).then( res => {
      //   // console.log(res)
      //   for (const i in res){
      //     if (res[i].code === 401){
      //       this.tableData[i].host_status = "异常"
      //     }else if (res[i].code !== 200){
      //       this.$message({type: "error", message: res[i].msg})
      //     } else {
      //       // this.$message({type: "success", message: response.msg})
      //       this.tableData[i].servers = res[i].data
      //     }
      //   }
      //   this.$message({type: "success", message: "检测已完成"})
      // })
    },
    async deployClick(row){
      var response = await addProcess({"id": row.id}).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
        return
      } else {
        this.$message({type: "success", message: response.msg})
      }
      // console.log(response.data)
      this.$router.push('/services/deploy/' + response.data.task_id)
    },
    async batchDeployClick(){
      const services_id = []
      this.multipleSelection.forEach(item => {
        services_id.push(item.id)
      })
      console.log(services_id)
      var response = await addProcess({"id": services_id}).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
        return
      } else {
        this.$message({type: "success", message: response.msg})
      }
      // console.log(response.data)
      this.$router.push('/services/deploy/' + response.data.task_id)
    },
    async restartClick(row, item){
      let data = {
        id: row.id,
        svc_name: row.svc_name,
        docker_port: row.docker_port,
        opt_type: 'restart',
        host: item
      }
      console.log(data)
      var response = await serviceOption(data).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
        return
      } else {
        this.$message({type: "success", message: response.msg})
      }

      var response = await svcCheck({id: row.id}).catch(() => {
          this.$message({type: "error", message: "请求失败"})
          return 0
        })
        if (response.code === 401){
          this.multipleSelection[i].host_status = "异常"
        }else if (response.code !== 200){
          this.$message({type: "error", message: response.msg})
        } else {
          // this.$message({type: "success", message: response.msg})
          var index = this.tableData.indexOf(row)
          this.tableData[index].servers = response.data
        }

    },
    async closeClick(row, item){
      let data = {
        svc_name: row.svc_name,
        docker_port: row.docker_port,
        opt_type: 'stop',
        host: item
      }
      // console.log(data)
      var response = await serviceOption(data).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
        return
      } else {
        this.$message({type: "success", message: response.msg})
      }


      var response = await svcCheck({id: row.id}).catch(() => {
          this.$message({type: "error", message: "请求失败"})
          return 0
        })
        if (response.code === 401){
          this.multipleSelection[i].host_status = "异常"
        }else if (response.code !== 200){
          this.$message({type: "error", message: response.msg})
        } else {
          // this.$message({type: "success", message: response.msg})
          var index = this.tableData.indexOf(row)
          this.tableData[index].servers = response.data
        }
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