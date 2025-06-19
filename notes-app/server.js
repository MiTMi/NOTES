import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 8080;
const distDir = join(__dirname, 'dist');

const server = createServer((req, res) => {
  let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);
  
  // For SPA routing, serve index.html for any request that doesn't match a file
  try {
    const content = readFileSync(filePath);
    const ext = filePath.split('.').pop();
    
    let contentType = 'text/html';
    if (ext === 'js') contentType = 'application/javascript';
    else if (ext === 'css') contentType = 'text/css';
    else if (ext === 'json') contentType = 'application/json';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    // Serve index.html for SPA routing
    try {
      const indexContent = readFileSync(join(distDir, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexContent);
    } catch (indexErr) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});