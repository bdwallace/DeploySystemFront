<template>
  <el-container style="height: 100%">
    <div class="main">
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search"
                  class="input-with-select" style="width: 70%;" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="danger" icon="el-icon-delete" size="small" style="margin-left: 20px"
                   @click="deleteClick">批量删除
        </el-button>
      </div>
      <div class="deployTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
                  border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="deploy_user" label="发布用户" width="100" align="center"></el-table-column>
          <el-table-column prop="svc_name" label="服务名称" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.services">
                <el-tag  size="mini" style="margin-right: 3px">{{ item.svc_name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="project" label="项目环境" width="100" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.services">
                <el-tag  size="mini" style="margin-right: 3px">{{ item.project }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="old_tag" label="原版本" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.services">
                <el-tag  size="mini" style="margin-right: 3px">{{ item.old_tag }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="run_tag" label="目标版本" fit align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.services">
                <el-tag  size="mini" style="margin-right: 3px">{{ item.run_tag }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="target_host" label="目标主机" width="135" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.services">
                <el-tag v-for="host in item.servers" size="mini" style="margin-right: 3px">{{ host.public_ip }}</el-tag>
              </div>

            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发布时间" width="150" align="center"></el-table-column>
          <el-table-column prop="deploy_status" label="发布状态" width="100" align="center">
            <template slot-scope="scope" >
              <el-button v-if="scope.row.deploy_status==='发布成功'" circle type='success' icon="el-icon-check" size="mini"> </el-button>
              <el-button v-else-if="scope.row.deploy_status==='发布中'"  circle type="primary" icon="el-icon-loading" size="mini" ></el-button>
              <el-button v-else-if="scope.row.deploy_status==='发布失败'" circle type="danger" icon="el-icon-close"  size="mini" ></el-button>
            </template>
          </el-table-column>
          <!--          <el-table-column prop="remark" label="备注" fit align="center"></el-table-column>-->
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-more" size="mini" @click="detail(scope.row)">详情</el-button>
              <el-button v-if="scope.row.deploy_status==='发布成功'" style="color: #f56c6c" type="text" icon="el-icon-delete" size="mini" @click="deleteProcessClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>


      <div style="padding: 10px 16px;text-align: right;">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper"
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

import {deleteProcess, getProcess} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'DeployProcess',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      tableData: [
        // {deploy_user: "wallace", deploy_time: "2023-9-14 16:10:32", deploy_service: "lottery_task", target_host: ['172.166.28.64', '172.166.6.156'],
        //   deploy_envir: "预生产", old_version: "RLS_20230903T1652_23071401", new_version: "RLS_20230903T1652_23091412", deploy_status: "发布成功"},
        // {deploy_user: "wallace", deploy_time: "2023-9-14 16:10:32", deploy_service: "data_center_api", target_host: ['172.166.28.64', '172.166.6.156'],
        //   deploy_envir: "预生产", old_version: "RLS_20230903T1652_23071401", new_version: "RLS_20230903T1652_23091412", deploy_status: "发布失败"},
        // {deploy_user: "wallace", deploy_time: "2023-9-14 16:10:32", deploy_service: "lottery_remoteservice_provider", target_host: ['172.166.28.64', '172.166.6.156'],
        //   deploy_envir: "预生产", old_version: "RLS_20230903T1652_23071401", new_version: "RLS_20230903T1652_23091412", deploy_status: "发布中"},
        // {deploy_user: "wallace", deploy_time: "2023-9-14 16:10:32", deploy_service: "lottery_mqtt", target_host: ['172.166.28.64', '172.166.6.156'],
        //   deploy_envir: "预生产", old_version: "RLS_20230903T1652_23071401", new_version: "RLS_20230903T1652_23091412", deploy_status: "发布成功"},
        // {deploy_user: "wallace", deploy_time: "2023-9-14 16:10:32", deploy_service: "mysql", target_host: ['172.166.28.64', '172.166.6.156'],
        //   deploy_envir: "预生产", old_version: "RLS_20230903T1652_23071401", new_version: "RLS_20230903T1652_23091412", deploy_status: "发布成功"},
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
      var resp = await getProcess(this.params).catch(() => {
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
    detail(row){
      this.$router.push('/services/deploy/' + row.id)
    },
    async deleteClick(){
      let ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      const response = await deleteProcess({ids: JSON.stringify(ids)})
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      await this.fetchData();
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
  width: 99%;
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

</style>