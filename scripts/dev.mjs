import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { bundle } from 'lightningcss';

const src = new URL('../src/', import.meta.url);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  try {
    if (path === '/css/main.css') {
      const { code } = bundle({ filename: new URL('css/main.css', src).pathname });
      res.writeHead(200, { 'Content-Type': 'text/css' }).end(code);
      return;
    }
    const file = path === '/' ? 'index.html' : path.slice(1);
    const body = await readFile(new URL(file.replace(/\.\./g, ''), src));
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(3000, () => console.log('Dev-Server: http://localhost:3000'));
