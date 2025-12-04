const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '';
    let contentType = 'text/html; charset=utf-8';
    
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'index.html');
        contentType = 'text/html; charset=utf-8';
    } else if (req.url === '/style.css') {
        filePath = path.join(__dirname, 'style.css');
        contentType = 'text/css';
    } else if (req.url === '/script.js') {
        filePath = path.join(__dirname, 'script.js');
        contentType = 'application/javascript';
    } else if (req.url.startsWith('/modules/')) {
        filePath = path.join(__dirname, req.url);
        contentType = 'application/javascript';
    } else {
        res.writeHead(404);
        res.end('Not found');
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading file');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`🌸 Server đang chạy tại http://localhost:${PORT} 💗`);
});
