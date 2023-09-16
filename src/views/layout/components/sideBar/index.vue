<template>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <div class="logo">
        <h2 style="margin-top: 5px">自动发布系统</h2>
<!--        <el-image :src="require('@/assets/dnslogo2.png')" style="width: 150px;height: 60px"></el-image>-->
<!--        <el-image :src="require('@/assets/dnslogo-white.png')" style="width: 150px;height: 110px"></el-image>-->
      </div>
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
</template>

<script>
import sidebarItem from './sidebarItem'
import {constantRoutes} from '@/routers/router'

export default {
  components: { sidebarItem },
  props: {page_title: {type: String}},
  computed: {
    routes() {
      return constantRoutes
    }
  },
  updated() {
    this.$emit("updateTitleFun", this.$route.meta.title)
  }
}
</script>

<style>

.logo {
  display: flex;
  justify-content: center;
}

.el-menu {
    text-align: left;
    color: white;
}
</style>