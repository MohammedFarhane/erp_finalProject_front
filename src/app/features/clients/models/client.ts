import { Address } from '../../../core/models/address';

export type AddressType = 'FACTURATION' | 'LIVRAISON';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  addresses: { type: AddressType; address: Address }[];
  billingAddress: Address;
}
