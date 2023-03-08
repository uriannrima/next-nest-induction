import { GetServerSideProps } from "next";
import Link from "next/link";

import { Product } from "..";

// Async function to fetch a single product information
export async function getById(id: number) {
  const response = await fetch(`http://localhost:3001/products/${id}`);
  const product: Product = await response.json();
  return product;
}

// As the /products page, we're going to fetch the information server side
export const getServerSideProps: GetServerSideProps = async ({
  // We receive the Nextjs context here, where we can extract the URL information, like query
  query: { id: productId },
}) => {
  const product = await getById(Number(productId));
  return {
    props: { product },
  };
};

// And simply render it
export default function PreviewProduct({ product }: { product: Product }) {
  return (
    <>
      <h1>Preview:</h1>
      <Link href="/products">Products</Link>{" "}
      <Link href={`/products/${product.id}/edit`}>Edit</Link>
      <hr />
      <div>
        <span>{product?.name}</span>
      </div>
    </>
  );
}
