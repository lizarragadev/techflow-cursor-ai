import { fetchOrdersDetailed_NPlus1, OrderDetailed } from './repository.js';

/**
 * Servicio principal (versión inicial): usa el repositorio con N+1.
 */
export async function getOrdersDetailed(limit = 50): Promise<OrderDetailed[]> {
  if (limit <= 0) throw new Error('invalid limit');
  return fetchOrdersDetailed_NPlus1(limit);
}

/**
 * Función de utilidad para el cálculo de totales. (Usada por tests)
 */
export function calculateFinal(total: number, iva = 0.19, discount = 0) {
  if (total < 0 || iva < 0 || discount < 0) throw new Error('Invalid');
  const tax = total * iva;
  const final = total + tax - discount;
  return { net: total, tax, final };
}
