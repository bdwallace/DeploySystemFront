<template>
  <el-container style="height: 100%">
    <div class="main">
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search"
                  class="input-with-select" style="width: 70%;" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px"
                   @click="addDomainClick">新增域名
        </el-button>
      </div>
      <div class="domainTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
                  border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="domain" label="域名" fit align="center"></el-table-column>
          <el-table-column prop="platform" label="所属平台" fit align="center">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.platform" size="mini" style="margin-right: 3px">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="project" label="项目环境" fit align="center"></el-table-column>
          <el-table-column prop="domain_type" label="域名服务类型" fit align="center"></el-table-column>
          <el-table-column prop="is_monitor" label="是否监控" fit align="center"></el-table-column>
          <el-table-column prop="is_speed" label="是否加速" fit align="center"></el-table-column>
          <el-table-column prop="cert" label="证书" fit align="center">
            <template slot-scope="scope">
<!--              <el-button type="primary" plain size="mini">上传</el-button>-->
              <el-button type="success" plain size="mini" @click="downloadCertClick(scope.row)">下载</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" fit align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="deleteDomainClick(scope.row)">删除
              </el-button>

            </template>

          </el-table-column>

        </el-table>
      </div>


      <div style="padding: 10px 16px;text-align: right;">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper"
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

import {deleteDomain, deletePlatform, downloadCert, getDomain} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-compone
  // nt-names
  name: 'Domains',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      dialogCreatePlatformVisable: false,
      tableData: [
        // {domain: "u8-pre.one2.cc", domain_svc_type: "H5", platform: ["预生产3300-U8","测试3300-U8"], is_montior: "是", is_speed: "是", project: "预生产"},
        // {domain: "bet123p.com", domain_svc_type: "H5", platform: ["预生产3300-U8"], is_montior: "是", is_speed: "是", project: "预生产"},
        // {domain: "bet123q.com", domain_svc_type: "H5", platform: ["预生产3300-U8"], is_montior: "是", is_speed: "是", project: "预生产"},
        // {domain: "bet123r.com", domain_svc_type: "H5", platform: ["预生产3300-U8"], is_montior: "是", is_speed: "是", project: "预生产"},
        // {domain: "prebrl.bet123.io", domain_svc_type: "H5", platform: ["预生产3300-U8"], is_montior: "是", is_speed: "是", project: "预生产"},
        // {domain: "rico77.one2.cc", domain_svc_type: "H5", platform: ["预生产3300-U8"], is_montior: "是", is_speed: "是", project: "预生产"}
      ],
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
      var resp = await getDomain(this.params).catch(() => {
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
    addDomainClick(){
      this.$router.push('/sg/adddomain/0')
    },
    editClick(row){
      this.$router.push('/sg/adddomain/' + row.id)
    },
    async deleteDomainClick(row){
      var response = await deleteDomain({"ids": row.id}).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      await this.fetchData()
    },
    async downloadCertClick(row){
      var response = await downloadCert({'id': row.id}).catch(() => {
        this.$message({type: "error", message: "下载错误"})
      })
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute("download", row.domain+'.zip')

      link.click()
      window.URL.revokeObjectURL(url)
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

.domainTable {
  width: 99%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100vh;*/
}

.domainTable ::v-deep .el-table .cell {
  white-space: pre-line;
}

</style>