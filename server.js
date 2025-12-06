const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dailyDB = require('./modules/daily/dailyDB');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // API endpoints cho daily
    if (pathname === '/api/daily/start-date' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { startDate } = JSON.parse(body);
                const result = dailyDB.saveStartDate(startDate);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    if (pathname === '/api/daily/start-date' && req.method === 'GET') {
        const result = dailyDB.getLatestStartDate();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
        return;
    }
    
    if (pathname === '/api/daily/mood' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { moodDate, moodValue, moodName, note } = JSON.parse(body);
                const result = dailyDB.saveMood(moodDate, moodValue, moodName, note || '');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    if (pathname === '/api/daily/moods' && req.method === 'GET') {
        const year = parsedUrl.query.year;
        const month = parsedUrl.query.month;
        const result = dailyDB.getMoodsByMonth(year, month);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
        return;
    }
    
    if (pathname === '/api/daily/mood-by-date' && req.method === 'GET') {
        const moodDate = parsedUrl.query.date;
        const result = dailyDB.getMoodByDate(moodDate);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
        return;
    }
    
    // DELETE mood
    if (pathname === '/api/daily/mood' && req.method === 'DELETE') {
        const moodDate = parsedUrl.query.date;
        const result = dailyDB.deleteMood(moodDate);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
        return;
    }
    
    // Static file serving
    let filePath = '';
    let contentType = 'text/html; charset=utf-8';
    
    if (pathname === '/' || pathname === '/index.html') {
        filePath = path.join(__dirname, 'index.html');
        contentType = 'text/html; charset=utf-8';
    } else if (pathname === '/modules/daily/daily.html') {
        filePath = path.join(__dirname, 'modules', 'daily', 'daily.html');
        contentType = 'text/html; charset=utf-8';
    } else if (pathname === '/modules/birthday/birthday.html') {
        filePath = path.join(__dirname, 'modules', 'birthday', 'birthday.html');
        contentType = 'text/html; charset=utf-8';
    } else if (pathname === '/modules/reindeer/reindeer.html') {
        filePath = path.join(__dirname, 'modules', 'reindeer', 'reindeer.html');
        contentType = 'text/html; charset=utf-8';
    } else if (pathname === '/modules/countdown/countdown.html') {
        filePath = path.join(__dirname, 'modules', 'countdown', 'countdown.html');
        contentType = 'text/html; charset=utf-8';
    } else if (pathname === '/style.css') {
        filePath = path.join(__dirname, 'style.css');
        contentType = 'text/css';
    } else if (pathname === '/script.js') {
        filePath = path.join(__dirname, 'script.js');
        contentType = 'application/javascript';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.js')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'application/javascript';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.css')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'text/css';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.png')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'image/png';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.jpg')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'image/jpeg';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.jpeg')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'image/jpeg';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.gif')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'image/gif';
    } else if (pathname.startsWith('/modules/') && pathname.endsWith('.svg')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'image/svg+xml';
    } else if (pathname.startsWith('/components/') && pathname.endsWith('.html')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'text/html; charset=utf-8';
    } else if (pathname.startsWith('/components/') && pathname.endsWith('.js')) {
        filePath = path.join(__dirname, pathname);
        contentType = 'application/javascript';
    } else {
        res.writeHead(404);
        res.end('Not Found: ' + pathname);
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error loading file:', filePath, err);
            res.writeHead(404);
            res.end('File not found: ' + pathname);
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`🌸 Server đang chạy tại http://${HOST}:${PORT} 💗`);
    console.log(`📱 Truy cập từ bên ngoài: http://demngaysinh.chengtang.io.vn`);
});
