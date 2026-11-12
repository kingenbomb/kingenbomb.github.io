// Download every script/stylesheet URL seen in a netcap requests.json
import fs from 'node:fs';
import path from 'node:path';

const [reqFile, outDir, filter = 'script'] = process.argv.slice(2);
const reqs = JSON.parse(fs.readFileSync(reqFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
for (const r of reqs) {
  if (r.type !== filter || r.status !== 200) continue;
  const u = new URL(r.url);
  const name = u.pathname.split('/').pop() || `idx${n}`;
  const dest = path.join(outDir, name);
  if (fs.existsSync(dest)) continue;
  try {
    const res = await fetch(r.url);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    n++;
    console.log(res.status, buf.length, name);
  } catch (e) {
    console.log('ERR', u.pathname, String(e).slice(0, 120));
  }
}
console.log('downloaded', n);
