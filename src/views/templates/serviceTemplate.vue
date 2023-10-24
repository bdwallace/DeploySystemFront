<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入内容" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createTemplateClick">新增模板</el-button>
<!--        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createServiceClick">创建服务</el-button>-->
      </div>

      <div class="certTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange">

          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="template_name" label="服务模板名称" width="180" align="center"></el-table-column>
          <el-table-column prop="svc_name" label="服务名称" width="180" align="center"></el-table-column>
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
          <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>
<!--          <el-table-column prop="update_time" label="更新时间" width="180" align="center"></el-table-column>-->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteServiceTempClick(scope.row)">删除</el-button>
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
import {deleteCommonParamTemplate, deleteService, getServiceTemplate} from "@/api";


export default {
  name: "ServiceTemplate",
  data() {
    return{
      params: {page: 1, pagesize: 15, total: 0, search: "", is_template: '是'},
      tableData: []
    }
  },
  created() {
    this.fetchData()
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
      var resp = await getServiceTemplate(this.params).catch(() => {
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
    createTemplateClick(){
      this.$router.push('/services/cs/0')
    },
    editClick(row){
      this.$router.push('/services/cs/' + row.id)
    },
    createServiceClick(){

    },
    deleteServiceTempClick(row){
      this.$confirm('是否确认删除 ' + row.template_name + ' 参数模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteService({"ids": row.id})
        if (response.code === 200) {
          this.$message({type: 'success', message: '删除成功!'});
          await this.fetchData()
        } else {
          this.$message({type: 'error', message: '删除失败'});
        }
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
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