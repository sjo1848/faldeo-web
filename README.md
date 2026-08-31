# FALDEO Web

Sitio corporativo de FALDEO — soluciones tecnológicas para operaciones reales.

## Estado

`WEB-06 — Publication Readiness / VALIDATE`

El repositorio permanece privado durante VALIDATE. La publicación pública requiere el gate `HG-WEB-002`.

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

## Build privado por defecto

```bash
npm run build
node scripts/qa-static.mjs
node scripts/release-readiness.mjs
```

Sin configuración adicional, el build queda deliberadamente:

- `noindex,nofollow`;
- `robots.txt` bloqueando crawling;
- sin canonical pública;
- sin canal de contacto externo;
- sin analytics;
- con estado de candidata privada visible.

## Build público — sólo después de HG-WEB-002

La liberación pública es fail-closed. Requiere explícitamente:

```text
PUBLIC_SITE_PUBLIC=true
PUBLIC_SITE_URL=<URL pública aprobada>
PUBLIC_CONTACT_URL=<canal real aprobado; mailto: o https:>
PUBLIC_CONTACT_LABEL=<texto visible del CTA>
```

Si `PUBLIC_SITE_PUBLIC=true` y falta URL o contacto, el build falla.

Cuando la configuración pública es válida:

- robots cambia a `index, follow`;
- `robots.txt` permite crawling;
- canonical y Open Graph URL usan la URL aprobada;
- se habilita el CTA real de contacto;
- desaparece el estado de publicación pendiente.

No hay analytics, cookies de seguimiento, formulario, backend ni scripts de terceros en v0.1.

## Simulación de publicación

El workflow `web-release-readiness` prueba dos modos sin desplegar nada:

1. build privado real;
2. simulación de build público con valores reservados `.invalid` usados sólo como fixtures de CI.

Esto verifica que la candidata puede pasar de modo privado a público únicamente mediante configuración explícita, sin introducir datos ficticios en producción.

## Principio de producto

La web debe expresar el criterio de FALDEO antes que un catálogo de tecnologías:

`TERRENO → FRICCIÓN → CRITERIO → RECORRIDO → CAPACIDAD`

## Evidencia técnica interna

La matriz de capacidades y claims de **Agentic AI Engineering** se mantiene en:

`docs/agentic-ai-engineering-evidence.md`

La regla es explícita: formación, implementación, aceptación de producto y validación de mercado son niveles de evidencia distintos. La documentación pública sólo puede promover claims respaldados por el nivel correspondiente.

## Límites

`WEB-06` prepara la release candidate. No compra dominio, no habilita deploy, no hace público el repositorio y no publica la web. Esas acciones permanecen bloqueadas hasta `HG-WEB-002`.
