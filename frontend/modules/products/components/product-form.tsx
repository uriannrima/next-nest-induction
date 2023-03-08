import { ReactNode } from "react";

import { Product } from "@/pages/products";

import { useFormContext } from "react-hook-form";

export default function ProductForm({
  onSubmit,
  children,
}: {
  onSubmit: (product: Product) => void;
  children: ReactNode | ReactNode[];
}) {
  const { handleSubmit, register } = useFormContext<Product>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Name:
          <input
            type="text"
            // This is how we register an field using react-hook-form
            {...register("name", { required: true, minLength: 3 })}
            required
            minLength={3}
          />
        </label>
      </div>
      <div>
        <label>
          Price
          <input
            type="number"
            {...register("price", {
              valueAsNumber: true,
              required: true,
              min: 0.1,
            })}
            required
          />
        </label>
      </div>
      {children}
    </form>
  );
}
