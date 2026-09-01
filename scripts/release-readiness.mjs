import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const evidenceHtml = readFileSync('dist/evidencia/index.html', 'utf8');
const robots = readFileSync('dist/robots.txt', 'utf8');
const publicRelease = process.env.PUBLIC_SITE_PUBLIC === 'true';
const cloudflarePreview = process.env.CF_PAGES === '1' && !publicRelease;
const siteUrl = process.env.PUBLIC_SITE_URL?.trim() || '';
const contactUrl = process.env.PUBLIC_CONTACT_URL?.trim() || '';
const contactLabel = process.env.PUBLIC_CONTACT_LABEL?.trim() || 'Hablemos de tu operación';

const failures = [];
const checks = [];

function check(name, condition, detail = '') {
  checks.push({ name, ok: Boolean(condition), detail });
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

check('OG title presente', html.includes('property="og:title"'));
check('OG description presente', html.includes('property="og:description"'));
check('OG locale es_AR', html.includes('property="og:locale" content="es_AR"'));
check('Sin analytics', !/(googletagmanager|google-analytics|gtag\(|segment\.com|plausible\.io|clarity\.ms)/i.test(html));
check('Sin formulario', !/<form\b/i.test(html));
check('Sin scripts externos', !/<script\b[^>]*src="https?:\/\//i.test(html));
check('Sin imágenes externas', !/<img\b[^>]*src="https?:\/\//i.test(html));
check('Página de evidencia presente', evidenceHtml.includes('EVIDENCIA TÉCNICA INSPECCIONABLE'));
check('Evidencia sin analytics', !/(googletagmanager|google-analytics|gtag\(|segment\.com|plausible\.io|clarity\.ms)/i.test(evidenceHtml));
check('Evidencia sin formulario', !/<form\b/i.test(evidenceHtml));
check('Evidencia sin scripts externos', !/<script\b[^>]*src="https?:\/\//i.test(evidenceHtml));
check('Evidencia sin imágenes externas', !/<img\b[^>]*src="https?:\/\//i.test(evidenceHtml));

if (publicRelease) {
  const canonical = new URL('/', siteUrl).toString();
  const evidenceCanonical = new URL('/evidencia/', siteUrl).toString();

  check('Release pública indexable', html.includes('name="robots" content="index, follow"'));
  check('Evidencia pública indexable', evidenceHtml.includes('name="robots" content="index, follow"'));
  check('robots.txt habilita crawling', robots.includes('Allow: /') && !robots.includes('Disallow: /'));
  check('Canonical pública presente', html.includes(`rel="canonical" href="${canonical}"`), canonical);
  check('OG URL pública presente', html.includes(`property="og:url" content="${canonical}"`), canonical);
  check('Canonical de evidencia presente', evidenceHtml.includes(`rel="canonical" href="${evidenceCanonical}"`), evidenceCanonical);
  check('OG URL de evidencia presente', evidenceHtml.includes(`property="og:url" content="${evidenceCanonical}"`), evidenceCanonical);
  check('Canal de contacto presente', html.includes(contactUrl), contactUrl);
  check('Label de contacto presente', html.includes(contactLabel), contactLabel);
  check('Sin estado privado visible', !html.includes('PUBLICACIÓN PENDIENTE'));
  check('Sin copy de contacto pendiente', !html.includes('se habilitará únicamente al aprobar la publicación'));
} else {
  check('Validación privada no indexable', html.includes('name="robots" content="noindex, nofollow"'));
  check('Evidencia privada no indexable', evidenceHtml.includes('name="robots" content="noindex, nofollow"'));
  check('robots.txt bloquea crawling', robots.includes('Disallow: /'));
  check('Sin canonical antes de URL aprobada', !html.includes('rel="canonical"'));
  check('Sin OG URL antes de URL aprobada', !html.includes('property="og:url"'));
  check('Evidencia sin canonical antes de URL aprobada', !evidenceHtml.includes('rel="canonical"'));
  check('Evidencia sin OG URL antes de URL aprobada', !evidenceHtml.includes('property="og:url"'));

  if (cloudflarePreview) {
    check('Sin estado privado visible en preview', !html.includes('PUBLICACIÓN PENDIENTE'));
    check('Sin copy interno del gate en preview', !html.includes('se habilitará únicamente al aprobar la publicación'));
  } else {
    check('Estado privado visible', html.includes('PUBLICACIÓN PENDIENTE'));
    check('Contacto bloqueado hasta gate', html.includes('se habilitará únicamente al aprobar la publicación'));
  }
}

const mode = publicRelease ? 'public release simulation' : cloudflarePreview ? 'Cloudflare preview' : 'private readiness';
console.log(`\nFALDEO WEB-06 — ${mode}\n`);
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
}

if (failures.length) {
  console.error(`\n${failures.length} release readiness guardrail(s) failed:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
