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

// Transform GraphQL response to a flat structure
export const transformProductsData = (data: any): Product[] => {
  return data.products.edges.map((edge: any) => {
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
      images: node.images?.edges.map((imgEdge: any) => imgEdge.node) || [],
      variants: node.variants?.edges.map((varEdge: any) => varEdge.node) || [],
      totalInventory: node.totalInventory,
      availableForSale: node.availableForSale,
      priceRange: node.priceRange,
    };
  });
};

// Create a flattened view for CSV export
export const flattenProductsForCSV = (products: Product[]) => {
  const flattenedRows: any[] = [];
  
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
