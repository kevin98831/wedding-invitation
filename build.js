
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html
  .replace('__SUPABASE_URL__', process.env.VITE_SUPABASE_URL || '')
  .replace('__SUPABASE_ANON_KEY__', process.env.VITE_SUPABASE_ANON_KEY || '');

fs.writeFileSync(path.join(dist, 'index.html'), html);
copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));
