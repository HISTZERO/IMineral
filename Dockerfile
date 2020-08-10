FROM nginx:1.11-alpine
COPY default.conf /etc/nginx/conf.d/
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

