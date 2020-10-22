location ~* \.(?:css|js|php)$ {
  try_files $uri =404;
  expires 1y;
  access_log off;
  add_header Cache-Control "public";
}

# Any route containing a file extension (e.g. /devicesfile.js)
location ~ ^.+\..+$ {
  try_files $uri =404;
}

location / {
  try_files $uri $uri/ /index.html;
}
