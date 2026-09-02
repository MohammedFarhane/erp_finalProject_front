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
