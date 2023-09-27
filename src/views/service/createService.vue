<template>
  <el-container style="height: 100%;display: flex;flex-direction: column">
    <div style="display: flex;justify-content: space-between">
      <div class="save_left">
        <div class="item-block" style="padding: 10px">
          <el-form :model="formData" ref="formData" label-width="130px" style="width: 80%" size="medium">
            <el-form-item prop="project" label="项目环境" style="margin-top: 10px">
    <!--          <el-input v-model="formData.project" placeholder="请选择项目环境" ></el-input>-->
              <el-select v-model="formData.project" placeholder="请选择项目环境" style="width: 100%">
                <el-option v-for='item in projects' :key="item.id" :label="item.project_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="platform" label="所属平台" style="margin-top: 10px">
              <el-select v-model="formData.platform" placeholder="请选择平台" style="width: 100%">
                <el-option v-for='item in platform_list' :key="item.id" :label="item.platform_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="position" label="服务位置" style="margin-top: 10px">
              <el-select v-model="formData.position" placeholder="不选为服务模板" style="width: 100%">
                <el-option v-for='item in position_list' :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-block" style="padding: 10px;margin-top: 10px">
          <el-form :model="formData" ref="formData" label-width="130px" style="width: 80%" size="medium">
            <el-form-item prop="svc_name" label="服务名称" required>
              <el-input v-model="formData.svc_name" placeholder="请输入服务名称" ></el-input>
            </el-form-item>
            <el-form-item prop="alias" label="别名">
              <el-input v-model="formData.alias" placeholder="请输入项目别名" ></el-input>
            </el-form-item>
            <el-form-item prop="image_harbor" label="仓库地址" required>
              <el-input v-model="formData.image_harbor" placeholder="请输入镜像仓库地址"></el-input>
            </el-form-item>
            <el-form-item prop="svc_port" label="服务端口" required>
              <el-tooltip class="item" effect="dark" content="192.168.57.0:8080:80, 8443:443" placement="top">
                <el-input v-model="formData.svc_port" placeholder="请输入服务端口"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="docker_name" label="容器名称">
              <el-input v-model="formData.docker_name" placeholder="项目名_系统别名"></el-input>
            </el-form-item>
            <el-form-item prop="log_key_word" label="日志关键字">
              <el-input v-model="formData.logkeyword" placeholder="Started .* seconds"></el-input>
            </el-form-item>
            <el-form-item prop="health" label="健康检测">
              <el-input v-model="formData.health_url" placeholder="服务名/actuator/health"></el-input>
            </el-form-item>
            <el-form-item prop="nacos_url" label="Nacos" >
<!--              <el-input v-model="formData.nacos_url" placeholder="请输入Nacos地址"></el-input>-->
              <el-select v-model="formData.nacos_url" placeholder="请选择项目环境" style="width: 100%">
                <el-option v-for='item in projects' :key="item.id" :label="`${item.project_name} / ${item.nacos_url}`" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="docker_network" label="Docker Network" required>
    <!--          <el-input v-model="formData.docker_network"></el-input>-->
              <el-select v-model="formData.docker_network" placeholder="请选择容器网络" style="width: 100%">
                <el-option v-for="item in itemDockerNetwork" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="docker_port" label="Docker Port">
    <!--          <el-input v-model="formData.docker_port"></el-input>-->
              <el-select v-model="formData.docker_port" placeholder="请选择容器端口" style="width: 100%">
                <el-option v-for="item in itemDockerPort" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="docker_tls_path" label="Docker TLS path">
              <el-input v-model="formData.docker_tls_path" placeholder="/etc/openssl/"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="item-block" style="margin-top: 10px">
          <el-form :model="formData" ref="formData" label-width="10px" size="medium">
            <el-form-item label="上传地址" prop="hosts" label-width="100px">
              <el-input v-model="formData.upload_path" placeholder="download html 上传目录" style="width: 78%"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-block" style="margin-top: 10px">
          <el-form :model="formData" ref="formData" size="medium">
            <el-form-item label="服务器列表:" label-width="100px" prop="hosts">
              <el-form-item v-for="(host, index) in formData.host_list" :key="index" :label="String(index+1)" style="margin-bottom: 10px">
                <el-select v-model="formData.host_list[index]" placeholder="请选择目标服务器" style="width: 77%" value-key="id">
                  <el-option v-for="item in allhosts" :key="item.id" :label="`${item.host_name} / ${item.inner_ip}`" :value="item"></el-option>
                </el-select>
                <el-button type="warning" size="mini" style="margin-left: 5px" @click.prevent="removeHost(host)" icon="el-icon-delete">删除</el-button>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addHost">添加</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div class="save_right">
        <div class="item-block">
          <el-form :model="formData" ref="formData" label-width="10px" size="medium">
            <el-form-item  v-for="(param, index) in formData.param_list" :key="index" label="自定义参数:" label-width="100px" style="margin-bottom: 10px">
