// Tiny static file server for the Off Menu homepage.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/kiraknoop/Desktop/Claude/Off Menu';
const PORT = parseInt(process.env.PORT || '5176', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.otf':  'font/otf',
  '.ttf':  'font/ttf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found: ' + urlPath);
      return;
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache', 'Expires': '0',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => console.log('serving ' + ROOT + ' on http://localhost:' + PORT));
