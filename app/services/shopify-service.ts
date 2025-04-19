import { getApolloClient } from '../lib/apollo-client';
import { GET_PRODUCTS_WITH_VARIANTS_AND_INVENTORY } from '../lib/shopify-queries';
import { transformProductsData, Product } from '../utils/data-export';
import { ApolloQueryResult } from '@apollo/client';

interface ShopifyConfig {
  domain: string;
  accessToken: string;
}

interface ProductsQueryResult {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: any;
    }>;
  };
}

export class ShopifyService {
  private client;
  
  constructor(config: ShopifyConfig) {
    this.client = getApolloClient(config.domain, config.accessToken);
  }
  
  async getAllProducts(): Promise<Product[]> {
    let products: Product[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    
    try {
      while (hasNextPage) {
        const { data }: ApolloQueryResult<ProductsQueryResult> = await this.client.query({
          query: GET_PRODUCTS_WITH_VARIANTS_AND_INVENTORY,
          variables: {
            first: 25,
            after: cursor,
          },
        });
        
        if (data?.products) {
          const transformedProducts = transformProductsData(data);
          products = [...products, ...transformedProducts];
          
          hasNextPage = data.products.pageInfo.hasNextPage;
          cursor = data.products.pageInfo.endCursor;
        } else {
          hasNextPage = false;
        }
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
} 