<!--                <el-input v-model="param.value" placeholder="请输入自定义参数" type="textarea" autosize style="width: 300px;"></el-input>-->
              <el-select v-model="formData.param_list[index]" placeholder="请选择自定义参数模板" value-key="name"
                         style="width: 300px;margin-left: 5px" size="medium">
                <el-option v-for="(item, i) in all_define_temp" :key="i"
                           :label="item.name" :value="item"></el-option>
              </el-select>

              <el-select v-model="formData.param_list[index].server" placeholder="不选为全部主机" style="width: 150px;margin-left: 5px" size="medium">
                <el-option v-for="item in formData.host_list" :key="item.id" :label="`${item.host_name} / ${item.inner_ip}`" :value="item.id"></el-option>
              </el-select>

              <el-button type="warning" size="mini" style="margin-left: 5px" @click.prevent="removeParams(param)" icon="el-icon-delete">删除</el-button>

              <el-form-item>
<!--                {{param}}-->
                <table v-if="formData.param_list[index].config">
                  <tr v-for="(item,key, i) in formData.param_list[index].config" :key="i" style="line-height:20px">
                      <td align="left" style="padding:5px">
                          {{ item.value }}
                      </td>
                  </tr>
                </table>
              </el-form-item>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addParams">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-block" style="margin-top: 10px">
          <el-form :model="formData" ref="formData" label-width="10px" size="medium">
            <el-form-item v-for="(param_obj, index) in formData.templates" :key="index" label="关联公共参数:" label-width="100px" style="margin-bottom: 10px">
              <el-select v-model="formData.templates[index]" placeholder="请选择公共参数模板" style="width: 77%" size="medium" value-key="name">
                <el-option v-for="item in param_templates" :key="item.name"
                           :label="item.name" :value="item"></el-option>
              </el-select>

              <el-button type="warning" size="mini" style="margin-left: 5px" @click.prevent="removeCommonParams(param_obj)" icon="el-icon-delete">删除</el-button>

              <el-form-item>
                <table v-if="formData.templates[index].config">
                  <tr v-for="(item,key, i) in formData.templates[index].config" :key="i" style="line-height:20px">
                    <td align="right" style="width:300px;padding:5px">
                        {{ item.name }}
                    </td>
                    <td align="left" style="width:300px;padding:5px;word-wrap: break-word;word-break: break-all">
                      {{ item.content }}
                    </td>
                  </tr>
                </table>
              </el-form-item>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addCommonParams">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-block" style="margin-top: 10px">
          <el-form :model="formData" ref="formData" label-width="100px">
            <el-form-item prop="service_type" label="服务类型">
              <el-select v-model="formData.svc_type" placeholder="请选择服务类型" style="width: 77%">
                <el-option v-for="item in all_service_type" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="platform" label="所属平台"  style="margin-top: 10px" v-if="formData.svc_type !=='java'">
              <el-select v-model="formData.platform" placeholder="请选择平台" style="width: 77%">
                <el-option v-for='item in platform_list' :key="item.id" :label="item.platform_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item prop="domain" label="域名" v-if="formData.svc_type !=='java'">-->
