import { Field, Int, ObjectType, Resolver, Query, Args } from '@nestjs/graphql';

import { Product as IProduct, ProductsService } from './products.service';

@ObjectType()
export class Product implements IProduct {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;
}

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product])
  async products() {
    return this.productsService.getProducts();
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.geyById(id);
  }
}
