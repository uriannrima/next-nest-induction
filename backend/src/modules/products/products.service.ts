import { Injectable } from '@nestjs/common';

type Product = {
  id: string;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: '1', name: 'Shoes', price: 11 },
  { id: '2', name: 'Dress', price: 12 },
  { id: '3', name: 'Shirt', price: 13 },
];

@Injectable()
export class ProductsService {
  getProducts(): Product[] {
    return products;
  }
}
