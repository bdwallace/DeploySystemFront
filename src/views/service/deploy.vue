<template>
  <el-container style="height: 100%">
    <div class="main">
      <div class="search-bock">
        <el-progress style="width: 99%" :text-inside="true" :stroke-width="24" :percentage="100" status="success"></el-progress>
<!--        <el-tag type="warning"></el-tag>-->
      </div>
      <div class="deployTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
                  border :header-cell-style="{background:'#eef1f6',color:'#606266'}">

          <el-table-column prop="svc_name" label="服务名称" width="120" align="center"></el-table-column>
          <el-table-column prop="svc_port" label="端口" width="100" align="center"></el-table-column>
          <el-table-column prop="project" label="环境" width="120" align="center">
            <template slot-scope="scope">
              <el-tag  type="danger" size="mini">{{ scope.row.project }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="平台" width="100" align="center"></el-table-column>
          <el-table-column prop="new_tag" label="发布版本"  width="400" align="center">
            <template slot-scope="scope">
              <el-tag v-if="checkRelease(scope.row.new_tag)" style="margin-right: 3px" type="success" size="mini">
                <i class="el-icon-success"></i>
              </el-tag>
              <el-tag v-if="!checkRelease(scope.row.new_tag)" style="margin-right: 3px" type="danger" size="mini">
                <i class="el-icon-error"></i>
              </el-tag>
              <el-input v-if="tag_post" v-model="scope.row.new_tag" size="mini" disabled readonly style="width: 280px"></el-input>
              <el-select v-else v-model="scope.row.new_tag" filterable size="mini" style="width: 280px;margin-right: 3px"  @change="checkRelease(scope.row.new_tag)">
                <el-option v-for="item in scope.row.release" style="font-size: 5px;"
                           :key="item" :label="item" :value="item">
                </el-option>
              </el-select>

              <el-tooltip  placement="bottom" :content="scope.row.old_tag">
                <el-button type="success" size="mini" style="width: 50px" v-if="!tag_post"
                         @click="scope.row.new_tag = scope.row.old_tag" >回退</el-button>
              </el-tooltip>


            </template>
          </el-table-column>
          <el-table-column prop="check" label="检测" width="80" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="checkClick(scope.row)">检测</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="servers" label="主机" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.servers">
                <el-tooltip :content="item.online" placement="top">
                  <el-switch v-model="item.online"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="上线"
                    inactive-value="下线"
                    @change="linechange(scope.row, item)">
                  </el-switch>
                </el-tooltip>
                <el-tag size="small" style="margin-right: 3px;width: 110px;margin-top: 3px" >{{ item.public_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 110px" type="info">{{ item.inner_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-if="item.run_time==='未知'" type="warning" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-else-if="item.run_time.indexOf('exited')===0" type="danger" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;" v-else>{{ item.run_time }}</el-tag>
                <el-input readonly class="input_blue" style="width: 200px" size="mini" v-model="item.run_tag" ></el-input>
                <el-tooltip effect="light" content="http://54.179.119.160:8134/login" placement="left" style="margin-right: 3px">
                  <el-tag v-if="item.health==='200'" size="small" type="success" >健康</el-tag>
                  <el-tag v-else-if="item.health==='未知'" size="small" type="warning">未知</el-tag>
                  <el-tag v-else type="danger" size="small">异常</el-tag>
                </el-tooltip>
                <el-button size="mini" type="primary" @click="restartClick(scope.row, item)">重启</el-button>
                <el-button size="mini" type="primary" @click="closeClick(scope.row, item)" style="margin-left: 3px">关闭</el-button>
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column prop="cmd" label="命令" fit align="center"></el-table-column>-->

        </el-table>
      </div>
<!--      <div class="item-block" style="margin-top: 10px;width: 99%">-->
        <el-tabs type="border-card" v-model="count" @tab-click="check_tag" style="margin-top: 10px;width: 99%">
          <el-tab-pane label="新发布" >
            <div>
              <el-button v-if="!tag_post" size="medium" type="primary" @click="commitTag" >确定Tag版本</el-button>
              <div v-else style="display:inline">
                  <el-button type="primary" @click="on_submit_form(true)" style="margin-right: 50px">灰度发布
                  </el-button>
                  <el-button @click="tag_post=false">取消</el-button>

<!--                  <el-button type="danger" @click="is_backDialog = true" style="float: right">-->
<!--                      回退发布单-->
<!--                  </el-button>-->

                  <el-button type="danger"  style="float: right;margin-right:30px"
                      @click="on_submit_form(false)" >全部发布
                  </el-button>
              </div>
            </div>
          </el-tab-pane>

<!--          <el-tab-pane v-for="item in itemCount" :key="item" :name="`${parseInt(item)}`" :label="`第${item}次发布`"></el-tab-pane>-->
        </el-tabs>

        <div class="log">
            <code style="background-color: rgb(0, 0, 0);color:#00ff00">
                <br>
                <span v-for="(n, i) in showText" :style="{'color': n.color}" :key="i"> <pre style=" white-space: pre-wrap;" v-html="n.text"></pre> <br></span>
                <br>
            </code>
        </div>

    </div>
  </el-container>
</template>

<script>

import {commitDeployTask, commitTag, getLog, getProcess, getTagList, lineChange, serviceOption, svcCheck} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Deploy',
  data() {
    return {
      task_id: this.$route.params.id,
      task_name: "",
      tag_post: false,
      is_backDialog: false,
      count: 0,

      itemCount: [],
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      all_release: [
          // {id: 1, tag: "RLS_LOTTERY_20230620_01"},{id: 2, tag: "dev-temp"},{id: 3, tag: "RLS_OK_20230817_02"},{id: 1, tag: "RLS_LOTTERY_20230620_01"},
      ],
      tableData: [
        // {svc_name: "eureka", port: "8134:8134", envir: "预生产hgjdfgjjklyil", platform: "aozhou_kaijiang", tag: "", release: [{id: 1, tag_name: "RLS_LOTTERY_20230620_01"},{id: 2, tag_name: "dev-temp"},{id: 3, tag_name: "RLS_OK_20230817_02"},{id: 4, tag_name: "RLS_LOTTERY_20230620_03"}], servers: [
        //   {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"},
        //   {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "上线"}],}
      ],
      showText: [
        // {color: '#00ff00', text: "daf550de2b27fa8226b5344bc5dae972db368148736d10118521c21642461f99"},
        // {color: '#FDFEFE', text: "daf550de2b27fa8226b5344bc5dae972db368148736d10118521c21642461f99"},
      ],
      timer: null
    }
  },
  created() {
    this.fetchData();
    // this.getLog();
  },
  methods: {
    currentChange(page) {
      this.params.page = page
      this.fetchData()
    },
    handleSizeChange(pagesize) {
      this.params.pagesize = pagesize
      this.fetchData()
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val
    },
    async fetchData() {
      this.params.search = this.task_id
      let data = []
      var resp = await getProcess(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        data = resp.data[0].services
        this.task_name = resp.data[0].name
        this.params.total = resp.total
      }

      for (const item of data) {
        var resp = await getTagList({image_path: item.image_harbor})
        if (resp.code !== 200){
          this.$message({type: 'warning', message: resp.msg})
        }else {
          item.release = resp.data
        }
        this.tableData.push(item)
        this.checkClick(item)
      }
      // this.tableData = data
      console.log(this.tableData)


    },
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
        if (item.online === "上线"){item.online="下线"}
        else {item.online='上线'}
        this.$message({type: 'error', message: response.msg});
      }
    },
    async commitTag(){
      // console.log(this.tableData)
      var resp = await commitTag(this.tableData)
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})

      }else {
        this.$message({type: 'success', message: resp.msg})
        this.tag_post = true
      }

    },
    async checkClick(row){
      // console.log(row)
      var response = await svcCheck({id: row.id}).catch(() => {
        this.$message({type: "error", message: "请求失败"})
        return 0
      })
     if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
      } else {
        // this.$message({type: "success", message: response.msg})
       let index = this.tableData.indexOf(row)
       this.tableData[index].servers = response.data
      }
    },
    checkRelease(row){
      // console.log(row)
      if (row){
        return true
      }else {
        return false
      }
    },
    async on_submit_form(){
      var resp = await commitDeployTask({"services": this.tableData, "task_name": this.task_name})
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
      }else {
        this.$message({type: 'success', message: resp.msg})
        this.timer = setInterval(() => {
          setTimeout(this.getLog,1)
        }, 60*30)
      }
    },
    check_tag(){},
    async getLog(){
      var resp = await getLog({id: this.task_id})
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
      }else {

      }
      let text_list = resp.data.text.split("\n")
      text_list.forEach(item => {
        let i = {}
        // console.log(item.indexOf('成功'))
        if (item.indexOf('成功')!==-1){

          i.color = '#00ff00'
          i.text = item
          this.showText.push(i)
        }else {
          i.color = '#FDFEFE'
          i.text = item
          this.showText.push(i)
        }
        if (item.indexOf('发布成功')!==-1 || item.indexOf('发布失败')!==-1){
          clearInterval(this.timer)
          this.timer = null
        }

      })
    },
    async restartClick(row, item){
      let data = {
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
  },

  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
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

.deployTable {
  width: 99%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100vh;*/
}

.deployTable ::v-deep .el-table .cell {
  white-space: pre-line;
}


.el-button--mini, .el-button--mini.is-round {
  padding: 6px 9px;
}

.item-block {
  background-color: white;
  padding: 20px;
}

.log {
  width: 99%;
  margin-top: 5px;
  padding: 3px;
  border: 1px dashed rgb(0, 160, 198);
  background-color: rgb(0,0,0);
}
</style>