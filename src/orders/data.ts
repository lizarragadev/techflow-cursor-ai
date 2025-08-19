export type Order = { id: number; productId: number; quantity: number };
export type Product = { id: number; name: string; price: number; categoryId: number };
export type Category = { id: number; name: string };

export const categories: Category[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Category ${i + 1}`,
}));

export const products: Product[] = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: 10 + (i % 10),
  categoryId: (i % 10) + 1,
}));

export const orders: Order[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  productId: (i % 100) + 1,
  quantity: (i % 5) + 1,
}));
