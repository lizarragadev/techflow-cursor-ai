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

---

## 📦 Módulo `/src/orders`

### Propósito

El módulo `orders` proporciona funcionalidad completa para el manejo de órdenes de productos, incluyendo:

- **Servicios de negocio**: Lógica de cálculo de totales e impuestos
- **Repositorio de datos**: Acceso optimizado a datos de órdenes, productos y categorías
- **Optimización de rendimiento**: Eliminación del problema N+1 con múltiples estrategias
- **Validación robusta**: Manejo de errores y validaciones de entrada

### Dependencias

#### Internas
- `./data.ts` - Tipos y datos mock
- `./fake_db.ts` - Simulación de base de datos
- `./repository.ts` - Capa de acceso a datos
- `./service.ts` - Lógica de negocio

#### Externas
- `express` - Framework web (para endpoints)
- `typescript` - Tipado estático
- `jest` - Framework de testing

### Estructura del Módulo

```
src/orders/
├── data.ts          # Tipos y datos mock
├── fake_db.ts       # Simulación de DB con latencia
├── repository.ts    # Repositorio con optimizaciones N+1
├── service.ts       # Servicios de negocio
└── tests/           # Tests unitarios
```

### Ejemplo de Uso

#### 1. Cálculo de Total con Impuestos

```typescript
import { calculateFinal } from './src/orders/service.js';

// Cálculo básico con IVA por defecto (19%)
const result = calculateFinal(100);
console.log(result);
// Output: { net: 100, tax: 19, final: 119 }

// Cálculo con IVA y descuento personalizados
const result2 = calculateFinal(200, 0.21, 50);
console.log(result2);
// Output: { net: 200, tax: 42, final: 192 }
```

#### 2. Obtención de Órdenes Detalladas

```typescript
import { getOrdersDetailed } from './src/orders/service.js';

// Obtener 10 órdenes con información completa
const orders = await getOrdersDetailed(10);
console.log(orders);
// Output: Array de órdenes con productos y categorías
```

#### 3. Benchmark de Rendimiento

```typescript
import { benchmarkMethods } from './src/orders/repository.js';

// Comparar métodos N+1 vs optimizados
const results = await benchmarkMethods(50);
console.log(results.improvement);
// Output: { batchedVsN1: "96% faster", joinedVsN1: "97% faster" }
```

#### 4. Ejemplo Runnable Completo

```bash
# Ejecutar benchmark de rendimiento
npm run dev &
sleep 2
curl http://localhost:3000/orders/detailed?limit=10

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar benchmark N+1
npx ts-node --esm scripts/benchmark_n1.ts
```

### API Pública

#### `calculateFinal(total, taxRate?, discount?)`
Calcula el total final con impuestos y descuentos.

**Parámetros:**
- `total` (number): Monto base
- `taxRate` (number, opcional): Tasa de impuesto (default: 0.19)
- `discount` (number, opcional): Descuento a aplicar (default: 0)

**Retorna:** `CalculationResult`
```typescript
interface CalculationResult {
  net: number;    // Monto base
  tax: number;    // Impuesto calculado
  final: number;  // Total final
}
```

#### `getOrdersDetailed(limit?)`
Obtiene órdenes con información detallada de productos y categorías.

**Parámetros:**
- `limit` (number, opcional): Límite de órdenes (default: 50)

**Retorna:** `Promise<OrderDetailed[]>`
```typescript
interface OrderDetailed {
  id: number;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
```

### Optimizaciones de Rendimiento

#### Problema N+1 Resuelto
- **Antes**: 101 queries para 50 órdenes
- **Después**: 1-3 queries total
- **Mejora**: 96-97% más rápido

#### Métodos Optimizados Disponibles
1. `fetchOrdersDetailed_Batched()` - Consultas en lote
2. `fetchOrdersDetailed_Joined()` - JOIN completo
3. `benchmarkMethods()` - Comparación de rendimiento

### Limitaciones

#### Técnicas
- **Datos Mock**: No conecta a base de datos real
- **Latencia Simulada**: Delays artificiales para simular DB
- **Escalabilidad**: Limitado a datos de prueba (50 órdenes, 100 productos, 10 categorías)
- **Concurrencia**: No maneja múltiples usuarios simultáneos

#### Funcionales
- **Validación Básica**: Solo valida números positivos
- **Sin Transacciones**: No maneja rollbacks en errores
- **Sin Cache**: Cada consulta va a "base de datos"
- **Sin Paginación**: Limit simple, no offset

#### Seguridad
- **Sin Autenticación**: No verifica permisos de usuario
- **Sin Sanitización**: No valida contenido de strings
- **Sin Rate Limiting**: No limita consultas por usuario

### Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:cov

# Tests específicos del módulo
npm test -- tests/orders/
```

**Cobertura Objetivo:** ≥80% del módulo `orders/service.ts`

### Contribución

1. Mantener API pública estable
2. Agregar tests para nuevas funcionalidades
3. Documentar cambios en README
4. Ejecutar benchmarks antes de commits
5. Seguir convenciones de commit semántico
