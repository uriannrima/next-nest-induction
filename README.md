# next-nest-induction

An small project to show up how to setup a next project with nestjs as backend

# Environment Setup

Some of these steps will be optional, others are required.

- Windows Subsystem for Linux (WSL) _(optional)_: https://learn.microsoft.com/en-us/windows/wsl/install
  - You may just use Windows with no issue, but some tools in node install and run faster on linux, and you may get some better developer experience using it.
  - Check to see if your distro is running on WSL 2: https://learn.microsoft.com/en-us/windows/wsl/install#upgrade-version-from-wsl-1-to-wsl-2
- Node Version Manager (NVM) _(optional, but **strongly recommended**)_:
  - The best way to manage the Node version in your machine with simple commands.
  - Installation:
    - Windows: https://github.com/coreybutler/nvm-windows
    - Linux/WSL: https://github.com/nvm-sh/nvm
  - Execution:
    - nvm list: To check your installed versions
    - nvm install <version>: To install the node version that you want.
  - On Linux/WSL you may define a default version that will be used whenever you enter your environment.
- Node.js **(required)**:
  - Javascript Runtime, required to run our web development tools, to build, transpile, run, etc.
  - Installation:
    - If you have NVM:
      - `nvm install 16`
      - `nvm use 16`
    - If you dont:
      - Download your recommended version: https://nodejs.org/en/download/
      - You may find previous releases here: https://nodejs.org/en/download/releases/
- Yarn **(required)**:
  - Package manager to install our external dependencies, an NPM replacement with some improvements.
  - Uses NPM as main registry, but we'll use a private one later on.
  - Also has templates for projects, if you may want it.
  - Installation:
    - `npm i yarn -G`
    - The "G" stands for "Global", which makes yarn available for any project that you may want to create.

# Environment Checkup List

To see if you have everything that you need run these commands:

```bash
nvm -v
0.39.3 # This one is for Linux/WSL

node -v
v16.19.1

npm -v
8.19.3

yarn -v
1.22.19
```

# Tech Stack

- Frontend:
  - Language: Typescript
  - Lib/Framework: React/Nextjs
- Backend:
  - Language: Typescript/GraphQL
  - Framework: Nestjs

# Folder Organization

Our project will have two main folders, `frontend` and `backend`.

