import { stringify } from 'csv-stringify/sync';

// Type definitions for Product data
export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

export interface ProductVariant {
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
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: ProductImage | null;
  quantityAvailable: number;
  requiresShipping: boolean;
  weight: number;
  weightUnit: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  tags: string[];
  vendor: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
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

// Define GraphQL response structure
interface ProductNodeImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductEdgeNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  tags: string[];
  vendor: string;
  featuredImage: ProductNodeImage | null;
  images: {
    edges: Array<{
      node: ProductNodeImage;
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
        image: ProductNodeImage | null;
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

interface GraphQLProductsResponse {
  products: {
    edges: Array<{
      node: ProductEdgeNode;
    }>;
  };
}

// Transform GraphQL response to a flat structure
export const transformProductsData = (data: GraphQLProductsResponse): Product[] => {
  return data.products.edges.map((edge) => {
    const node = edge.node;
    return {
      id: node.id,
      title: node.title,
      description: node.description,
      handle: node.handle,
      productType: node.productType,
      tags: node.tags,
      vendor: node.vendor,
      featuredImage: node.featuredImage,
      images: node.images?.edges.map((imgEdge) => imgEdge.node) || [],
      variants: node.variants?.edges.map((varEdge) => varEdge.node) || [],
      totalInventory: node.totalInventory,
      availableForSale: node.availableForSale,
      priceRange: node.priceRange,
    };
  });
};

// Define a proper type for flattened CSV row
interface FlattenedProductCSV {
  'Product ID': string;
  'Product Title': string;
  'Product Handle': string;
  'Product Type': string;
  'Product Tags': string;
  'Product Vendor': string;
  'Product Available': string;
  'Total Inventory': number;
  'Min Price': string;
  'Max Price': string;
  'Variant ID': string;
  'Variant Title': string;
  'Variant SKU': string;
  'Variant Available': string;
  'Variant Price': string;
  'Compare At Price': string;
  'Variant Options': string;
  'Quantity Available': number | string;
  'Requires Shipping': string;
  'Weight': string;
}

// Create a flattened view for CSV export
export const flattenProductsForCSV = (products: Product[]): FlattenedProductCSV[] => {
  const flattenedRows: FlattenedProductCSV[] = [];
  
  products.forEach(product => {
    // If product has variants, create a row for each variant
    if (product.variants.length > 0) {
      product.variants.forEach(variant => {
        flattenedRows.push({
          'Product ID': product.id,
          'Product Title': product.title,
          'Product Handle': product.handle,
          'Product Type': product.productType,
          'Product Tags': product.tags.join(', '),
          'Product Vendor': product.vendor,
          'Product Available': product.availableForSale ? 'Yes' : 'No',
          'Total Inventory': product.totalInventory,
          'Min Price': `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`,
          'Max Price': `${product.priceRange.maxVariantPrice.amount} ${product.priceRange.maxVariantPrice.currencyCode}`,
          'Variant ID': variant.id,
          'Variant Title': variant.title,
          'Variant SKU': variant.sku || '',
          'Variant Available': variant.availableForSale ? 'Yes' : 'No',
          'Variant Price': `${variant.price.amount} ${variant.price.currencyCode}`,
          'Compare At Price': variant.compareAtPrice ? `${variant.compareAtPrice.amount} ${variant.compareAtPrice.currencyCode}` : '',
          'Variant Options': variant.selectedOptions.map(opt => `${opt.name}: ${opt.value}`).join(', '),
          'Quantity Available': variant.quantityAvailable,
          'Requires Shipping': variant.requiresShipping ? 'Yes' : 'No',
          'Weight': `${variant.weight} ${variant.weightUnit}`,
        });
      });
    } else {
      // Create a single row for products without variants
      flattenedRows.push({
        'Product ID': product.id,
        'Product Title': product.title,
        'Product Handle': product.handle, 
        'Product Type': product.productType,
        'Product Tags': product.tags.join(', '),
        'Product Vendor': product.vendor,
        'Product Available': product.availableForSale ? 'Yes' : 'No',
        'Total Inventory': product.totalInventory,
        'Min Price': `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`,
        'Max Price': `${product.priceRange.maxVariantPrice.amount} ${product.priceRange.maxVariantPrice.currencyCode}`,
        'Variant ID': '',
        'Variant Title': '',
        'Variant SKU': '',
        'Variant Available': '',
        'Variant Price': '',
        'Compare At Price': '',
        'Variant Options': '',
        'Quantity Available': '',
        'Requires Shipping': '',
        'Weight': '',
      });
    }
  });
  
  return flattenedRows;
};

// Generate CSV string from products data
export const generateCSV = (products: Product[]): string => {
  const flattenedData = flattenProductsForCSV(products);
  return stringify(flattenedData, { header: true });
};
