import fs from 'node:fs';
import path from 'node:path';

const prefix = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (prefix && !/^\/[a-zA-Z0-9_.-]+$/.test(prefix)) throw Error('Invalid Pages base path');
const output = '_site';
fs.rmSync(output, {recursive: true, force: true});
fs.cpSync('site', output, {recursive: true});
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
for (const file of walk(output)) {
  if (!/\.(html|js|css|json)$/.test(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  if (prefix) {
    text = text.replace(/(["'`])\/(?=(?:assets|data|borders|fonts|ru|en)\/|favicon\.svg)/g, `$1${prefix}/`);
    text = text.replace(/url\(\/(?=(?:assets|fonts)\/)/g, `url(${prefix}/`);
    // Vite's modulepreload URLs must use the same project subdirectory.
    text = text.replace('Vi=function(e){return`/`+e}', `Vi=function(e){return\`${prefix}/\`+e}`);
  }
  if (file.endsWith('.html')) {
    const lang = path.relative(output, file).split(path.sep)[0] === 'en' ? 'en' : 'ru';
    text = text.replace("if(!p.has('lang') && location.pathname==='/')p.set('lang','ru');", `if(!p.has('lang'))p.set('lang','${lang}');`);
  }
  fs.writeFileSync(file, text);
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log(`Built GitHub Pages site at ${prefix || '/'}`);
