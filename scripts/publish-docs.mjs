import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const docs = join(root, 'docs');

execSync('npm run build', { stdio: 'inherit' });

if (existsSync(docs)) rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });
cpSync(dist, docs, { recursive: true });

const cname = 'mar11.eugeneyip.net';
writeFileSync(join(docs, 'CNAME'), cname);

const buildId = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 8) : Date.now().toString();
const indexPath = join(docs, 'index.html');
let html = readFileSync(indexPath, 'utf8');
html = html.replace(/(index-[A-Za-z0-9_-]+\.js)("|\?[^"']*")/g, (_, f, q) => `${f}?v=${buildId}${q === '"' ? '"' : ''}`);
html = html.replace(/(index-[A-Za-z0-9_-]+\.css)("|\?[^"']*")/g, (_, f, q) => `${f}?v=${buildId}${q === '"' ? '"' : ''}`);
if (!html.includes('cdn.tailwindcss.com')) {
  html = html.replace('</title>', '</title>\n    <script src="https://cdn.tailwindcss.com"></script>');
}
writeFileSync(indexPath, html);

writeFileSync(join(docs, '404.html'), html);

console.log(`Published docs with build id: ${buildId}`);
