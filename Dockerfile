# 编译
FROM node:18.16.1-alpine
WORKDIR /usr/local/
COPY . /usr/local/
#RUN export NODE_OPTIONS=--max-old-space-size=8192
RUN npm install && npm run build

# 运行镜像
FROM nginx:latest
COPY --from=0 /usr/local/dist /usr/share/nginx/html
COPY oss_system.conf /etc/nginx/conf.d/oss_system.conf
EXPOSE 8080