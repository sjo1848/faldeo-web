# FALDEO Web

Sitio corporativo de FALDEO — soluciones tecnológicas para operaciones reales.

## Estado

`WEB-05 — QA & Hardening / VALIDATE`

El repositorio permanece privado durante BUILD y VALIDATE. La publicación pública requiere el gate `HG-WEB-002`.

## Stack

- Astro 5.18.2
- TypeScript estricto
- CSS propio
- HTML estático con JavaScript mínimo

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Principio de producto

La web debe expresar el criterio de FALDEO antes que un catálogo de tecnologías:

`TERRENO → FRICCIÓN → CRITERIO → RECORRIDO → CAPACIDAD`

## Publicación

La rama de QA valida la candidata en privado. `noindex,nofollow` se mantiene hasta Publication Readiness y el gate `HG-WEB-002`.
