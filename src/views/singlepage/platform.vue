<template>
  <el-container style="height: 100%">
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" style="width: 70%;" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createPlatformClick">创建平台</el-button>
      </div>
      <div class="platformTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="platform_code" label="平台编号" width="100" align="center"></el-table-column>
          <el-table-column prop="platform_name" label="平台名称" width="200" align="center"></el-table-column>
          <el-table-column prop="services" label="平台服务" fit align="center">
            <template slot-scope="scope">
                <el-tag v-for="item in scope.row.services" size="small" style="margin-right: 3px">{{ item.service_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="180" align="center"></el-table-column>
<!--          <el-table-column prop="remark" label="备注" fit align="center"></el-table-column>-->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteDomainClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>


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

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Platform',
  data() {
    return {
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      tableData: [
        {platform_code: 110, platform_name: "Pre-桑巴舞-3302", create_time: "2023-9-14 10:45:12", update_time: "2023-9-14 10:45:12", services: [
            {service_name: 'pre-Brl-H5'},{service_name: 'merchant_brl'},{service_name: 'pre-Brl-H5'},{service_name: 'pre-Brl-PC'}]
        },
        {platform_code: 3300, platform_name: "预生产3300-U8", create_time: "2023-9-14 10:45:12", update_time: "2023-9-14 10:45:12", services: [
          {service_name: 'H5_U8'},{service_name: 'merchant_u8'},{service_name: 'share_agent_6hao'},{service_name: 'customer_6hao'},{service_name: 'H5_6hao_proxy'},
            {service_name: 'HK-azkaijiang-akbet'},{service_name: 'down-share-6hao'},{service_name: 'H5_6hao'}]
        },
        {platform_code: 3302, platform_name: "Pre-桑巴舞-3302", create_time: "2023-9-14 10:45:12", update_time: "2023-9-14 10:45:12", services: [
          {service_name: 'superbackend'},{service_name: 'merchant'},{service_name: 'operation'},{service_name: 'nginx'}]
        }
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
      console.log(val)
      this.multipleSelection = val
    },
    async fetchData(){

    },
    createPlatformClick(){
      this.$router.push('/sg/cp')
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

.platformTable {
    width: 99%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*height: 100vh;*/
}
.platformTable ::v-deep .el-table .cell{
  white-space: pre-line;
}

</style>