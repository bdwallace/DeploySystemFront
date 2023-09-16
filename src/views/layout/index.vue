<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container" v-on:updateTitleFun="updateTitle"></sidebar>
    <topbar :username="username" :content="page_title" class="nav"></topbar>
    <div class="main-container" style="margin-top: 60px">
      <app-main>
      </app-main>
    </div>
    <div class="footer">
      <span style="color: #33c38f">about author</span>
      <a href="https://t.me/byyunwei" target="_blank" class="el-icon-s-promotion" style="font-size: 20px"></a>
      <a href="mailto:biying.wallace@gmail.com" class="fas fa-envelope icon" style="margin-right: 5px"></a>
      <a href="https://www.facebook.com/" target="_blank" class="fa-brands fa-facebook icon"></a>
      <p>Copyright© 2022 Pandas All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import AppMain  from '@/views/layout/components/AppMain.vue'//页面布局的右侧区域
import sidebar  from '@/views/layout/components/sideBar/index.vue'//页面布局的左侧菜单
import topbar from '@/views/layout/components/headBar/index.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import '@/assets/fonts/iconfont.css'
export default {
  name: 'layout',
  components: {
    sidebar,
    AppMain,
    topbar
  },
  data() {
    return {
      page_title: this.$route.meta.title,
      username: localStorage.getItem("user_name"),
    }
  },
  methods:{
    updateTitle(val){
      this.page_title = val
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.nav{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.footer{
  margin-left: 200px;
  font-size: 13px;
  padding: 5px 20px;
  color: #6c7c95;
  background: #ecf5ff;
  line-height: 10px;
  padding-top: 30px;
}
.icon{
  font-size: 18px
}
</style>
