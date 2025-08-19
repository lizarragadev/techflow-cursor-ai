# TechFlow Case – Start

Proyecto mínimo en TypeScript para demostrar el flujo con **Cursor**:
tests → smells/refactor → performance → docs/commit → PR.

## Requisitos
- Node 18+
- `npm i`

## Scripts
- `npm run dev` – inicia el servidor Express en `http://localhost:3000`.
- `npm run test` / `npm run test:cov` – ejecuta tests y cobertura.
- `npm run perf:orders` – mide P95 del endpoint `/orders/detailed` con 50 solicitudes.

## Flujo sugerido para la demo
1. Generar tests para `orders/service.ts` (objetivo ≥ 80% del módulo).
2. Listar smells y aplicar refactor seguro (mantener firmas/tests).
3. Eliminar N+1 en `orders/repository.ts` y medir P95 antes/después.
4. Generar README del módulo `orders` y commit con convención.
5. PR con IA.
