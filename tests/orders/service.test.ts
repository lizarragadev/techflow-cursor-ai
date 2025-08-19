import { calculateFinal } from '../../src/orders/service';

describe('calculateFinal', () => {
  it('calcula con IVA por defecto', () => {
    const r = calculateFinal(100);
    expect(r).toEqual({ net: 100, tax: 19, final: 119 });
  });

  it('aplica descuento', () => {
    const r = calculateFinal(100, 0.19, 10);
    expect(r.final).toBe(109);
  });

  it('lanza error con parámetros inválidos', () => {
    expect(() => calculateFinal(-1)).toThrow('Invalid');
  });
});
