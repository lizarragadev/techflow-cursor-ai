// Repositorio con N+1: hace muchas llamadas pequeñas en serie.
import { 
  dbGetOrders, 
  dbGetProductById, 
  dbGetCategoryById,
  dbGetProductsByIds,
  dbGetCategoriesByIds,
  dbGetOrdersWithJoin
} from './fake_db.js';

export type OrderDetailed = {
  id: number;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export interface PerformanceMetrics {
  method: string;
  executionTimeMs: number;
  queriesCount: number;
  recordsProcessed: number;
}

export async function fetchOrdersDetailed_NPlus1(limit = 50): Promise<OrderDetailed[]> {
  const orders = await dbGetOrders(limit);
  const result: OrderDetailed[] = [];
  for (const o of orders) {
    const p = await dbGetProductById(o.productId); // <-- llamada por orden
    if (!p) continue;
    const c = await dbGetCategoryById(p.categoryId); // <-- otra llamada por orden
    const total = p.price * o.quantity;
    result.push({
      id: o.id,
      productName: p.name,
      categoryName: c?.name ?? 'Unknown',
      quantity: o.quantity,
      unitPrice: p.price,
      total,
    });
  }
  return result;
}

/**
 * OPTIMIZACIÓN 1: Batching/Bulk queries
 * Elimina N+1 usando consultas en lote (batch)
 * Complejidad: O(1) queries vs O(N) queries
 */
export async function fetchOrdersDetailed_Batched(limit = 50): Promise<OrderDetailed[]> {
  const startTime = performance.now();
  
  // 1 query: obtener órdenes
  const orders = await dbGetOrders(limit);
  
  // 1 query: obtener todos los productos necesarios en batch
  const productIds = [...new Set(orders.map(o => o.productId))];
  const products = await dbGetProductsByIds(productIds);
  const productMap = new Map(products.map(p => [p.id, p]));
  
  // 1 query: obtener todas las categorías necesarias en batch
  const categoryIds = [...new Set(products.map(p => p.categoryId))];
  const categories = await dbGetCategoriesByIds(categoryIds);
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  
  // Procesar en memoria (sin más queries a DB)
  const result: OrderDetailed[] = [];
  for (const order of orders) {
    const product = productMap.get(order.productId);
    if (!product) continue;
    
    const category = categoryMap.get(product.categoryId);
    const total = product.price * order.quantity;
    
    result.push({
      id: order.id,
      productName: product.name,
      categoryName: category?.name ?? 'Unknown',
      quantity: order.quantity,
      unitPrice: product.price,
      total,
    });
  }
  
  const endTime = performance.now();
  console.log(`🚀 Batched method: ${Math.round(endTime - startTime)}ms - 3 queries total`);
  
  return result;
}

/**
 * OPTIMIZACIÓN 2: JOIN completo
 * Elimina N+1 usando una sola query con JOIN
 * Complejidad: O(1) query vs O(N) queries
 */
export async function fetchOrdersDetailed_Joined(limit = 50): Promise<OrderDetailed[]> {
  const startTime = performance.now();
  
  // 1 query: JOIN completo en base de datos
  const joinedData = await dbGetOrdersWithJoin(limit);
  
  // Mapear resultado (sin más queries)
  const result: OrderDetailed[] = joinedData.map(({ order, product, category }) => ({
    id: order.id,
    productName: product.name,
    categoryName: category.name,
    quantity: order.quantity,
    unitPrice: product.price,
    total: product.price * order.quantity,
  }));
  
  const endTime = performance.now();
  console.log(`🚀 Joined method: ${Math.round(endTime - startTime)}ms - 1 query total`);
  
  return result;
}


