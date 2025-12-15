FROM node:14 AS builder

# Define build arguments
ARG DEPLOY
ARG PROD

WORKDIR /app

COPY ./proxy/src/ .
RUN npm install
# This echo forces regenerating the files each time
RUN DEPLOY=$DEPLOY PROD=$PROD npm run start


FROM nginx:latest
# NOTE: ./proxy/src/* is copied into app/*
COPY --from=builder /app/out/nginx.conf /etc/nginx
COPY --from=builder /app/out/_services /etc/nginx/conf.d/_services
COPY ./proxy/ssl /etc/nginx/ssl
