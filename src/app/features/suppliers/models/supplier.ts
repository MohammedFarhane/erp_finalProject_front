import { Address } from '../../../core/models/address';

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface SupplierRequest {
  name: string;
  email: string;
  phone: string;
  address: Address;
}
