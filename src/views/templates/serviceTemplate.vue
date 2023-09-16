<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入内容" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createTemplateClick">新增模板</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createServiceClick">创建服务</el-button>
      </div>

      <div class="certTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column prop="temp_name" label="服务模板名称" width="230" align="center"></el-table-column>
          <el-table-column prop="define_param" label="自定义参数" fit align="center">
            <template slot-scope="scope">
                <el-tag v-for="item in scope.row.define_param"  size="small" style="margin-right: 3px">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="common_param" label="公共参数" fit align="center">
            <template slot-scope="scope">
                <el-tag v-for="item in scope.row.common_param" type="success" size="small" style="margin-right: 3px">{{ item }}</el-tag>
            </template>
          </el-table-column>
<!--          <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>-->
          <el-table-column prop="update_time" label="更新时间" width="180" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" width="150" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" style="color: #f56c6c" @click="deleteDomainClick(scope.row)">删除</el-button>
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


export default {
  name: "ServiceTemplate",
  data() {
    return{
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      tableData: [
        {temp_name: 'zuul服务模板', common_param: ["def_other", "jvm-812M", "zuul-elb", "mysql"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'config_api服务模板', common_param: ["emqtt", "APP_ICON","eureka"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'lottery_api服务模板', common_param: ["jvm-812M", "eureka", "mysql", "encrypt", "APP_ICON"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'download_6hao_2服务模板', common_param: ["jvm-812M","eureka"], define_param: ["lottery_api参数模板", "eureka参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'eureka服务模板', common_param: ["zuul-elb", "encrypt"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'lottery_admin_api服务模板', common_param: ["VUE_APP_CONFIG-202207","eureka"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'config_task服务模板', common_param: ["zuul-elb", "jvm-300M"], define_param: ["lottery_api参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'lottery_mysql2es_sync服务模板', common_param: ["jvm-300M", "APP_ICON"], define_param: ["zuul自定义参"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'H5_U8服务模板', common_param: ["APP_ICON", "merchant_elb"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},
        {temp_name: 'merchant_u8服务模板', common_param: ["def_other","APP_ICON"], define_param: ["zuul参数模板"], create_time: "2023-9-15 10:08:12", update_time: "2023-9-15 10:08:12", remark: "空"},

      ]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    handleSelectionChange() {
      console.log(val)
      this.multipleSelection = val
    },
    currentChange(page){
      this.params.page = page
      this.fetchData()
    },
    handleSizeChange(pagesize){
      this.params.pagesize = pagesize
      this.fetchData()
    },
    async fetchData(){

    },
    createTemplateClick(){
      this.$router.push('/services/cs/0')
    },
    editClick(row){
      this.$router.push('/services/cs/' + row.temp_name)
    },
    createServiceClick(){

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
    height: 100%;
}

.certTable {
    width: 99%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*height: 100vh;*/
}
.el-input {
    width: 70%;
  }
</style>