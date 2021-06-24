FROM nginx

WORKDIR /tmp/app

# Install node and requirements
RUN apt-get update && apt-get install -y nodejs npm
RUN npm cache clean -f && npm install -g n && n stable

# Build static files
COPY app .
RUN npm install && npm run prod && mv ./dist/* /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d
