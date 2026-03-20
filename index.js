import express from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(join(process.cwd(), 'build')));

app.get('/api/health', (req, res) => {
  const files = fs.readdirSync(process.cwd());
  let distFiles = [];
  let buildFiles = []; // Changed from distFiles to buildFiles
  try {
    buildFiles = fs.readdirSync(join(process.cwd(), 'build'));
  } catch (e) {
    buildFiles = ['error: ' + e.message];
  }
  res.json({
    status: 'ok',
    server: 'Node.js',
    update: 'v7',
    target: 'build_folder',
    cwd: process.cwd(),
    files,
    build: buildFiles, // Changed from dist: distFiles to build: buildFiles
    time: new Date().toISOString()
  });
});


app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js server listening on port ${PORT}`);
});
