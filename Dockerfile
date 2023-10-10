# 编译
FROM node:18.16.1-alpine
WORKDIR /usr/local/
COPY . /usr/local/
#RUN export NODE_OPTIONS=--max-old-space-size=8192
RUN npm install && npm run build

# 运行镜像
FROM nginx:latest
COPY --from=0 /usr/local/dist /usr/share/nginx/html
COPY deploy_system.conf /etc/nginx/conf.d/deploy_system.conf
ADD entrypoint.sh /entrypoint.sh
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log && chmod +x /entrypoint.sh
EXPOSE 8082

CMD ["/bin/sh", "-c", "/entrypoint.sh"]