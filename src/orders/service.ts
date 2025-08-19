import { fetchOrdersDetailed_NPlus1, OrderDetailed } from './repository.js';

// Constantes para eliminar magic numbers
const DEFAULT_ORDERS_LIMIT = 50;
const DEFAULT_TAX_RATE = 0.19;

// Tipos explícitos para mejorar la estructura
export interface CalculationResult {
  net: number;
  tax: number;
  final: number;
}

/**
 * Servicio principal (versión inicial): usa el repositorio con N+1.
 */
export async function getOrdersDetailed(limit = DEFAULT_ORDERS_LIMIT): Promise<OrderDetailed[]> {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`Limit must be a positive integer, received: ${limit}`);
  }
  return fetchOrdersDetailed_NPlus1(limit);
}

/**
 * Función de utilidad para el cálculo de totales. (Usada por tests)
 */
export function calculateFinal(total: number, taxRate = DEFAULT_TAX_RATE, discount = 0): CalculationResult {
  if (total < 0) {
    throw new Error(`Total must be non-negative, received: ${total}`);
  }
  if (taxRate < 0) {
    throw new Error(`Tax rate must be non-negative, received: ${taxRate}`);
  }
  if (discount < 0) {
    throw new Error(`Discount must be non-negative, received: ${discount}`);
  }
  
  const tax = total * taxRate;
  const final = total + tax - discount;
  return { net: total, tax, final };
}
