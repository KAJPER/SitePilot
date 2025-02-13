#!/bin/bash

# Sprawdzenie uprawnień roota
if [ "$EUID" -ne 0 ]; then 
    echo "Proszę uruchomić jako root"
    exit
fi

# Instalacja zależności systemowych
apt-get update
apt-get install -y python3 python3-pip nodejs npm postgresql nginx

# Konfiguracja PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE universal_admin;"
sudo -u postgres psql -c "CREATE USER admin_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE universal_admin TO admin_user;"

# Instalacja zależności Pythona
cd backend
pip3 install -r requirements.txt

# Instalacja zależności Node.js
cd ../frontend
npm install

# Budowanie frontendu
npm run build

# Konfiguracja Nginx
cat > /etc/nginx/sites-available/universal-admin << EOF
server {
    listen 80;
    server_name admin.example.com;

    location / {
        root /var/www/universal-admin/frontend/build;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /media {
        alias /var/www/universal-admin/backend/media;
    }
}
EOF

ln -s /etc/nginx/sites-available/universal-admin /etc/nginx/sites-enabled/

# Tworzenie service systemd
cat > /etc/systemd/system/universal-admin.service << EOF
[Unit]
Description=Universal Admin Panel
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/universal-admin/backend
ExecStart=/usr/bin/python3 manage.py runserver 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Uruchomienie usługi
systemctl enable universal-admin
systemctl start universal-admin
systemctl restart nginx 