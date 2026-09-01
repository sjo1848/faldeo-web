import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const htmlPath = 'dist/index.html';
const html = readFileSync(htmlPath, 'utf8');
const pageSource = readFileSync('src/pages/index.astro', 'utf8');
const css = [
  'src/styles/global.css',
  'src/styles/qa-fixes.css',
  'src/styles/learn.css'
].map((path) => readFileSync(path, 'utf8')).join('\n');

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
check('Gobierno de agentes visible', html.includes('REGLAS') && html.includes('APROBACIÓN HUMANA') && html.includes('AUDITORÍA'));
check('Oferta inicial visible', html.includes('PRIMERA INTERVENCIÓN') && html.includes('PRIMER ENTREGABLE') && html.includes('Piloto pequeño y medible'));
check('Evidencia calibrada por entorno', html.includes('ENTORNO DE PRUEBA · FLUJO IMPLEMENTADO') && html.includes('INTERNO · CAPACIDAD TÉCNICA'));
check('Hipótesis sectoriales explícitas', html.includes('HIPÓTESIS DE APLICACIÓN'));
check(
  'Jerga pública crítica reducida',
  !/(\bworkflow\b|\bstaging\b|Service Binding|multi-tenant|Routing por tenant|\bPOLICY\b|\bHITL\b|\bAUDIT\b)/i.test(html)
);
check('Sin formulario prematuro', !/<form\b/i.test(html));

const scriptTags = [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map((match) => match[0]);
check('JS cliente acotado', scriptTags.length <= 1, `scripts inline: ${scriptTags.length}`);
check('Sin scripts cliente externos', !/<script\b[^>]*\bsrc=/i.test(html));
check(
  'Menú mobile cierra al navegar',
  pageSource.includes('data-mobile-nav') && pageSource.includes("menu.removeAttribute('open')")
);
check(
  'CTA mobile condicionado a contacto real',
  pageSource.includes('mobile-contact-cta') && pageSource.includes('siteConfig.contactUrl')
);
check(
  'CTA desktop tiene fallback útil sin contacto',
  pageSource.includes('Cómo empezamos') && pageSource.includes('href="#inicio-trabajo"')
);
check(
  'Inicio de trabajo compensa header sticky',
  /\.engagement-bridge\s*\{[\s\S]*?scroll-margin-top:\s*96px/.test(css)
);
check(
  'Contacto real no se simula en preview',
  pageSource.includes('!siteConfig.isCloudflarePreview') && pageSource.includes('siteConfig.contactUrl ?')
);
check(
  'Signal strip comprimido en mobile',
  /@media\s*\(max-width:\s*760px\)[\s\S]*?\.signal-strip\s*\{[\s\S]*?display:\s*none/.test(css)
);

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

console.log('\nFALDEO WEB-05/08 — static QA');
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