import { getApolloClient } from '../lib/apollo-client';
import { GET_PRODUCTS_WITH_VARIANTS_AND_INVENTORY } from '../lib/shopify-queries';
import { transformProductsData, Product } from '../utils/data-export';
import { ApolloQueryResult } from '@apollo/client';

interface ShopifyConfig {
  domain: string;
  accessToken: string;
}

// Define a proper type for the product node
interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  tags: string[];
  vendor: string;
  featuredImage: {
    id: string;
    url: string;
    altText: string | null;
  } | null;
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        sku: string | null;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        image: {
          id: string;
          url: string;
          altText: string | null;
        } | null;
        quantityAvailable: number;
        requiresShipping: boolean;
        weight: number;
        weightUnit: string;
      };
    }>;
  };
  totalInventory: number;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductsQueryResult {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: ProductNode;
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
        const response: ApolloQueryResult<ProductsQueryResult> = await this.client.query({
          query: GET_PRODUCTS_WITH_VARIANTS_AND_INVENTORY,
          variables: {
            first: 25,
            after: cursor,
          },
        });
        
        // Check if data exists and has the expected structure
        if (!response || !response.data) {
          throw new Error('Invalid response from Shopify API');
        }
        
        const data = response.data;
        
        if (data.products && Array.isArray(data.products.edges)) {
          const transformedProducts = transformProductsData(data);
          products = [...products, ...transformedProducts];
          
          hasNextPage = Boolean(data.products.pageInfo?.hasNextPage);
          cursor = data.products.pageInfo?.endCursor || null;
        } else {
          console.warn('Unexpected products data structure:', JSON.stringify(data));
          hasNextPage = false;
        }
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 