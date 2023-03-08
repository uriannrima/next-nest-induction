import { GetServerSideProps } from "next";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  price: number;
};

async function getProducts() {
  const response = await fetch("http://localhost:3001/products");
  const _products: Product[] = await response.json();
  return _products;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await getProducts();

  return {
    props: {
      products,
    },
  };
};

function Products({ products }: { products: Product[] }) {
  return (
    <>
      <h1>Products</h1>
      <Link href="/products/create">Create</Link>
      <hr />
      {products?.map((product) => (
        <div key={product.id}>
          {/* Everytime that you need to generate multiple elements side by side in a iteration, keys are STRONGLY recommended */}
          <span>
            {product.name} - {product.price}
          </span>{" "}
          <Link href={`/products/${product.id}`}>Preview</Link>{" "}
          <Link href={`/products/${product.id}/edit`}>Edit</Link>
        </div>
      ))}
    </>
  );
}

export default Products;
