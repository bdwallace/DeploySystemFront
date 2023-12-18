<template>
  <el-container>
    <div class="main" >
      <div class="search-bock">
        <el-input placeholder="请输入搜索内容, 支持所有内容模糊搜索, 回车或点击按钮搜索" v-model="params.search" class="input-with-select" @change="fetchData">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 20px" @click="createTemplateCommit">创建模板</el-button>
      </div>

      <div class="certTable">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
          border :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          @selection-change="handleSelectionChange">

          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-for="item in scope.row.config" style="margin-left: 100px">
                  <el-form-item  align="center" >
                    <td align="left" style="width:300px;border-style:none;padding:10px">
                      <span>{{ item.name }}</span> &emsp;
                    </td>
                    <td align="left" style="width: 800px;border-style:none;padding:10px">
                      <span style="width: 100%">{{ item.content }}</span>
                    </td>
                  </el-form-item>
                </div>

              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="模板名称" width="150px" align="center"></el-table-column>
          <el-table-column prop="services" label="服务关联(包含服务模板)" fit align="center">
            <template slot-scope="scope">
              <el-tag size="small" style="margin-right: 3px;margin-top: 5px;" v-for="item in scope.row.services">{{ item.svc_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180px" align="center"></el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="180px" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" style="color: #f56c6c" @click="deleteTempClick(scope.row)">删除</el-button>
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
  getCommonParamTemplate, deleteCommonParamTemplate
} from "@/api";

export default {
  name: "ParamCommon",
  data() {
    return {
      dialogVisable: false,
      dialogEditVisable: false,
      dialogAddVisable: false,
      formLabelWidth: "100px",
      editMenus: {},
      menu_groups: [],
      spanArr: [],
      addMenuGroup: {},
      params: {page: 1, pagesize: 15, total: 0, search: "", temp_type: "common"},
      multipleSelection: [],
      projects: [],
      tableData: []
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
      var response = await getCommonParamTemplate(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        // this.getSpanArr(response.data)
        this.tableData = response.data
        this.params.total = response.total
      }
    },
    deleteTempClick(row) {
      this.$confirm('是否确认删除 ' + row.name + ' 参数模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteCommonParamTemplate({"ids": row.id})
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
      this.$router.push('/templates/create_template/' + row.id);
    },
    createTemplateCommit() {
      this.$router.push('/templates/create_template/0');
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

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-input {
  width: 70%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

/deep/ .el-form-item__content {
  line-height: 10px;
}

</style>