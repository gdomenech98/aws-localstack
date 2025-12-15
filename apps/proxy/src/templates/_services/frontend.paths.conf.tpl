location / {
    {{#if dev}}
    proxy_pass http://frontend:3000;
    {{else}}
    proxy_pass http://frontend:8151;
    {{/if}}
}
{{#if dev}}
#NextJS websocket for hotreload updating
location /_next/webpack-hmr {
    proxy_pass http://frontend:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
{{/if}}