// Repositorio con N+1: hace muchas llamadas pequeñas en serie.
import { dbGetOrders, dbGetProductById, dbGetCategoryById } from './fake_db.js';

export type OrderDetailed = {
  id: number;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

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
