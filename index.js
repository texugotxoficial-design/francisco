import express from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(join(process.cwd(), 'dist')));

app.get('/api/health', (req, res) => {
  const files = fs.readdirSync(process.cwd());
  let distFiles = [];
  try {
    distFiles = fs.readdirSync(join(process.cwd(), 'dist'));
  } catch (e) {
    distFiles = ['error: ' + e.message];
  }
  res.json({ 
    status: 'ok', 
    server: 'Node.js', 
    update: 'v6', 
    version: '0.1.0',
    cwd: process.cwd(),
    files,
    dist: distFiles,
    time: new Date().toISOString() 
  });
});


app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js server listening on port ${PORT}`);
});
