import React, { useEffect, useState } from "react";

import Head from "next/head";

type Product = {
  id: string;
  name: string;
  price: number;
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("http://localhost:3001/products");
      const _products: Product[] = await response.json();
      return _products;
    }

    getProducts().then((products) => {
      setProducts(products);
    });
  }, []);

  return (
    <>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          {/* Everytime that you need to generate multiple elements side by side in a iteration, keys are STRONGLY recommended */}
          <span>
            {product.name} - {product.price}
          </span>
        </div>
      ))}
    </>
  );
}

export default Products;
