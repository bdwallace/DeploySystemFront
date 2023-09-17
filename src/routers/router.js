import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout'


// 公共路由
export const constantRoutes = [
  {
    path: '',
    redirect: '/projects',
  },
  {
    path: "/projects",
    name: "项目管理",
    hidden: false,
    component: Layout,
    meta: {
      title: "项目管理",
      icon: "iconfont icon-project"
    },
    children: [{
      path: "",
      name: "项目管理",
      hidden: false,
      component: () => import('@/views/singlepage/projects.vue'),
      meta: { title: "项目管理",icon: "iconfont icon-project" }
    }]
  },
  {
    path: "/platform",
    name: "平台管理",
    hidden: false,
    component: Layout,
    meta: { title: "平台管理", icon: "el-icon-user-solid" },
    children: [{
      path: "",
      name: "平台管理",
      hidden: false,
      component: () => import('@/views/singlepage/platform.vue'),
      meta: {
        title: "平台管理",
        icon: "iconfont icon-ic_platform"
      }
    }]
  },
  {
    path: '/servers',
    name: "服务器管理",
    component: Layout,
    hidden: false,
    meta: {title: '服务器管理',icon: 'fa-solid fa-layer-group'},
    children: [
      {
        path: 'get_host',
        component: () => import('@/views/hosts/servers.vue'),
        name: '主机管理',
        hidden: false,
        meta: { title: '主机管理', icon: 'fa-solid fa-server' }
      },
    ]
  },
  {
    path: '/services',
    name: "服务管理",
    component: Layout,
    hidden: false,
    meta: {title: '服务管理',icon: 'iconfont icon-services'},
    children: [
      {
        path: 'base',
        component: () => import('@/views/service/base_services.vue'),
        name: '基础服务',
        hidden: false,
        meta: { title: '基础服务', icon: 'iconfont icon-yonghuguanli' }
      },
      {
        path: 'platform',
        component: () => import('@/views/service/platform_services.vue'),
        name: '平台服务',
        hidden: false,
        meta: { title: '平台服务', icon: 'iconfont icon-yonghuguanli' }
      },
      {
        path: 'cs/:id',
        component: () => import('@/views/service/createService.vue'),
        name: '创建服务',
        hidden: true,
        meta: { title: '创建服务', icon: 'iconfont icon-yonghuguanli' }
      },
      {
        path: 'deploy/:id',
        component: () => import('@/views/service/deploy.vue'),
        name: '发布服务',
        hidden: true,
        meta: { title: '发布服务', icon: 'iconfont icon-yonghuguanli' }
      },
    ]
  },
  {
    path: "/templates",
    name: "模板管理",
    hidden: false,
    component: Layout,
    meta: {
      title: "模板管理",
      icon: "iconfont icon-template"
    },
    children: [{
      path: "common",
      name: "公共参数模板",
      hidden: false,
      component: () => import('@/views/templates/paramCommon.vue'),
      meta: { title: "公共参数模板",icon: "iconfont icon-jiaoseguanli" }
    },{
      path: "param_template",
      name: "自定义参数模板",
      hidden: false,
      component: () => import('@/views/templates/defineParamTemplate.vue'),
      meta: { title: "自定义参数模板",icon: "iconfont icon-jiaoseguanli" }
    },{
      path: "service_template",
      name: "服务模板",
      hidden: false,
      component: () => import('@/views/templates/serviceTemplate.vue'),
      meta: { title: "服务模板",icon: "iconfont icon-jiaoseguanli" }
    },{
      path: "create_template",
      name: "创建参数模板",
      hidden: true,
      component: () => import('@/views/templates/createCommon.vue'),
      meta: { title: "创建参数模板",icon: "iconfont icon-jiaoseguanli" }
    }]
  },

  {
    path: "/deploy",
    name: "发布进度",
    hidden: false,
    component: Layout,
    meta: { title: "发布进度", icon: "iconfont icon-history" },
    children: [{
      path: "history",
      name: "发布进度",
      hidden: false,
      component: () => import('@/views/singlepage/deployProcess.vue'),
      meta: {
        title: "发布进度",
        icon: "iconfont icon-history"
      }
    }]
  },
  {
    path: "/domains",
    name: "域名管理",
    hidden: false,
    component: Layout,
    meta: { title: "域名管理", icon: "iconfont icon-history" },
    children: [{
      path: "",
      name: "域名管理",
      hidden: false,
      component: () => import('@/views/singlepage/domains.vue'),
      meta: {
        title: "域名管理",
        icon: "el-icon-menu"
      }
    }]
  },
  {
    path: "/sg",
    name: "单页面管理",
    hidden: true,
    component: Layout,
    meta: { title: "单页面管理", icon: "iconfont icon-history" },
    children: [{
      path: "adddomain/:id",
      name: "新增域名",
      hidden: false,
      component: () => import('@/views/singlepage/createDomain.vue'),
      meta: {
        title: "新增域名",
        icon: "iconfont icon-history"
      }
    },{
      path: "cp",
      name: "创建平台",
      hidden: false,
      component: () => import('@/views/singlepage/createPlatform.vue'),
      meta: {
        title: "创建平台",
        icon: "iconfont icon-ic_platform"
      }
    }]
  },


]
export const dynamicRoutes = []

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
