import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create an Apollo Client instance for Shopify GraphQL API
export const getApolloClient = (shopifyDomain: string, accessToken: string) => {
  const httpLink = new HttpLink({
    uri: `https://${shopifyDomain}/api/2023-10/graphql.json`,
    headers: {
      'X-Shopify-Storefront-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}; 