<!--              <el-select v-model="formData.domains" placeholder="请选择域名" style="width: 77%">-->
<!--                <el-option v-for='item in all_domain' :key='item.id' :label="item.domain" :value="item.id"></el-option>-->
<!--              </el-select>-->
<!--              <span style="margin-left:3px;color: red" size="1"></span>-->
<!--            </el-form-item>-->
            <el-form-item prop="domains" label="域名" v-if="formData.svc_type !=='java'">
              <div v-for="item in formData.domains" :key="item.id">{{item.domain}}</div>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-block" v-if="formData.svc_type !=='java'" style="margin-top: 10px;">
          <el-form :model="formData" ref="formData" label-width="100px" size="medium">
            <el-form-item label="黑名单列表:" prop="black_list" style="margin-bottom: 10px">
              <el-input v-model="formData.blacklist" type="textarea" rows="5" style="width: 77%" placeholder="eg:
deny 1.1.1.1;
deny 2.2.2.2;
allow all;"></el-input>
            </el-form-item>
            <el-form-item label="禁止UA:" prop="black_list" style="margin-bottom: 10px">
              <el-input v-model="formData.deny_user_agent" type="textarea" rows="5" style="width: 77%" placeholder="eg:
...
..."></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addHost">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="save_bottom">
      <el-button type="primary" @click="createServiceClick('create')" v-if="id==='0' || formData.is_template==='是'">创建服务</el-button>
      <el-button type="success" @click="dialogAddVisable = true" v-if="id==='0'">创建服务模板</el-button>
      <el-button type="primary" @click="createServiceClick('update')" v-else>更新保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
    <el-dialog title="创建模板" :visible.sync="dialogAddVisable" width="50%">
        <el-form :model="formData">
          <el-form-item label="模板名称" label-width="120px">
            <el-input v-model="formData.template_name" style="width: 85%" placeholder="请输入模板名称"></el-input>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogAddVisable=false">取 消</el-button>
          <el-button type="primary" @click="addTemplateCommit">确 定</el-button>
        </div>
      </el-dialog>
  </el-container>

</template>

<script>

