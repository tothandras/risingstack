FROM centos:latest
MAINTAINER Andras Toth <andras.toth93@gmail.com>

RUN mkdir /nodejs && curl https://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1
ENV PATH $PATH:/nodejs/bin
RUN npm install -g npm

WORKDIR /app
ADD package.json /app/
RUN npm install
ADD . /app

RUN yum update -y
RUN yum install -y openssl
RUN openssl genrsa -out app.rsa 1024
RUN openssl rsa -pubout -in app.rsa -out app.rsa.pub

ENTRYPOINT npm start
EXPOSE 3000
