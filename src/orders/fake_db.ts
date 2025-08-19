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
