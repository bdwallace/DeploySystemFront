#!/bin/sh

sed  -i "s/@BACKEND_HOST@/$BACKEND_HOST/g" /etc/nginx/conf.d/deploy_system.conf
rm -f /etc/nginx/conf.d/default.conf


nginx -s reload 
nginx -g "daemon off;"
