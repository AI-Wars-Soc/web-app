FROM nginx

# Copy root serve files
COPY root-serve /usr/share/nginx/html/

# Install node and requirements
RUN apt-get update && apt-get install -y nodejs npm
RUN npm cache clean -f && npm install -g n && n latest

# Build static files
COPY app ./app
WORKDIR /home/web_user/app
RUN npm install

# USER web_user
RUN npm run prod && mv ./dist/* /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d
