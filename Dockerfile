FROM nginx

# Set up user
RUN useradd --create-home --shell /bin/bash web_user
WORKDIR /home/web_user

# Install node and requirements
RUN apt-get update && apt-get install -y nodejs npm
RUN npm cache clean -f && npm install -g n && n stable

# Build static files
COPY app ./app
WORKDIR /home/web_user/app
RUN npm install
RUN npm run prod && mv ./dist/* /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d
