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
                <el-form-item v-for="(item, key) in scope.row.data" :label="key" align="center"  style="display: block">
                  <span>{{ item }}</span>
                </el-form-item>
                <el-form-item v-for="(item, key) in scope.row.data" :label="key" align="center"  style="display: block">
                  <span>{{ item }}</span>
                </el-form-item>

              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="param_name" label="模板名称" width="150px" align="center"></el-table-column>
          <el-table-column prop="with_service" label="服务关联" fit align="center">
            <template slot-scope="scope">
              <el-tag size="small" style="margin-right: 3px;margin-top: 5px;" v-for="item in scope.row.with_service">{{ item.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180px" align="center"></el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="180px" align="center"></el-table-column>

          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" style="color: #f56c6c" @click="deleteMenuClick(scope.row)">删除</el-button>

            </template>

          </el-table-column>

        </el-table>
      </div>


      <el-dialog title="新增菜单" :visible.sync="dialogVisable" width="50%">
        <el-form :model="addMenus">
          <el-form-item label="菜单组" :label-width="formLabelWidth">
            <el-select v-model="addMenus.menu_group_id" placeholder="请选择菜单组" style="width: 70%">
              <el-option
                v-for="item in menu_groups"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称" :label-width="formLabelWidth">
            <el-input v-model="addMenus.menu_name"  placeholder="请输入菜单名称"></el-input>
          </el-form-item>

          <el-form-item label="菜单地址" :label-width="formLabelWidth">
            <el-input v-model="addMenus.menu_link"></el-input>
          </el-form-item>
          
          <el-form-item label="菜单图标" :label-width="formLabelWidth">
            <el-input v-model="addMenus.menu_icon" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="addMenusCommit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="新增菜单组" :visible.sync="dialogAddVisable" width="35%">
        <el-form :model="addMenuGroup">
          <el-form-item label="菜单组名称" :label-width="formLabelWidth">
            <el-input v-model="addMenuGroup.group_name" style="width: 85%" placeholder="请输入菜单组名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addMenuGroupCommit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑" :visible.sync="dialogEditVisable" width="50%">
        <el-form :model="editMenus">
          <el-form-item label="菜单组" :label-width="formLabelWidth">
            <el-select v-model="editMenus.menu_group_id" placeholder="请选择菜单组" style="width: 70%">
              <el-option
                v-for="item in menu_groups"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称" :label-width="formLabelWidth">
            <el-input v-model="editMenus.menus_name"  placeholder="请输入菜单名称"></el-input>
          </el-form-item>

          <el-form-item label="菜单地址" :label-width="formLabelWidth">
            <el-input v-model="editMenus.menus_link"></el-input>
          </el-form-item>

          <el-form-item label="菜单图标" :label-width="formLabelWidth">
            <el-input v-model="editMenus.menus_icon" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogEditVisable = false">取 消</el-button>
          <el-button type="primary" @click="editMenusCommit">确 定</el-button>
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
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import {
  getMenus,
  addMenusGroup,
  getMenusGroup, addMenus, deleteMenus, editMenus
} from "@/api";
Vue.use(VueClipboard);
export default {
  name: "ParamCommon",
  data() {
    return {
      dialogVisable: false,
      dialogEditVisable: false,
      dialogAddVisable: false,
      formLabelWidth: "100px",
      addMenus: {
        menu_group_id: "",
        menu_name: "",
        menu_link: "",
        menu_icon: ""
      },
      editMenus: {},
      menu_groups: [],
      spanArr: [],
      addMenuGroup: {},
      params: {page: 1, pagesize: 15, total: 0, search: ""},
      multipleSelection: [],
      projects: [],
      tableData: [
        {param_name: "def_other", data: {"spring.redis.host": "10.210.0.124", "spring.redis.port": 6379, "ak.stat.redis.host": "10.210.0.124"}, with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
            {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        {param_name: "eureka", data: {"LOG_SERVER_HOST": "10.210.0.124", "LOG_SERVER_UDP_PORT": 12201, "nacos.config.server-addr": "10.210.0.91:8080"}, with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
          {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        {param_name: "redis", with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
          {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        {param_name: "encrypt", with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
          {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        {param_name: "emqtt-elb", with_service: [{name: "merchant_1235"}, {name: "chat_1235"}, {name: "merchant"}, {name: "agent_1235"},
          {name: "share_agent_1235"}, {name: "H5_1235"}, {name: "customer_1235"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        {param_name: "emqtt", with_service: [{name: "lottery_mqtt"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
      ]
    }
  },
  created() {
    // this.fetchData()
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
      var response = await getMenus(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        // this.getSpanArr(response.data)
        this.tableData = response.data
        this.getSpanArr(this.tableData)
        this.params.total = response.total
      }

      var group_data = await getMenusGroup().catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      this.menu_groups = []
      if (group_data.code !== 200){
        this.$message({type: 'warning', message: response.msg})
        return 0
      }
      group_data.data.forEach((item) => {
        this.menu_groups.push({label: item['group_name'], value: item['id']})
      })
    },
    deleteMenuClick(row) {
      this.$confirm('是否确认删除 ' + row.menus_name + ' 菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var response = await deleteMenus({"id": row.id})
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
      this.editMenus = row
      this.dialogEditVisable = true
    },
    async addMenusCommit(){
      var response = await addMenus(this.addMenus).catch(() => {
        this.$message({type: 'error', message: '请求失败'})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: "error", message: response.msg})
      } else {
        this.$message({type: "success", message: response.msg})
      }
      this.dialogVisable = false
      await this.fetchData()

    },
    async addMenuGroupCommit(){
      var response = await addMenusGroup(this.addMenuGroup).catch(() => {
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
    async editMenusCommit(){
      var response = await editMenus(this.editMenus).catch(() => {
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
    copy(e) {
      this.$message({
        message: "复制成功!",
        type: 'success'
      })
    },
    createTemplateCommit() {
      this.$router.push('/templates/create_template');
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


</style>