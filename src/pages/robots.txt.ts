import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = siteConfig.isIndexedRelease
    ? 'User-agent: *\nAllow: /\n'
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
