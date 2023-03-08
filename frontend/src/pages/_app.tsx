import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "react-query";
import { ApolloProvider } from "@apollo/client";

import ApolloClient from "../graphql";

import "@/styles/globals.css";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={ApolloClient}>
      <QueryClientProvider client={client}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ApolloProvider>
  );
}
