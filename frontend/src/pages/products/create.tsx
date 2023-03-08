import { useRouter } from "next/router";

import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import ProductForm from "../../../modules/products/components/product-form";
import { Product } from ".";

// Create a intermediate type without the ID.
export type CreateProduct = Omit<Product, "id">;

// Our async fetch function to post information
async function createProduct(product: CreateProduct) {
  return fetch(`http://localhost:3001/products`, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function Create() {
  // We use the router to redirect the user to /products after creating it.
  const router = useRouter();

  // We ask for the react-query to invalidate the "get-products" query, and avoid stale cache.
  const client = useQueryClient();

  // useMutation instead of a useQuery, since we're POSTing to the backend
  const { mutate, isLoading } = useMutation(createProduct, {
    onSuccess() {
      // This is how we invalidate a query to avoid stale cache
      client.invalidateQueries(["get-products"]);

      // Send the user to the products page
      router.push("/products");
    },
  });

  // Our react-hook-form
  const form = useForm<CreateProduct>();

  // Function that will be called on succesful submit
  const onSubmit = (values: CreateProduct) => {
    mutate(values);
  };

  return (
    <>
      <h1>Create Product</h1>
      <FormProvider {...form}>
        <ProductForm onSubmit={onSubmit}>
          <button disabled={isLoading}>Create</button>
        </ProductForm>
      </FormProvider>
    </>
  );
}
