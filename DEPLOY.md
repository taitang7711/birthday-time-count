# Deploy Instructions for Birthday Counter

## Prerequisites
- Node.js installed
- PM2 installed globally: `npm install -g pm2`
- Nginx configured as reverse proxy

## Deployment Steps

### 1. Upload code to server
```bash
# Via Git
git clone https://github.com/taitang7711/birthday-time-count.git
cd birthday-time-count

# Or via FTP/SCP
scp -r ./* user@server:/path/to/birthday-time-count/
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start server with PM2
```bash
npm run pm2:start
```

### 4. Configure Nginx

Create/edit nginx config: `/etc/nginx/sites-available/demngaysinh.chengtang.io.vn`

```nginx
server {
    listen 80;
    server_name demngaysinh.chengtang.io.vn;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site and restart nginx:
```bash
sudo ln -s /etc/nginx/sites-available/demngaysinh.chengtang.io.vn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL (Optional but recommended)
```bash
sudo certbot --nginx -d demngaysinh.chengtang.io.vn
```

## Useful Commands

### PM2 Management
```bash
npm run pm2:start      # Start server
npm run pm2:stop       # Stop server
npm run pm2:restart    # Restart server
npm run pm2:logs       # View logs
pm2 list               # List all processes
pm2 save               # Save PM2 process list
pm2 startup            # Setup PM2 auto-start on boot
```

### Server Status
```bash
curl http://localhost:3002
curl https://demngaysinh.chengtang.io.vn
```

## Troubleshooting

### Port already in use
```bash
# Find process using port 3002
lsof -i :3002
# Or on Windows
netstat -ano | findstr :3002

# Kill the process
kill -9 <PID>
```

### Check logs
```bash
pm2 logs birthday-counter
pm2 logs birthday-counter --err  # Error logs only
```

### Database issues
```bash
# Ensure daily.db has proper permissions
chmod 644 daily.db

# Run migration if needed
node migrate-db.js
```

## File Structure on Server
```
/var/www/birthday-time-count/
├── server.js
├── package.json
├── ecosystem.config.js
├── daily.db
├── modules/
│   ├── daily/
│   └── birthday/
├── style.css
└── index.html
```

## Environment Variables
Set in `ecosystem.config.js` or `.env`:
- `PORT=3002`
- `HOST=0.0.0.0`
- `NODE_ENV=production`
