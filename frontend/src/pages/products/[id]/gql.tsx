import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { gql, useQuery } from "@apollo/client";

import client from "@/graphql";

import { Product } from "..";

// Define our query, $productId tells that it requires an argument.
const GET_PRODUCT = gql(`
query GetProduct($productId: Int!) {
  product(id: $productId) {
    name,
    price
  }
}
`);

// Our query could return not only product, so we need to specify each property
// that it returns
type GetProductQuery = {
  product: Product;
};

// We could export this function to be used as a fetching data on SSR of the component, and pass the product as a prop to the page.
// We would avoid the loading state, and the fetching on client side. Defined here as an example.
const getServerSideProps: GetServerSideProps = async ({
  query: { id: productId },
}) => {
  const { data } = await client.query<GetProductQuery>({
    query: GET_PRODUCT,
    variables: {
      productId,
    },
  });

  return {
    props: {
      product: data.product,
    },
  };
};

export default function PreviewProduct() {
  // Recover the product ID from the URL.
  const {
    query: { id: productId },
  } = useRouter();

  // Almost like react-query, we also use a useQuery hook to get the information
  // And it gives us the data, and some in between states, like loading.
  const { data, loading } = useQuery<GetProductQuery>(GET_PRODUCT, {
    // Pass the product ID argument
    variables: {
      productId: Number(productId),
    },
    // Don't run the query if we don't have the product id yet
    skip: !productId,
  });

  return (
    <>
      <h1>Preview:</h1>
      <Link href="/products">Products</Link>{" "}
      <Link href={`/products/${data?.product?.id}/edit`}>Edit</Link>
      <hr />
      {/* Since we're fetching client side, back is our loading again... */}
      {loading && <span>Loading...</span>}
      <div>
        <span>{data?.product?.name}</span>
      </div>
      <div>
        <span>{data?.product?.price}</span>
      </div>
    </>
  );
}
