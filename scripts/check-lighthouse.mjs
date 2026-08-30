import { readFileSync } from 'node:fs';

const configs = [
  {
    name: 'mobile',
    path: 'qa/lighthouse-mobile.json',
    thresholds: { performance: 0.9, accessibility: 1, 'best-practices': 1 }
  },
  {
    name: 'desktop',
    path: 'qa/lighthouse-desktop.json',
    thresholds: { performance: 0.95, accessibility: 1, 'best-practices': 1 }
  }
];

let failed = false;

for (const config of configs) {
  const report = JSON.parse(readFileSync(config.path, 'utf8'));
  console.log(`\nFALDEO WEB-05 — Lighthouse ${config.name}`);

  for (const [category, threshold] of Object.entries(config.thresholds)) {
    const score = report.categories?.[category]?.score;
    const label = report.categories?.[category]?.title ?? category;
    if (typeof score !== 'number') {
      console.error(`FAIL  ${label}: score missing`);
      failed = true;
      continue;
    }

    const ok = score >= threshold;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${(score * 100).toFixed(0)} / ${(threshold * 100).toFixed(0)} required`);
    if (!ok) failed = true;
  }

  const metrics = report.audits?.metrics?.details?.items?.[0] ?? {};
  if (metrics.firstContentfulPaint != null) console.log(`INFO  FCP: ${Math.round(metrics.firstContentfulPaint)} ms`);
  if (metrics.largestContentfulPaint != null) console.log(`INFO  LCP: ${Math.round(metrics.largestContentfulPaint)} ms`);
  if (metrics.totalBlockingTime != null) console.log(`INFO  TBT: ${Math.round(metrics.totalBlockingTime)} ms`);
  if (metrics.cumulativeLayoutShift != null) console.log(`INFO  CLS: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
}

if (failed) process.exit(1);