Our `frontend` will be an [Nextjs Application](https://nextjs.org/) a React Framework with a lot of built-in tools, and our `backend` will be an [Nestjs Application](https://docs.nestjs.com/), a framework for building server-side applications, or simple web apis, which has some definitions as-in .NET Framework applications (controllers, services, models, dependency injection, etc).

Nextjs comes with a lot of "Just Ready" solutions (SSR, SSG, BFF, Auth, plugins, etc) to help us try to follow best practices for frontend while Nestjs gives us an abstraction over `express` (or `nestify`, if you want more performance) to create scalable web applications.

# Objective

Create an application that can consume an endpoint with list of products and render them as a simple table, which may do CRUD operations on each product.

# Project Development

## Frontend

We'll request yarn to create a Nextjs application using a template inside of a frontend folder:

```bash
yarn create next-app

What is your project named? › frontend
Would you like to use TypeScript with this project? › Yes
Would you like to use ESLint with this project? › Yes
Would you like to use `src/` directory with this project? › Yes
Would you like to use experimental `app/` directory with this project? › No
What import alias would you like configured? … @/*
```

It should use yarn to create and install the dependencies. On Linux/WSL it may take a couple of minutes (~2 min).

### Quick Folder Run-up:

- `src/pages/`: Nextjs uses this folder as convetion to generate a router for the application
- `api`: Folder used to generate back for frontend endpoints, which may be used as starting points to communicate with our Nestjs application.
- `_document.tsx / _app.tsx`: Entrypoints to create the index.html and the root of the application, respectively.
- `public`: Folder for static content
- Other files in the root folder are mainly used for configuration, which may be explained whenever necessary.

### New page

Any folder/file inside the pages folder may be used as a router. Any `index.tsx` becomes a "root" page (/), and may be used inside of other folders to act as main page inside of a route. We're going to create an "products" route, with other valid urls inside like so:

- `products/`: List of all products
- `products/create`: Page to create a new product
- `products/PRODUCT_ID`: Preview product details
- `products/PRODUCT_ID/edit`: Page to edit a single product

For that, we'll create this folder structure:

- `products/`: An folder
  - `index.tsx`: This represents our `products` page.
  - `create.tsx`: Our `products/create` page.
  - `[id]/`: Another folder
    - `index.tsx`: The `products/PRODUCT_ID` page.
    - `edit.tsx`: The `products/PRODUCT_ID/edit` page.

As you may see, we may use an [PARAMETER_NAME] notation to define a route that accepts an dynamic value.

Here's a small component/page definition:

`products/index.tsx`

```tsx
function Products() {
  return <h1>Products</h1>;
}

export default Products;
```

By running our frontend project, and accessing `http://localhost:3000/` we should see the welcome page for our Nextjs application:

```bash
cd frontend
yarn dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Go to `http://localhost:3000/products` and we should see our simple component that we defined. Our styles look a bit weird, so, go to the `globals.css`, and delete its contents. As you may see, it takes a couple milliseconds to rebuild the page:

```bash
event - compiled client and server successfully in 70 ms (173 modules)
```

Currently our page doesn't have a title, nor description, which makes it a bit weird, so we may fix it by adding some Next components that helps us out on that:

`products/index.tsx`

```tsx
import Head from "next/head";
...
function Products() {
  return (
    <>
      <Head>
        <title>Products Page</title>
        <meta name="description" content="A products listing page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Products</h1>
    </>
  );
}
```

The `<>` is what we call a `React.Fragment`, which allows us to return two elements without having to wrap them in a `div` or other non semantic element.

Lets now add some information to our page:

`products/index.tsx`

```typescript
type Product = {
  id: number;
  name: string;
  value: number;
};
```

This is the way that we define a type, which may be used to help us follow some rules and avoid using things that aren't what we expect.

> Types/interfaces **DON'T** exist in runtime. When our project runs in the browser, it's JavaScript, plain and _simple_. So remember that, our intention is to determine whats wrong during development time. There are tools to do typecheck during runtime, but it's beyond the scope, if you want, search **"zod"** and other tools.

Create an array of products inside our component, with some items, and lets render them:

`products/index.tsx`

```tsx
...
const products: Product[] = [
  { id: "1", name: "Shoes", price: 11 },
  { id: "2", name: "Dress", price: 12 },
  { id: "3", name: "Shirt", price: 13 },
];

function Products() {
  return (
    <>
      {/* ... */}
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
```

As you may see, in React we uses Typescript/Javascript language to power the generation of HTML content, so we use the `map` function to create each one of the `div`s for each product. We may "navigate" between Typescript and HTML back and forth using the `{ }`s.

> TSX/JSX **ISN'T HTML**, so some things from HTML do not apply (like the html attribute `for`, that becomes `htmlFor`).

Right now our list of products is hard coded in the `frontend`, so it would be nice if it came from some `backend`, so lets change it.

## Backend

Let's request yarn to create our nestjs application, at our root project folder:

```bash
npm i -g @nestjs/cli # Install nestjs/cli globally, the CLI has a lot of useful methods to create controllers, services, etc.

nest new backend

? Which package manager would you ❤️  to use?
  npm
❯ yarn

👉  Get started with the following commands:

$ cd backend
$ yarn run start:dev # Change the port before running on main.ts
```

If you have the frontend already running, you'll have conflict ports, so go to the `main.ts` in the backend project, and change the line:

```ts
await app.listen(3001); // Changed from 3000
```

### Quick Folder Run-up:

- `src/`: Is mostly the only place that you'll be changing things.
  - `src/main.ts`: Application entrypoint
  - `src/app.module.ts`: Main application module, your application may be made of many modules organized into other modules. The app module is the main one.
  - `src/app.controller.ts`: Example of Web API controller.
  - `src/app.service.ts`: An example of service that may be injected somewhere else.

Inside of the `src`, you may organize your project as you want, by module, by feature, be my guest. Mostly your modules will consist of a module file, some controllers and some services. Organize it as best for your team.

Lets create an new product module, with a controller and a service for it.

- `src/modules/products`:
  - `products.module.ts`
  - `products.controller.ts`
  - `products.service.ts`

`products.module.ts`

```ts
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class ProductsModule {}
```

We created a ProductsModule without any services or controllers, but we'll change that soon. See that we "annotate" (in Typescript/Javascript it is called **decorate**) the class with `@Module` from Nestjs, which is the way of telling to it that it is a module.

`products.service.ts`

```ts
import { Injectable } from "@nestjs/common";

type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: "1", name: "Shoes", price: 11 },
  { id: "2", name: "Dress", price: 12 },
  { id: "3", name: "Shirt", price: 13 },
];

@Injectable()
export class ProductsService {
  getProducts(): Product[] {
    return products;
  }
}
```

The `@Injectable` decorator tells to Nestjs that this service can be injected into another controller/services. We added the `Product` type in the same manner that we created in the `frontend` project.

Now, to our controller:

```ts
import { Controller, Get } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }
}
```

The `@Controller` decorator tells that this class will be used as a Web API controller, just as .NET. `@Get` maps it into a `HTTP GET /`, since inside of `products`, it will be invoke on `HTTP GET products/`.

Our `ProductsService` is injected in the constructor when Nestjs creates this controller for us. The `private readonly` tells in the constructor to typescript, that we want to create a property inside the `ProductsController` to hold the value for the service.

Now, update the module:

```diff
import { Module } from '@nestjs/common';
+ import { ProductsController } from './products.controller';
+ import { ProductsService } from './products.service';

@Module({
  imports: [],
+  controllers: [ProductsController],
+  providers: [ProductsService],
})
export class ProductsModule {}
```

And add it to our AppModule:

```diff
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
+ import { ProductsModule } from './modules/products/products.module';

@Module({
+  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Navigate to `http://localhost:3001/products`, and you should see:

```json
[
  {
    "id": "1",
    "name": "Shoes",
    "price": 11
  },
  {
    "id": "2",
    "name": "Dress",
    "price": 12
  },
  {
    "id": "3",
    "name": "Shirt",
    "price": 13
  }
]
```

**Congratulations**, you have a products API, lets integrate `backend` and `frontend`.

Before we do that, lets add a CORS rule so that we can consume it from another port:

`backend/src/main.ts`

```diff
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
+  app.enableCors();
  await app.listen(3001);
}
```

## Frontend / Backend Integration

First, lets consume our `frontend`, as naive as possible. The first solution would be to use a `fetch`, some hooks, and a _lot of boilerplate_:

```diff
- const products: Product[] = [
-   { id: "1", name: "Shoes", price: 11 },
-   { id: "2", name: "Dress", price: 12 },
-   { id: "3", name: "Shirt", price: 13 },
- ];

function Products() {
+  const [products, setProducts] = useState<Product[]>([]);

+  useEffect(() => {
+    async function getProducts() {
+      const response = await fetch("http://localhost:3001/products");
+      const _products: Product[] = await response.json();
+      return _products;
+    }
+
+    getProducts().then((products) => {
+      setProducts(products);
+    });
+  }, []);
...
}
```

We've removed the products list, create some state for our component using `useState`, which will hold the products for us (empty at the beginning). Added a `useEffect`, which stands for a function that will be called everytime this component render, **IF** some dependency changes (the empty [] at the end of it). By passing a empty array, we say that we don't want it to run again, other than **ONCE**.

The `getProducts` async function `fetch`es the information from the `backend`, parse the response, turn it into a JSON, and we **enforce it** to a Products array. Again, there is no type casting here, types doesn't exist, we are only telling typescript that we are pretty sure that our backend returns to us a Product type. **This is far from perfect, but will do for now**.

You should see now on the Products page (`http://localhost:3000/products`) the same lists of products, but now, they come from the backend (watch `Network` tab on Chrome, on `Fetch/XHR` you should see some `http://localhost:3001/products`). Congratulations, you've consumed your `backend`.

But again, that is a lot of boilerplate, and our application behaves as an Single Page Application, and we aren't using a lot of the power that Nextjs gives to us (remember, we have an BFF API and other tools...)

So let's get rid of the boilerplate first.

## Using `react-query` (or removing boilerplate):

First, lets add [react-query](https://react-query-v3.tanstack.com/) to our frontend project:

`yarn add react-query`

`react-query` have strategies to fetch, cache, update, mutate, etc, any information that we see necessary to get from the `backend`, it will help us out to manage in between states (loading, error, etc), share results between components to avoid refetching, just to name a few of its tools.

After we've installed it, let us change our `Products` component to use it:

```diff
+async function getProducts() {
+  const response = await fetch("http://localhost:3001/products");
+  const _products: Product[] = await response.json();
+  return _products;
+}

function Products() {
-  const [products, setProducts] = useState<Product[]>([]);
-
-  useEffect(() => {
-    async function getProducts() {
-      const response = await fetch("http://localhost:3001/products");
-      const _products: Product[] = await response.json();
-      return _products;
-    }
-
-    getProducts().then((products) => {
-      setProducts(products);
-    });
-  }, []);

+  const {
+    data: products,
+    isLoading,
+    isError,
+  } = useQuery(["get-products"], getProducts);
```

We've moved the `fetch`ing function outside of the component, this way we may reuse somewhere else if needed, added a `useQuery` hook, that we give an identifier (`get-products`) and a `fetch` function. The hook will handle requesting the information, and gives us some informations:

- useQuery:
  - `data`: Will be information fetched from the backend using the `getProducts`.
  - `isLoading/isError`: Tells us the current state of the fetching.

We rename the `data` as `products`, and our code is almost perfect, but now Typescript complains about a possibility of a undefined value. Thats because while the information isn't available, the `data` is `undefined`. So we have to consider it while coding our template:

```diff
<>
      <h1>Products</h1>
-      {products.map((product) => (
+      {products?.map((product) => (
        <div key={product.id}>
          {/* Everytime that you need to generate multiple elements side by side in a iteration, keys are STRONGLY recommended */}
          <span>
            {product.name} - {product.price}
          </span>
        </div>
      ))}
    </>
```

Since `React` ignores anything that is a null or undefined, if our product is undefined, we render nothign. But we may have an issue yet:

`Error: No QueryClient set, use QueryClientProvider to set one`

Our ReactQuery doesn't have a client to use, and we solve it by providing it as "up" as possible in our application, in this cade, in our \_app.tsx:

```diff
import "@/styles/globals.css";
import type { AppProps } from "next/app";
+import { QueryClient, QueryClientProvider } from "react-query";

+const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
+    <QueryClientProvider client={client}>
      <Component {...pageProps} />
+    </QueryClientProvider>
  );
}
```

And with that, we should see the products again, but now without much of the boilerplate and with other tools at our disposal. We may not even show an loading message while we dont have the information. Lets also add a fake wait in our function so we can even see it:

```diff
+ async function wait(ms = 0) {
+   return new Promise<void>((res) => {
+     setTimeout(() => {
+       res();
+     }, ms);
+   });
+ }

...

async function getProducts() {
+  await wait(3000);

...

<h1>Products</h1>
+{isLoading && <span>Loading products...</span>}
{products?.map((product) => (
```

Thats great, but we're still working as a simple SPA, where our information arrives in the `frontend` only after the first render, we can do it better, and fetch the information while Nextjs is rendering it, avoiding the fetch in the client side. So let's do it.

## Using SSR with getServerSideProps

Add the following function to your `Product` component:

```tsx
import { GetServerSideProps } from "next";

...

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
```

This function tells Nextjs to make available any information given in "props" as a property while rendering the component (in this case `Products`) on the server side. And sync it is an async function, we can just use the fetch function that we had previously defined:

```tsx
export const getServerSideProps: GetServerSideProps = async () => {
  const products = await getProducts();

  return {
    props: {
      products,
    },
  };
};
```

Lets also change our `Product` to accept it's products through the prop:

```diff
+function Products({ products }: { products: Product[] }) {
-  const {
-    data: products,
-    isLoading,
-    isError,
-  } = useQuery(["get-products"], getProducts);

...
-      {isLoading && <span>Loading products...</span>}
```

Since the loading occurs in the server side, we don't need the loading for now. After that, you should see the products list, without any `fetch` in the `Network` tab, and by looking at the HTML returned by Next (`http://localhost:3000/products`) you should see that the HTML already comes from the server with products on it. The server has `SSR` our page with the information already being fetched in the server side.

> Beware that, we would need to make some modifications for this usage be really "production-ready" by making the fetched information available for the entire application and avoid refetching (or multiple getServerSideProps), but it's beyond the scope now, if you want to know more about of how to do it, you can check it [here](https://tanstack.com/query/v4/docs/react/guides/ssr).

## Adding new operations in the backend

Below, I'm going to leave a quick reference of adding new HTTP methods in our `products` module:

`backend/src/modules/products/products.service.ts`

```ts
import { Injectable, NotFoundException } from "@nestjs/common";

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
      { id: 1, name: "Shoes", price: 11 },
      { id: 2, name: "Dress", price: 12 },
      { id: 3, name: "Shirt", price: 13 }
    );
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product) {
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

  updateProduct(id: number, { id: ignore, ...updatedProduct }: Product) {
    const foundProduct = this.findById(id);
    return Object.assign(foundProduct, updatedProduct);
  }

  geyById(id: number) {
    return this.findById(id);
  }
}
```

`backend/src/modules/products/products.controller.ts`

```ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Product, ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  @Post()
  @HttpCode(201)
  addProduct(@Body() product: Product) {
    return this.productsService.addProduct(product);
  }

  @Put(":id")
  @HttpCode(204)
  updateProduct(@Param("id") id: number, @Body() product: Product) {
    return this.productsService.updateProduct(id, product);
  }

  @Get(":id")
  getById(@Param("id") id: number) {
    return this.productsService.geyById(id);
  }
}
```

Now, you should be able to:

```bash
curl http://localhost:3001/products # Get all

[{"id":1,"name":"Shoes","price":11},{"id":2,"name":"Dress","price":12},{"id":3,"name":"Shirt","price":13}]

curl http://localhost:3001/products/1 # Get by id

{"id":1,"name":"Shoes","price":11}

curl http://localhost:3001/products/4 # Get an 404

{"statusCode":404,"message":"Not Found"}

curl -X POST http://localhost:3001/products
  -H "Content-Type: application/json"
  -d '{ "name": "Basketball", "price": 14 }' # Create a new product

{"name":"Basketball","price":14,"id":4}

curl -X PUT http://localhost:3001/products/4
  -H "Content-Type: application/json"
  -d '{ "name": "Football", "price": 14 }' # Update a product
```

## Handling form submission and routing

Now, lets add two new pages as example, one to `create` a new product, and another one to `preview` a product:

## Create Page

### Using `react-hook-form`:

Since we don't want to add boilerplate to handle forms, we're going to use a tool called `react-hook-form` that lets us create, manage and submit forms with ease on `React`, use our `react-query` to submit the information to the `backend`, and use Nextjs `router` to redirect us to the `/products` after submiting:

`frontend/src/pages/products/create.tsx`

```tsx
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Product } from ".";

// Create a intermediate type without the ID.
type CreateProduct = Omit<Product, "id">;

// Our async fetch function to post information
async function createProduct(product: CreateProduct) {
  return fetch("http://localhost:3001/products", {
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
  const { register, handleSubmit } = useForm<CreateProduct>();

  // Function that will be called on succesful submit
  const onSubmit = (values: CreateProduct) => {
    mutate(values);
  };

  return (
    <>
      <h1>Create Product</h1>
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
        {/* Since react-query gives us a way to handle with the post, 
        we have a isLoading to disable the button while we submit. */}
        <button disabled={isLoading}>Create</button>
      </form>
    </>
  );
}
```

## Preview Page

### Using getServerSideProps with router/context:

Just like the `Products`, we're going to fetch the required information server side, by recovering the URL ID from the context that is given to `getServerSideProps` function.

```tsx
import { GetServerSideProps } from "next";
import Link from "next/link";

import { Product } from "..";

// Async function to fetch a single product information
async function getById(id: number) {
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
      <Link href="/products">Products</Link>
      <hr />
      <div>
        <span>{product?.name}</span>
      </div>
    </>
  );
}
```

# Exercise #1:

As a small exercise, I would recommend to create the `EditProduct` page. Or if you just want to know how to do it, find the implementation inside `frontend/src/pages/products/[id]/edit.tsx`.

# Adding GraphQL

## Backend

Nestjs already comes with tools for us to define a GraphQL endpoint, with two strategies: `code first` (if you already have code and classes for your project) or `schema first` (if you already have an graphql schema ready). We're going to use the `code first`, since we already have all the code to make our REST API work.

Lets first add our dependencies:

`yarn add @nestjs/graphql @nestjs/apollo graphql apollo-server-express`

And add the GraphQL moduel to the application:

```diff
+import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
+import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ProductsModule,
+    GraphQLModule.forRoot<ApolloDriverConfig>({
+      driver: ApolloDriver,
+      autoSchemaFile: true,
+      playground: true,
+    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

The `autoSchemaFile: true` tells Nestjs to generate our `schema.gql` in memory, you could pass a folder for it to be generated and be used for other solutions (like having typings for your `queries` in `frontend`, which is a really nice to have), this property is required, otherwise our server dont know our typings.

We've added the `playground: true` so that we can play with our queries at `http://localhost:3001/graphql/playground`, this one is _optional_.

So, lets define a GraphQL module, and return some data:

`backend/src/modules/products/product.graphql.ts`:

```ts
import { Field, Int, ObjectType, Resolver, Query, Args } from "@nestjs/graphql";

import { Product as IProduct, ProductsService } from "./products.service";

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
  async product(@Args("id", { type: () => Int }) id: number) {
    return this.productsService.geyById(id);
  }
}
```

First, we define a `@ObjectType` using its decorator, it is used to tell Nestjs to generate a `Product` type for GraphQL.

The `@Field` decorator tells how to validate each field.

The `@Resolver` tells that this class is used to resolve the `Product` type, so any query that needs a `Product` may go through here.

We define two `@Query`: `product` and `products`, the first one, returns a single product, the second, all of them. Since our `product` query needs to the ID of the product, we say that it accepts an argument with `@Args`.

And since we already have a service to do all of the products list management (`ProductService`), we inject it in the controller, and use the same methods that we used for the REST solution here (`getProducts` and `getById`).

We add this new module, to our ProductModule:

```diff
import { Module } from '@nestjs/common';
+import { ProductsResolver } from './product.graphql';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [],
  controllers: [ProductsController],
+  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
```

And by navigating to `http://localhost:3001/graphql/playground`, we should see the playground, and be able to do this query:

```graphql
query {
  products {
    name
  }
  product(id: 1) {
    name
    price
  }
}
```

And see the list of products with just theirs name, and a single product with its entire information.

## Frontend

Now, we may consume our GraphQL endpoint to get the products information, so lets create a clone of our `preview` page to use a query to get its information.

> There are a lot of ways of doing this type of query in the `frontend`, and strategies to allow pages/components to use only the information that it needs, like just some properties of a big type. An way of doing it is using Query `Fragments`, which allows each component to define what part of a type it wants, etc. You may want to read about it [here](https://www.apollographql.com/docs/react/data/fragments/), and research about, like [here](https://levelup.gitconnected.com/a-better-way-to-use-graphql-fragments-in-react-4f54bf862062). But we're leaving it out of the explanation for simplicity.

There are two ways of handling fetching the information, like we did before with the REST endpoints:

1. **Client Side**: Use a query in your component, almost like the same way that we did on our `useQuery` from `react-query`.
2. **Server Side**: Use the client on a `getServerSideProps`, and pass the required information to the component through the `props` return.

> Both solutions are valid, and you may check which one is best for your use case. You may even find a way to share the information fetched in the `server side` with the `client side` by serializing its cache. We're going to stick to the first one (since it's the most common case), but leave an example of the second one too in the preview component.

First, add our new dependencies:

`yarn add @apollo/client graphql`

Create a file to export our graphql client:

`frontend/src/graphql.ts`

```ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
});

export default client;
```

Create a clone of our `preview` page that uses `@apollo/client` hook: `useQuery`.

`frontend/src/pages/products/[id]/gql.tsx`

```tsx
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
      <Link href="/products">Products</Link> <Link
        href={`/products/${data?.product?.id}/edit`}
      >
        Edit
      </Link>
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
```

It almost looks like the same as `preview` before the `getServerSideProps`. But since we don't have a way (for now) to know the GraphlQL typings, we have to give some help to Typescript, so we create a `GetProductQuery` type to help us out on the query result.

> We're a _bit of a liar_, since we're telling that our query returns the entire `Product`, but we only have the name and price properties, someone could come later try to use the ID property and receive an error. You can use `graphql-codegen` to generate Typescript types for your queries, and have a better developer experience and avoid future errors. You can find more [here](https://the-guild.dev/graphql/codegen/docs/getting-started).

If we access the `http://localhost:3000/products/1/gql` URL, we receive an error, because we didn't provide a `client` to our `useQuery`, lets solve that:

```diff
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "react-query";
+import { ApolloProvider } from "@apollo/client";

+import ApolloClient from "../graphql";

import "@/styles/globals.css";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
+    <ApolloProvider client={ApolloClient}>
      <QueryClientProvider client={client}>
        <Component {...pageProps} />
      </QueryClientProvider>
+    </ApolloProvider>
  );
}
```

With that, you should be able to see the product name and price (and maybe a quick `loading` message).

# Exercise #2:

Create a clone of `create` page to use a grqphql `mutation` instead of a `POST` method.

> Tip: You're going to use `useMutation` from `@apollo/client`.

# That's All Folks

So, I hope that after this _small_ tutorial/induction, you may have a good grasp of how to create your `backend` and `frontend` with nextjs/nestjs and how to integrate those two.

There is a lot else to learn, decisions to make, and many different ways of solving/connecting things, but this is a small example of how to do it.

Hope you like it.

Thanks.
