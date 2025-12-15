user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    server_names_hash_bucket_size 64;
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    keepalive_timeout  65;
    #gzip  on;
    resolver 127.0.0.11; # Resolve to docker
    include /etc/nginx/conf.d/_services/*.server.conf;
    client_max_body_size 10M;
    
    server {
        listen       80;
        server_name  _; #default server if have more servers and they don't handle the request
        include /etc/nginx/conf.d/_services/*.paths.conf;
    }

    {{#if deploy}}

    # HTTPS Server block
    server {
        listen 443 ssl;
        server_name your.domain.com;
    
        ssl_certificate /etc/nginx/ssl/your.domain.com.crt;
        ssl_certificate_key /etc/nginx/ssl/your.domain.com.key;
        ssl_password_file /etc/nginx/ssl/passphrase;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
   
        include /etc/nginx/conf.d/_services/*.paths.conf;
    }

    server {
        listen 80;
        server_name mydomain.com;
        # Redirect all HTTP requests to HTTPS
        return 301 https://$host$request_uri;
    }
    
    {{/if}}
}