import {
  addService,
  editService,
  getCommonParamTemplate,
  getDomain,
  getHosts,
  getPlatform,
  getProject, getService
} from "@/api";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'CreateService',
  data() {
    return {
      id: this.$route.params.id,
      dialogAddVisable: false,
      position_list: ['基础服务', '平台服务'],
      projects:[
        // {project_name: "预生产", alias: "Pre", nacos_addr: "172.166.13.201:8848", create_time: "2020-05-19 18:59:54", update_time: "2023-05-07 15:39:45"},
        // {project_name: "步多多", alias: "bdd", nacos_addr: "10.9.100.51:8848", create_time: "2020-07-01 14:23:14", update_time: "2023-05-07 15:39:45"},
        // {project_name: "微聊", alias: "wl", nacos_addr: "10.210.0.91:8080", create_time: "2020-07-21 17:32:01", update_time: "2023-05-07 15:39:45"},
        // {project_name: "开发环境钱包", alias: "wallet-dev", nacos_addr: "10.210.1.233:8080", create_time: "2021-04-15 13:03:40", update_time: "2023-05-07 15:39:45"},
        // {project_name: "预生产环境钱包", alias: "wallet-pre", nacos_addr: "172.166.8.54:8848", create_time: "2021-07-27 17:04:06", update_time: "2023-05-07 15:39:45"},
        // {project_name: "开发C2C", alias: "c2c-dev", nacos_addr: "172.166.13.201:8848", create_time: "2022-01-28 13:13:17", update_time: "2023-05-07 15:39:45"},
        // {project_name: "预生产c2c", alias: "c2c-pre", nacos_addr: "172.166.13.201:8848", create_time: "2022-02-12 10:14:45", update_time: "2023-05-07 15:39:45"},
      ],
      itemDockerNetwork:["--net=host","--net=bridge"],
      itemDockerPort: [2375, 32375],
      platform_list: [
        //   {platform_code: 110, platform_name: "Pre-桑巴舞-3302", create_time: "2023-9-14 10:45:12", update_time: "2023-9-14 10:45:12", services: [
        //     {service_name: 'pre-Brl-H5'},{service_name: 'merchant_brl'},{service_name: 'pre-Brl-H5'},{service_name: 'pre-Brl-PC'}]
        // },
        // {platform_code: 3300, platform_name: "预生产3300-U8", create_time: "2023-9-14 10:45:12", update_time: "2023-9-14 10:45:12", services: [
        //   {service_name: 'H5_U8'},{service_name: 'merchant_u8'},{service_name: 'share_agent_6hao'},{service_name: 'customer_6hao'},{service_name: 'H5_6hao_proxy'},
        //     {service_name: 'HK-azkaijiang-akbet'},{service_name: 'down-share-6hao'},{service_name: 'H5_6hao'}]
        // },
        // {platform_code: 3302, platform_name: "Pre-桑巴舞-3302", create_time: "2023-9-14 10:45:12", update_time: "2023-9-14 10:45:12", services: [
        //   {service_name: 'superbackend'},{service_name: 'merchant'},{service_name: 'operation'},{service_name: 'nginx'}]
        // }
      ],
      allhosts: [
        // {host_name: "pre-base-services-a", public_ip: "13.250.57.29",inner_ip: "172.166.10.50",
        //   services: [{name: "zuul"},{name: "common-api"},{name: "eureka"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-base-services-b", public_ip: "13.229.239.172",inner_ip: "172.166.1.62",
        //   services: [{name: "common-api"},{name: "eureka"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-micro-services-a", public_ip: "54.169.77.132",inner_ip: "172.166.2.244",
        //   services: [], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-config-services-01-a", public_ip: "13.212.96.7",inner_ip: "172.166.9.34",
        //   services: [{name: "config_issue_api"},{name: "config_open_api"},{name: "config_api"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-config-services-02-a", public_ip: "54.179.87.237",inner_ip: "172.166.13.180",
        //   services: [{name: "config_mq_consumer"},{name: "config_timer"},{name: "config_admin_api"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
        // {host_name: "pre-lottery-services-01-a", public_ip: "13.212.20.90",inner_ip: "172.166.11.97",
        //   services: [{name: "lottery_payment_api"},{name: "lottery_login_api"},{name: "lottery_order_api"}, {name: "lottery_c2c_api"}], envir: "预生产", create_time: "2023-9-12 12:00:00"},
      ],
      param_templates: [
        // {name: "def_other", config: {"spring.redis.host": "10.210.0.124", "spring.redis.port": 6379, "ak.stat.redis.host": "10.210.0.124"}, with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
        //     {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        // {name: "eureka", config: {"LOG_SERVER_HOST": "10.210.0.124", "LOG_SERVER_UDP_PORT": 12201, "nacos.config.server-addr": "10.210.0.91:8080"}, with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
        //   {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        // {name: "redis", config: {"spring.redis.host": "10.210.0.124", "spring.redis.port": 6379, "ak.stat.redis.host": "10.210.0.124"}, with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
        //   {name: "lottery_mqtt"}, {name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        // {name: "encrypt", config: {},with_service: [{name: "superbackend"}, {name: "zuul"}, {name: "eureka"}, {name: "config_remoteservice_provider"},
        //   {name: "lottery_mqtt"},{name: "lottery_c2c_api"}, {name: "lottery_task"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        // {name: "emqtt-elb", config: {"spring.redis.host": "10.210.0.124", "spring.redis.port": 6379, "ak.stat.redis.host": "10.210.0.124"}, with_service: [{name: "merchant_1235"}, {name: "chat_1235"}, {name: "merchant"}, {name: "agent_1235"},
        //   {name: "share_agent_1235"}, {name: "H5_1235"}, {name: "customer_1235"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
        // {name: "emqtt", config: {"spring.kafka.bootstrap-servers": "'ENC(cFtds0yseRVpf5H2rkQFl6OIr8j5CWbpYA4Sv1XXVj2DBvlY9zD6yf1876MLq3UZv9PqeC+799ZwTCKZnAy7HV+AwD2DjAB0Z3uybaE8lZ2Bf2KFRMA0VI5jf9mb6sIceU5BsziVjXMy1IyZsAbf5CiuEiHa3Mufa8aMMmVKoT7dQzipo1rtBS38qyN+I7Lg7hOzYtoxJwGix/Qq+HfivTqzvOqjzPKTDr3iLebqs0BumtmtrJQNaK2vYzhDYNdnFmbMvMu0Aaf+z9oTfM+kaKHMH2Uwx5Uk)'", "spring.redis.port": 6379, "ak.stat.redis.host": "10.210.0.124"}, with_service: [{name: "lottery_mqtt"}], create_time: "2023-9-12 12:00:00", update_time: "2023-9-12 12:00:00"},
      ],
      all_service_type:["java", "h5", "h5-proxy", "h5-site", "merchant", "download", "download-share", "agent",
          "share-agent", "customer", "chat-backend", "other"],
      
      all_define_temp:[
        // {id: "sdfg56fg", name: "zuul参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "eureka参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "config_remoteservice_provider参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "lottery_api参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "config_timer参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "lottery_risk参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "HK-azkaijiang-akbet参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
        // {id: "wsdfgrjgdh",name: "kaijiang_6hao参数模板", data:[{value: "-e PORT=8800"}, {value: "-e server.port=8110"}], create_time: "2023-9-14 13:18:30"},
      ],
      all_domain: [
        {id: 1, domain_name: "reyds.cc"},{id: 2, domain_name: "test.cc"},{id: 3, domain_name: "uiotyj.com"},{id: 4, domain_name: "qwedr.xyz"},
      ],
      formData: {
        project: "",
        platform: "",
        svc_name: '',
        alias: "",
        svc_port: "",
        image_harbor: "",
        template_name: "",
        logkeyword: "Started .* seconds",
        nacos_url: "",
        host_list: [{id: ""}],
        param_list:[{id: ""}],
        templates:[{id: ""}],
        svc_type: "java",
        upload_path: "",
        health_url: "",
        docker_network: "",
        docker_port: "",
        docker_tls_path: "",
        blacklist: "",
        deny_user_agent: "",
        nomal_domain: [{id: 1, domain_name: "reyds.cc"},{id: 2, domain_name: "test.cc"}]
      },
      on_submit_loading: false,
      params: {page: 1, pagesize: 15, total: 0, search: ""},
    }
  },

  created(){
    this.fetchData()
  },
  methods: {
    async fetchData() {

      var resp = await getPlatform(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {

        this.platform_list = resp.data
        // console.log(this.platform_list)
        // this.params.total = resp.total
      }

      var resp = await getProject(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.projects = resp.data
        // this.params.total = resp.total
      }

      var response = await getHosts(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.allhosts = response.data
      }
      this.params.pagesize = 30
      var response = await getCommonParamTemplate(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        response.data.forEach(item => {
          if (item.temp_type==='define'){
            this.all_define_temp.push(item)
          }else {
            this.param_templates.push(item)
          }
        })
        // console.log(this.all_define_temp)
        // console.log(this.param_templates)
      }


      // var resp = await getDomain(this.params).catch(() => {
      //   this.$message({type: 'error', message: "请求错误"})
      //   return 0
      // })
      // if (resp.code !== 200){
      //   this.$message({type: 'warning', message: resp.msg})
      //   return 0
      // }else {
      //   this.all_domain = resp.data
      //   // this.params.total = resp.total
      // }

      if (this.$route.params.id === '0'){
        return
      }
      this.params.search = this.$route.params.id
      var resp = await getService(this.params).catch(() => {
        this.$message({type: 'error', message: "请求错误"})
        return 0
      })
      if (resp.code !== 200){
        this.$message({type: 'warning', message: resp.msg})
        return 0
      }else {
        this.formData = resp.data[0]
        console.log(this.formData)
        // this.params.total = resp.total
      }
    },
    async addTemplateCommit(){
      if (!this.formData.svc_name){
        this.$message({type: 'warning', message: '服务名不能为空'})
        this.dialogAddVisable = false
        return
      }else if (!this.formData.alias){
        this.$message({type: 'warning', message: '别名不能为空'})
        this.dialogAddVisable = false
        return
      }else if (!this.formData.image_harbor){
        this.$message({type: 'warning', message: '仓库地址不能为空'})
        this.dialogAddVisable = false
        return
      }else if (!this.formData.svc_port){
        this.$message({type: 'warning', message: '服务端口不能为空'})
        this.dialogAddVisable = false
        return
      }else if (!this.formData.docker_network){
        this.$message({type: 'warning', message: '容器网络不能为空'})
        this.dialogAddVisable = false
        return
      }
      this.formData.is_template = '是'
      var response = await addService(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      this.$router.push('/templates/service_template')

      this.dialogAddVisable = false
    },
    removeHost(item) {
      var index = this.formData.host_list.indexOf(item)
      if (index !== -1) {
        this.formData.host_list.splice(index, 1)
      }
    },
    addHost() {
      this.formData.host_list.push({
        value: '',
        key: Date.now()
      });
    },
    removeParams(item) {
      var index = this.formData.param_list.indexOf(item)
      if (index !== -1) {
        this.formData.param_list.splice(index, 1)
      }
    },
    addParams() {
      this.formData.param_list.push({
        define_temp: {},
        key: Date.now()
      });
    },
    removeCommonParams(item) {
      var index = this.formData.templates.indexOf(item)
      if (index !== -1) {
        this.formData.templates.splice(index, 1)
      }
    },
    addCommonParams() {
      this.formData.templates.push({
        define_temp: {},
        key: Date.now()
      });
    },
    async createServiceClick(commit_type){
      console.log(this.formData)
      if (commit_type === "create"){
        if (!this.formData.svc_name){
          this.$message({type: 'warning', message: '服务名不能为空'})
        }else if (!this.formData.alias){
          this.$message({type: 'warning', message: '别名不能为空'})
        }else if (!this.formData.image_harbor){
          this.$message({type: 'warning', message: '仓库地址不能为空'})
        }else if (!this.formData.svc_port){
          this.$message({type: 'warning', message: '服务端口不能为空'})
        }else if (!this.formData.docker_network){
          this.$message({type: 'warning', message: '容器网络不能为空'})
        }
        delete this.formData.template_name
        delete this.formData.is_template
        var response = await addService(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      } else if (commit_type==='update'){
        var response = await editService(this.formData).catch(() => {
          this.$message({type: 'error', message: "请求错误"})
          return 0
        })
      }

      if (response.code !== 200){
        this.$message({type: 'warning', message: response.msg})
      }else {
        this.$message({type: 'success', message: response.msg})
      }
      this.$router.push('/services/base')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.save_left {
  margin-top: 15px;
  width: 50%;
  margin-left: 20px;
  margin-right: 10px;
}
.save_right {
  margin-top: 15px;
  width: 50%;
  margin-right: 15px;
}
.save_bottom {
  margin-top: 20px;
  margin-left: 20px;
  background-color: white;
  height: 100px;
  padding: 30px;

}
.item-block {
  background-color: white;
  padding: 20px;
}
</style>