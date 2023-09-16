<template>
    <div class="page-header">
      <div class="header-left">
        <el-page-header @back="goBack" :content="content"></el-page-header>
      </div>
      <div class="header-right">
        <i class="el-icon-user-solid"></i>
        <span>{{ username }}</span>
      </div>
    </div>

</template>

<script>
export default {
  name: "index",
  props: {
    content: {type: String},
    username: {type: String}
  },

  methods: {
    goBack(){
      this.$router.back()
      console.log('返回')
    },

  }
}
</script>



<style>
.el-page-header__left::after {
  background: #2c3e50;
}
.el-page-header__content {
    font-size: 15px;
}

.page-header {
    margin-left: 200px;
    background: #cbdff3;
    display: flex;
    justify-content: space-between;
}
.header-left {
    text-align: center;
    float: left;

}
.header-left .el-page-header {
    line-height: 50px;
}
.header-right {
    /*text-align: right;*/
    float: right;
    margin-right: 10px;
}

.header-right span{
    line-height: 50px;
    font-size: 22px;
}
</style>