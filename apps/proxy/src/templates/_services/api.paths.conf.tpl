
# Fallback for other /api routes
location /api {
    proxy_pass http://api:3000;
}