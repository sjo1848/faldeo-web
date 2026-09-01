import { readFileSync } from 'node:fs';

const configs = [
  {
    name: 'mobile',
    paths: [
      'qa/lighthouse-mobile-1.json',
      'qa/lighthouse-mobile-2.json',
      'qa/lighthouse-mobile-3.json'
    ],
    thresholds: { performance: 0.9, accessibility: 1, 'best-practices': 1 }
  },
  {
    name: 'desktop',
    paths: ['qa/lighthouse-desktop.json'],
    thresholds: { performance: 0.95, accessibility: 1, 'best-practices': 1 }
  }
];

let failed = false;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

for (const config of configs) {
  const reports = config.paths.map((path) => JSON.parse(readFileSync(path, 'utf8')));
  console.log(`\nFALDEO WEB-05 — Lighthouse ${config.name}`);

  for (const [category, threshold] of Object.entries(config.thresholds)) {
    const scores = reports.map((report) => report.categories?.[category]?.score);
    const label = reports[0]?.categories?.[category]?.title ?? category;

    if (scores.some((score) => typeof score !== 'number')) {
      console.error(`FAIL  ${label}: score missing in one or more runs`);
      failed = true;
      continue;
    }

    const aggregate = median(scores);
    const ok = aggregate >= threshold;
    const runs = scores.map((score) => (score * 100).toFixed(0)).join(' / ');
    const mode = scores.length > 1 ? 'median' : 'score';
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${(aggregate * 100).toFixed(0)} ${mode} / ${(threshold * 100).toFixed(0)} required (runs: ${runs})`);
    if (!ok) failed = true;
  }

  const tbtValues = reports
    .map((report) => report.audits?.metrics?.details?.items?.[0]?.totalBlockingTime)
    .filter((value) => typeof value === 'number');
  const fcpValues = reports
    .map((report) => report.audits?.metrics?.details?.items?.[0]?.firstContentfulPaint)
    .filter((value) => typeof value === 'number');
  const lcpValues = reports
    .map((report) => report.audits?.metrics?.details?.items?.[0]?.largestContentfulPaint)
    .filter((value) => typeof value === 'number');
  const clsValues = reports
    .map((report) => report.audits?.metrics?.details?.items?.[0]?.cumulativeLayoutShift)
    .filter((value) => typeof value === 'number');

  if (fcpValues.length) console.log(`INFO  FCP runs: ${fcpValues.map((value) => `${Math.round(value)} ms`).join(' / ')}`);
  if (lcpValues.length) console.log(`INFO  LCP runs: ${lcpValues.map((value) => `${Math.round(value)} ms`).join(' / ')}`);
  if (tbtValues.length) console.log(`INFO  TBT runs: ${tbtValues.map((value) => `${Math.round(value)} ms`).join(' / ')}`);
  if (clsValues.length) console.log(`INFO  CLS runs: ${clsValues.map((value) => value.toFixed(3)).join(' / ')}`);
}

if (failed) process.exit(1);
