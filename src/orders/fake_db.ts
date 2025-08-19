const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Simula llamadas a DB.
 * La versión "start" usa N+1: múltiples llamadas pequeñas con esperas secuenciales.
 */
import { categories, products, orders, Product, Category, Order } from './data.js';

export async function dbGetOrders(limit = 50): Promise<Order[]> {
  await delay(3); // latencia base
  return orders.slice(0, limit);
}

export async function dbGetProductById(id: number): Promise<Product | undefined> {
  await delay(2);
  return products.find(p => p.id === id);
}

export async function dbGetCategoryById(id: number): Promise<Category | undefined> {
  await delay(2);
  return categories.find(c => c.id === id);
}

// Funciones optimizadas para eliminar N+1

/**
 * Simula un JOIN optimizado: obtiene productos en batch
 */
export async function dbGetProductsByIds(ids: number[]): Promise<Product[]> {
  await delay(3); // Una sola llamada con latencia similar
  return products.filter(p => ids.includes(p.id));
}

/**
 * Simula un JOIN optimizado: obtiene categorías en batch
 */
export async function dbGetCategoriesByIds(ids: number[]): Promise<Category[]> {
  await delay(3); // Una sola llamada con latencia similar
  return categories.filter(c => ids.includes(c.id));
}

/**
 * Simula una consulta con JOIN completo (orders + products + categories)
 * En SQL sería: SELECT o.*, p.*, c.* FROM orders o 
 *               JOIN products p ON o.productId = p.id 
 *               JOIN categories c ON p.categoryId = c.id 
 *               LIMIT ?
 */
export async function dbGetOrdersWithJoin(limit = 50): Promise<{
  order: Order;
  product: Product;
  category: Category;
}[]> {
  await delay(5); // Una sola query compleja vs múltiples queries simples
  
  const ordersSubset = orders.slice(0, limit);
  const result = [];
  
  for (const order of ordersSubset) {
    const product = products.find(p => p.id === order.productId);
    if (product) {
      const category = categories.find(c => c.id === product.categoryId);
      if (category) {
        result.push({ order, product, category });
      }
    }
  }
  
  return result;
}
