import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Product, ProductsService } from './products.service';

export async function wait(ms = 0) {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  @Post()
  @HttpCode(201)
  addProduct(@Body() product: Omit<Product, 'id'>) {
    return this.productsService.addProduct(product);
  }

  @Put(':id')
  @HttpCode(204)
  updateProduct(@Param('id') id: number, @Body() product: Omit<Product, 'id'>) {
    return this.productsService.updateProduct(id, product);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    // await wait(2000);
    return this.productsService.geyById(id);
  }
}
