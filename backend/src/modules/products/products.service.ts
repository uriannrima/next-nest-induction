import { Injectable, NotFoundException } from '@nestjs/common';

export type Product = {
  id: number;
  name: string;
  price: number;
};

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor() {
    this.products.push(
      { id: 1, name: 'Shoes', price: 11 },
      { id: 2, name: 'Dress', price: 12 },
      { id: 3, name: 'Shirt', price: 13 },
    );
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct = { ...product, id: this.products.length + 1 };
    this.products.push(newProduct);
    return newProduct;
  }

  private findById(id: number) {
    const found = this.products.find((p) => p.id == id);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  updateProduct(id: number, updatedProduct: Omit<Product, 'id'>) {
    const foundProduct = this.findById(id);
    return Object.assign(foundProduct, updatedProduct);
  }

  geyById(id: number) {
    return this.findById(id);
  }
}
