import { ProductType } from '../constants/productType';

export interface IProduct {
  id: number;
  name: string;
  productType: ProductType;
  revenueCode?: string;
  revenueCodeDescription?: string;
}
