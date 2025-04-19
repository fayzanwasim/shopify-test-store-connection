import React, { useState } from 'react';
import { Product } from '../utils/data-export';
import { TableHeader } from './TableHeader';
import { FaFileCsv, FaSearch, FaSort, FaSync } from 'react-icons/fa';

interface ProductsTableProps {
  products: Product[];
  onExportCSV: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

// SearchBar component
const SearchBar = ({ 
  searchTerm, 
  setSearchTerm 
}: { 
  searchTerm: string; 
  setSearchTerm: (term: string) => void;
}) => (
  <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search products..."
      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

// TableActions component
const TableActions = ({ 
  onRefresh, 
  onExportCSV, 
  isLoading 
}: { 
  onRefresh: () => void; 
  onExportCSV: () => void; 
  isLoading: boolean;
}) => (
  <div className="flex space-x-2">
    <button
      onClick={onRefresh}
      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
      disabled={isLoading}
    >
      <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
    </button>
    <button
      onClick={onExportCSV}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
    >
      <FaFileCsv className="mr-2" /> Export CSV
    </button>
  </div>
);

// ProductVariantsTable component
const ProductVariantsTable = ({ variants }: { variants: any[] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Inventory</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Options</th>
        </tr>
      </thead>
      <tbody>
        {variants.map((variant) => (
          <tr key={variant.id} className="border-b border-gray-100">
            <td className="px-4 py-2 text-sm">{variant.title}</td>
            <td className="px-4 py-2 text-sm">{variant.sku || 'N/A'}</td>
            <td className="px-4 py-2 text-sm">
              {variant.price.amount} {variant.price.currencyCode}
              {variant.compareAtPrice && (
                <span className="line-through text-gray-400 ml-2">
                  {variant.compareAtPrice.amount} {variant.compareAtPrice.currencyCode}
                </span>
              )}
            </td>
            <td className="px-4 py-2 text-sm">{variant.quantityAvailable}</td>
            <td className="px-4 py-2 text-sm">
              {variant.selectedOptions.map((opt: { name: string; value: string }) => 
                `${opt.name}: ${opt.value}`
              ).join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ProductRow component
const ProductRow = ({ 
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

// LoadingSpinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// EmptyState component
const EmptyState = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <p className="text-gray-500">No products found. Connect to your Shopify store to fetch products.</p>
  </div>
);

export default function ProductsTable({ products, onExportCSV, onRefresh, isLoading }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Search filter
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'vendor':
        comparison = a.vendor.localeCompare(b.vendor);
        break;
      case 'type':
        comparison = a.productType.localeCompare(b.productType);
        break;
      case 'price':
        comparison = 
          parseFloat(a.priceRange.minVariantPrice.amount) - 
          parseFloat(b.priceRange.minVariantPrice.amount);
        break;
      case 'inventory':
        comparison = a.totalInventory - b.totalInventory;
        break;
      case 'variants':
        comparison = a.variants.length - b.variants.length;
        break;
      default:
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleProductExpansion = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TableActions 
          onRefresh={onRefresh} 
          onExportCSV={onExportCSV} 
          isLoading={isLoading} 
        />
      </div>
      
      <div className="overflow-x-auto text-gray-900">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader title="Product Name" field="title" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader title="Vendor" field="vendor" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader title="Type" field="type" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader title="Price" field="price" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader title="Inventory" field="inventory" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader title="Variants" field="variants" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                isExpanded={expandedProductId === product.id}
                onToggle={() => toggleProductExpansion(product.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
} 