# FALDEO — Agentic AI Engineering Evidence

Status: `INTERNAL EVIDENCE / ACTIVE`

Purpose: documentar de forma verificable qué capacidades de ingeniería agentic puede demostrar FALDEO y cómo deben presentarse en portfolio, CV, LinkedIn o conversaciones técnicas sin convertir formación en experiencia que no existe ni confundir prueba técnica con validación comercial.

## 1. Regla de evidencia

La evidencia se ordena en tres niveles:

1. **LEARN** — formación y fundamentos.
2. **BUILD** — implementación real en código y arquitectura.
3. **PROVE** — aceptación, QA, staging, auditoría y evidencia reproducible.

Los cursos de OpenAI Academy pertenecen a **LEARN**. Refuerzan conocimiento y vocabulario técnico, pero no son por sí solos prueba de implementación. La prueba principal debe venir de repositorios, contratos, tests, staging y decisiones de arquitectura.

## 2. Claim principal permitido

> Diseño e implemento sistemas agentic gobernados que interpretan lenguaje, usan herramientas y operan sobre sistemas reales, manteniendo permisos, validación, estado confiable, auditoría y Human-in-the-Loop fuera del control libre del modelo.

Este claim es técnico. No implica producción masiva, autonomía total, adopción comercial ni ROI validado.

## 3. Evidencia técnica primaria

### AI Commerce Platform / Agent Core

Repository: `sjo1848/ai-commerce-platform`

Evidence target: Agent Core conectado a HMS en staging.

Capacidades demostradas:

- separación entre interpretación del LLM y autoridad server-side;
- Tool Registry explícito;
- policy fail-closed;
- tenant / hotel / actor context fuera del prompt;
- approvals y Human-in-the-Loop para acciones sensibles;
- auditoría de acciones;
- usage / cost tracking como concern transversal;
- idempotencia para side effects;
- Service Binding hacia el sistema de dominio;
- continuidad de sesión conversacional;
- respuestas naturales fundamentadas en hechos operativos;
- fallback determinístico cuando la salida del modelo no es válida o no está suficientemente grounded.

### HMS integration

La integración Agent Core → HMS funciona como prueba vertical de un agente que consulta un sistema operacional real en staging.

Evidencia ya registrada en Portfolio Readiness:

- disponibilidad real + cotización real en la misma sesión;
- routing por tenant fuera de la decisión libre del modelo;
- políticas y auditoría como controles transversales;
- integración mediante Service Binding;
- continuidad de sesión durable para workflows multi-turn.

### ACP 2.6 — LLM Model Router / HMS Agentic Experience

Goal actual: hacer que HMS se comporte como un agente útil y conversacional sin degradar los controles determinísticos validados previamente.

Invariantes:

- el LLM puede interpretar, planificar, aclarar y componer;
- el LLM no elige tenant, hotel, actor, permisos, approval metadata, operation tokens ni herramientas arbitrarias;
- Tool Registry, validación server-side, Policy Engine, HITL, idempotencia, audit, ownership y HMS permanecen autoritativos.

Estado técnico observado:

- R2.1 Acceptance Corpus: cerrado;
- R2.2 Natural Receptionist Dialogue Layer: `TECHNICAL_PASS`;
- 97/97 tests PASS;
- Independent Critic PASS, P0/P1/P2 = 0/0/0 después de rework;
- R2.3 Durable Semantic Memory v2: activo;
- multi-room todavía pendiente en R2.4/R2.5;
- Human Product Acceptance final todavía pendiente para R2.

R2.2 implementa un `GroundedFactEnvelope`: el servidor construye hechos operativos autoritativos, el modelo redacta sobre ese envelope y la respuesta se valida antes de hidratar placeholders. Borradores inválidos o no grounded fallan de forma segura hacia rendering determinístico.

## 4. Capability → Evidence Matrix

| Capability | Evidence | Estado | Fuerza del claim |
| --- | --- | --- | --- |
| Agent architecture | Agent Core + HMS integration | Implementado | Fuerte |
| Tool use / tool governance | Tool Registry + server validation | Implementado | Fuerte |
| Policy / permissions | Policy fail-closed | Implementado | Fuerte |
| Human-in-the-Loop | approvals + controlled side effects | Implementado / gobernado | Fuerte |
| Auditability | audit trail | Implementado | Fuerte |
| Idempotent side effects | operation controls | Implementado | Fuerte |
| Multi-turn conversation | durable session continuity | Implementado | Fuerte |
| Natural agent responses | R2.2 dialogue layer | Technical PASS | Fuerte |
| Grounded generation | GroundedFactEnvelope + fallback | Technical PASS | Fuerte |
| Semantic memory | R2.3 | En implementación | Parcial |
| Multi-room orchestration | R2.4/R2.5 | Pendiente | No reclamar todavía |
| Second vertical reuse | Alquileres | Bloqueado hasta HPA | No reclamar todavía |
| Commercial ROI / adoption | — | No validado | Prohibido reclamar |

