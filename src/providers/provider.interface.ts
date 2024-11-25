export interface ProductData {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  availability: boolean;
  lastUpdated: Date;
}
