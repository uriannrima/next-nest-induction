import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import ProductForm from "../../../../modules/products/components/product-form";
import { Product } from "..";
import { getById } from ".";

async function updateProduct(product: Product) {
  return fetch(`http://localhost:3001/products/${product.id}`, {
    method: "PUT",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { id: productId },
}) => {
  const product: Product = await getById(Number(productId));
  return {
    props: { product },
  };
};

export default function EditProduct({ product }: { product: Product }) {
  const router = useRouter();
  const form = useForm<Product>({
    defaultValues: { ...product },
  });

  const client = useQueryClient();
  const { mutate, isLoading } = useMutation(updateProduct, {
    onSuccess() {
      client.invalidateQueries(["get-products"]);
      router.push("/products");
    },
  });

  const onSubmit = (product: Product) => {
    mutate(product);
  };

  return (
    <>
      <h1>Edit Product</h1>
      <Link href="/products">Products</Link>{" "}
      <Link href={`/products/${product.id}`}>Preview</Link> <hr />
      <hr />
      <FormProvider {...form}>
        <ProductForm onSubmit={onSubmit}>
          <button disabled={isLoading}>Save</button>
        </ProductForm>
      </FormProvider>
    </>
  );
}
