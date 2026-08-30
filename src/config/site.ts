const isPublicRelease = import.meta.env.PUBLIC_SITE_PUBLIC === 'true';

const rawSiteUrl = import.meta.env.PUBLIC_SITE_URL?.trim() || '';
const rawContactUrl = import.meta.env.PUBLIC_CONTACT_URL?.trim() || '';
const contactLabel = import.meta.env.PUBLIC_CONTACT_LABEL?.trim() || 'Abrir canal de contacto';

function normalizeSiteUrl(value: string): string | undefined {
  if (!value) return undefined;

  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('PUBLIC_SITE_URL must use http or https.');
  }

  return url.toString();
}

function normalizeContactUrl(value: string): string | undefined {
  if (!value) return undefined;

  if (value.startsWith('mailto:')) return value;

  const url = new URL(value);
  if (url.protocol !== 'https:') {
    throw new Error('PUBLIC_CONTACT_URL must use mailto: or https:.');
  }

  return url.toString();
}

const siteUrl = normalizeSiteUrl(rawSiteUrl);
const contactUrl = normalizeContactUrl(rawContactUrl);

if (isPublicRelease && !siteUrl) {
  throw new Error('Public release blocked: PUBLIC_SITE_URL is required.');
}

if (isPublicRelease && !contactUrl) {
  throw new Error('Public release blocked: PUBLIC_CONTACT_URL is required.');
}

export const siteConfig = Object.freeze({
  isPublicRelease,
  siteUrl,
  contactUrl,
  contactLabel,
  robots: isPublicRelease ? 'index, follow' : 'noindex, nofollow'
});
