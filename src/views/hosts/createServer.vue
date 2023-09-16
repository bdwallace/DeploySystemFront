<template>
  <el-container style="height: 100%">
    <div class="create-server-block">
      <el-form :model="formData" ref="formData" label-width="130px" style="width: 80%" size="medium">
        <el-form-item prop="project" label="主机名" required style="margin-top: 10px">
          <el-input v-model="formData.project" placeholder="请输入主机名" ></el-input>
        </el-form-item>
        <el-form-item prop="inner_ip" label="内网IP" required>
          <el-input v-model="formData.service_name" placeholder="请输入内网IP" ></el-input>
        </el-form-item>
        <el-form-item prop="public_ip" label="外网IP" required>
          <el-input v-model="formData.alias" placeholder="请输入外网IP" ></el-input>
        </el-form-item>
        <el-form-item prop="image_path" label="仓库地址" required>
          <el-input v-model="formData.image_path" placeholder="请输入镜像仓库地址"></el-input>
        </el-form-item>
        <el-form-item prop="docker_port" label="Docker Port">
          <el-select v-model="formData.docker_port" placeholder="请选择容器端口" style="width: 100%">
            <el-option v-for="item in itemDockerPort" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
      itemDockerPort: [2375, 32375],
      formData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {

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

.certTable ::v-deep .el-table .cell {
  white-space: pre-line;
}

.create-server-block {
  background-color: white;
  padding: 20px;
  margin-top: 15px;
  width: 50%;
  margin-left: 20px;
  margin-right: 10px;
}

</style>