## 5. OpenAI Academy

Clasificación: `SUPPORTING EVIDENCE / LEARN`.

Uso correcto:

- demostrar formación continua en fundamentos de IA y sistemas agentic;
- reforzar conocimiento de conceptos, terminología y prácticas;
- enlazar cada curso relevante con una capacidad que después tenga evidencia de BUILD/PROVE.

Uso incorrecto:

- presentar un curso como prueba suficiente de que se implementaron agentes;
- afirmar certificación si el curso no entrega una credencial verificable;
- sustituir repositorio, demo, tests o arquitectura por badges.

### Registro de formación

Mantener este bloque como inventario verificable. No inventar nombres de cursos, fechas ni credenciales.

| Formación | Fuente | Credential URL / evidencia | Capacidades relacionadas | Estado |
| --- | --- | --- | --- | --- |
| OpenAI Academy coursework | OpenAI Academy | Pendiente de archivar | fundamentos LLM, agentes, tool use, evals, safety | SUPPORTING |

Cuando existan certificados, badges o URLs reales, agregarlos aquí y en el perfil profesional.

## 6. Portfolio narrative

### Título recomendado

**Agentic AI Engineering**

### Descripción corta

Diseño de agentes conectados a sistemas reales con tool use, validación server-side, políticas, auditoría, idempotencia, contexto multi-turn y Human-in-the-Loop. La autonomía se amplía sólo cuando la evidencia y el nivel de riesgo lo permiten.

### Evidencia destacada

**Governed Agent Core for Hospitality Operations**

Problema: convertir una interfaz conversacional en una capa útil sobre operaciones hoteleras sin permitir que el modelo controle identidad, permisos o estado crítico.

Solución: Agent Core con tool registry, policies, service bindings, session continuity, grounded responses y controles server-side.

Prueba: integración real en staging con HMS, acceptance corpus, QA automatizada, adversarial review e Independent Critic.

Estado: implementación técnica activa; R2 continúa en semantic memory y multi-room antes de Human Product Acceptance final.

## 7. CV / LinkedIn — claims autorizados

### CV técnico

**Agentic AI / LLM Systems** — implementación de agentes con tool calling, server-side validation, policy enforcement, HITL, audit, idempotency, multi-turn context y grounded generation, integrados con sistemas operacionales reales en staging.

### Versión breve

**Agentic AI Engineering:** agentes gobernados, tool use, evals, HITL, auditoría y workflows multi-turn sobre sistemas reales.

### Formación

**OpenAI Academy — AI/agentic coursework** como formación complementaria. Incluir nombres exactos y credenciales sólo cuando estén archivados y verificables.

## 8. Claims no autorizados todavía

No usar sin evidencia adicional:

- “plataforma multiagente probada en múltiples industrias”;
- “agentes autónomos en producción”;
- “especialista certificado por OpenAI”;
- “reducción de costos X%”;
- “IA implementada para clientes mineros”;
- “Agent Core comercialmente validado”;
- “segunda vertical validada”.

## 9. Próximos gates para fortalecer la evidencia

1. cerrar R2.3 Semantic Memory v2;
2. cerrar R2.4/R2.5 multi-room model + orchestration;
3. ejecutar R2.6 model quality / latency / cost evaluation;
4. cerrar adversarial QA + Independent Critic;
5. ejecutar real-model staging E2E;
6. obtener Human Product Acceptance final;
7. archivar cursos de OpenAI Academy con nombre exacto, fecha y URL/credencial cuando exista;
8. recién entonces promover claims adicionales a portfolio público.

## 10. Regla FALDEO

`COURSE ≠ IMPLEMENTATION`

`IMPLEMENTATION ≠ PRODUCT ACCEPTANCE`

`PRODUCT ACCEPTANCE ≠ MARKET VALIDATION`

La narrativa profesional debe conservar esas fronteras. El activo más fuerte no es afirmar que sabemos usar IA, sino poder mostrar dónde está el modelo, qué puede decidir, qué no puede decidir, cómo se controla, cómo se evalúa y qué evidencia demuestra que el sistema funciona.