# 自动发布系统

## 拉取代码
```angular2html
https://gitops.one2.cc/devops/deploysystemfront.git
```


## 构建镜像
```angular2html
cd ./deploysystemfront/
docker build -t xxxxxxx/devops/deploy_system_front:xxxx .
docker push harbor.one2.cc/devops/deploy_system_front:version
```

## 部署运行
```angular2html
docker run -it -d --name deploy_system_front  -p 88:88 -e BACKEND_HOST=10.100.10.142 harbor.one2.cc/devops/deploy_system_front:20230829
```

## Project setup
```
yarn install / npm install
```

### Compiles and hot-reloads for development
```
yarn serve / npm run serve
```

### Compiles and minifies for production
```
yarn build / npm run build
```

