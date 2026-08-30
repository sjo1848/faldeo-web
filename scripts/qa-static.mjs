import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const htmlPath = 'dist/index.html';
const cssPath = 'src/styles/global.css';
const html = readFileSync(htmlPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');

const failures = [];
const checks = [];

function check(name, condition, detail = '') {
  checks.push({ name, ok: Boolean(condition), detail });
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

function count(pattern, text) {
  return [...text.matchAll(pattern)].length;
}

function dirSize(path) {
  let total = 0;
  for (const entry of readdirSync(path)) {
    const full = join(path, entry);
    const stat = statSync(full);
    total += stat.isDirectory() ? dirSize(full) : stat.size;
  }
  return total;
}

check('Idioma es-AR', html.includes('<html lang="es-AR">'));
check('Un único H1', count(/<h1\b/g, html) === 1, `encontrados: ${count(/<h1\b/g, html)}`);
check('Skip link presente', html.includes('Saltar al contenido'));
check('Main target presente', html.includes('id="contenido"'));
check('Meta description presente', /<meta name="description" content="[^"]+"/.test(html));
check('Noindex durante validación privada', html.includes('name="robots" content="noindex, nofollow"'));
check('Headline locked', html.includes('Leemos tu operación.') && html.includes('Elegimos lo que realmente resuelve.'));
check('Criterio IA locked', html.includes('No todo problema necesita IA.'));
check('Gobierno de agentes visible', html.includes('POLICY') && html.includes('HITL') && html.includes('AUDIT'));
check('Sin formulario prematuro', !/<form\b/i.test(html));
check('Sin scripts cliente', !/<script\b/i.test(html));
check('Sin contacto ficticio', !/(mailto:|tel:|linkedin\.com|instagram\.com|facebook\.com)/i.test(html));
check('Sin analytics', !/(googletagmanager|google-analytics|gtag\(|segment\.com|plausible\.io|clarity\.ms)/i.test(html));
check('Sin recursos HTTP externos', !/(src|href)="https?:\/\//i.test(html));
check('Sin gradients', !/gradient\s*\(/i.test(css));
check('Sin box shadows', !/box-shadow\s*:/i.test(css));
check('Reduced motion contemplado', css.includes('@media (prefers-reduced-motion: reduce)'));
check('Foco visible contemplado', css.includes(':focus-visible'));

const anchorTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingAnchors = [...new Set(anchorTargets)].filter((target) => !html.includes(`id="${target}"`));
check('Anchors internos resueltos', missingAnchors.length === 0, missingAnchors.join(', '));

const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
const imgsWithoutAlt = imgs.filter((img) => !/\balt="[^"]*"/.test(img));
check('Todas las imágenes tienen alt', imgsWithoutAlt.length === 0, `sin alt: ${imgsWithoutAlt.length}`);

const htmlBytes = statSync(htmlPath).size;
const distBytes = dirSize('dist');
check('Budget HTML < 80 KiB', htmlBytes < 80 * 1024, `${(htmlBytes / 1024).toFixed(1)} KiB`);
check('Budget dist < 300 KiB', distBytes < 300 * 1024, `${(distBytes / 1024).toFixed(1)} KiB`);

console.log('\nFALDEO WEB-05 — static QA');
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
}
console.log(`\nHTML: ${(htmlBytes / 1024).toFixed(1)} KiB`);
console.log(`Dist total: ${(distBytes / 1024).toFixed(1)} KiB`);

if (failures.length) {
  console.error(`\n${failures.length} QA guardrail(s) failed:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
