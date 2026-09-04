export interface Product {
  id: number;
  reference: string;
  name: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  tvaRate: number;
  stock: number;
  minStockQuantity: number;
  categoryName: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  tvaRate: number;
  minStockQuantity: number;
  categoryId: number;
}
