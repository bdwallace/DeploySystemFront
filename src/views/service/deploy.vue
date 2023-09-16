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
          <el-table-column prop="port" label="端口" width="100" align="center"></el-table-column>
          <el-table-column prop="envir" label="环境" width="120" align="center">
            <template slot-scope="scope">
              <el-tag  type="danger" size="mini">{{ scope.row.envir }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="平台" width="100" align="center"></el-table-column>
          <el-table-column prop="new_version" label="发布版本"  width="400" align="center">
            <template slot-scope="scope">
              <el-tag v-if="checkRelease(scope.row.tag)" style="margin-right: 3px" type="success" size="mini">
                <i class="el-icon-success"></i>
              </el-tag>
              <el-tag v-if="!checkRelease(scope.row.tag)" style="margin-right: 3px" type="danger" size="mini">
                <i class="el-icon-error"></i>
              </el-tag>
              <el-input v-if="tag_post" v-model="scope.row.tag.tag_name" size="mini" disabled readonly style="width: 280px"></el-input>
              <el-select v-else v-model="scope.row.tag" filterable size="mini" style="width: 280px;margin-right: 3px" value-key="id"  @change="checkRelease(scope.row.tag)">
                  <el-option v-for="item in scope.row.release" style="font-size: 5px;"
                             :key="item.id" :label="item.tag_name" :value="item">
                  </el-option>
              </el-select>

              <el-tooltip  placement="bottom" :content="scope.row.servers[0].run_version">
                <el-button type="success" size="mini" style="width: 50px" v-if="!tag_post"
                         @click="scope.row.tag = scope.row.servers[0].run_version" >回退</el-button>
              </el-tooltip>


            </template>
          </el-table-column>
          <el-table-column prop="check" label="检测" width="80" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="checkClick(scope.row.servers)">检测</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="servers" label="主机" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.servers">
                <el-switch v-model="item.online" style="margin-right: 3px"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="on"
                    inactive-value="off"
                    @change="linechange(scope.row)">
                </el-switch>
                <el-tag size="small" style="margin-right: 3px;width: 110px;margin-top: 3px" >{{ item.public_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 110px" type="info">{{ item.inner_ip }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;width: 83px" v-if="item.run_time==='未知'" type="warning" >{{ item.run_time }}</el-tag>
                <el-tag size="small" style="margin-right: 3px;" v-else>{{ item.run_time }}</el-tag>
                <el-input readonly class="input_blue" style="width: 200px" size="mini" v-model="item.run_version" ></el-input>
                <el-tooltip effect="light" content="http://54.179.119.160:8134/login" placement="left" style="margin-right: 3px">
                  <el-tag v-if="item.health==='200'" size="small" type="success" >健康</el-tag>
                  <el-tag v-else-if="item.health==='未知'" size="small" type="warning">未知</el-tag>
                  <el-tag v-else type="danger" size="small">异常</el-tag>
                </el-tooltip>

              </div>
            </template>
          </el-table-column>
<!--          <el-table-column prop="cmd" label="命令" fit align="center"></el-table-column>-->

        </el-table>
      </div>
<!--      <div class="item-block" style="margin-top: 10px;width: 99%">-->
        <el-tabs type="border-card" v-model="count" @tab-click="check_tag" style="margin-top: 10px;width: 99%">
          <el-tab-pane label="新发布" :name="`0`">
            <div>
              <el-button v-if="!tag_post" size="medium" type="primary" @click="commitTag">确定Tag版本</el-button>
              <div v-else style="display:inline">
                  <el-button type="primary" @click="on_submit_form(true)" :loading="on_submit_loading" style="margin-right: 50px">灰度发布
                  </el-button>
                  <el-button @click="tag_post=false">取消</el-button>

                  <el-button type="danger" @click="is_backDialog = true" style="float: right">
                      回退发布单
                  </el-button>

                  <el-button type="danger"  style="float: right;margin-right:30px"
                      @click="on_submit_form(false)" :loading="on_submit_loading">全部发布
                  </el-button>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane v-for="item in itemCount" :key="item" :name="`${parseInt(item)}`" :label="`第${item}次发布`"></el-tab-pane>
        </el-tabs>

        <div class="log">
            <code style="background-color: rgb(0, 0, 0);color:#00ff00">
                <br>
                <span v-for="n in showText" :style="{'color': n.color}" :key="n"> <pre style=" white-space: pre-wrap;" v-html="n.text"></pre> <br></span>
                <br>
            </code>
        </div>

    </div>
  </el-container>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Deploy',
  data() {
    return {
      tag_post: false,
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      all_release: [
          {id: 1, tag: "RLS_LOTTERY_20230620_01"},{id: 2, tag: "dev-temp"},{id: 3, tag: "RLS_OK_20230817_02"},{id: 1, tag: "RLS_LOTTERY_20230620_01"},
      ],
      tableData: [
        {svc_name: "eureka", port: "8134:8134", envir: "预生产hgjdfgjjklyil", platform: "aozhou_kaijiang", tag: "", release: [{id: 1, tag_name: "RLS_LOTTERY_20230620_01"},{id: 2, tag_name: "dev-temp"},{id: 3, tag_name: "RLS_OK_20230817_02"},{id: 4, tag_name: "RLS_LOTTERY_20230620_03"}], servers: [
          {public_ip: "52.221.75.184", inner_ip: "172.166.97.254",run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "on"},
          {public_ip: "18.136.78.64",inner_ip: "172.166.97.172", run_version: "RLS_LOTTERY_20230904_01", health: "未知", run_time: "未知", online: "on"}],}
      ],
      showText: [
        {color: '#00ff00', text: "daf550de2b27fa8226b5344bc5dae972db368148736d10118521c21642461f99"},
        {color: '#FDFEFE', text: "daf550de2b27fa8226b5344bc5dae972db368148736d10118521c21642461f99"},
      ]
    }
  },
  created() {
    this.fetchData()
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
      console.log(val)
      this.multipleSelection = val
    },
    async fetchData() {

    },
    commitTag(){
      this.tag_post = true
    },
    checkClick(row){
      console.log(row)
      row.forEach(item => {
        item.health = "200"
        item.run_time = "Up 3 weeks"
      })
    },
    checkRelease(row){
      console.log(row)
      return true
    }
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