import React from 'react';
import { Product } from '../utils/data-export';
import { ProductVariantsTable } from './ProductVariantsTable';

// ProductRow component
export const ProductRow = ({ 
  product, 
  isExpanded, 
  onToggle 
}: { 
  product: Product; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => (
  <React.Fragment>
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={onToggle}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              className="h-10 w-10 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No img</span>
            </div>
          )}
          <div className="font-medium text-gray-900">{product.title}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.vendor}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.productType || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount 
          ? `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`
          : `${product.priceRange.minVariantPrice.amount} - ${product.priceRange.maxVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`
        }
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.totalInventory}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.variants.length}
      </td>
    </tr>
    {isExpanded && (
      <tr>
        <td colSpan={6} className="px-6 py-4 bg-gray-50">
          <div className="border-t border-b border-gray-200 py-4">
            <h3 className="font-semibold text-lg mb-2">Variants</h3>
            <ProductVariantsTable variants={product.variants} />
          </div>
        </td>
      </tr>
    )}
  </React.Fragment>
);
