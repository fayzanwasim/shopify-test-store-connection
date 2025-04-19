import React, { useState } from 'react';
import { Product } from '../../utils/data-export';
import { TableHeader } from '../UI/TableHeader';
import { SearchBar } from '../UI/SearchBar';
import { TableActions } from '../UI/TableActions';
import { ProductRow } from './ProductRow';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { EmptyState } from '../UI/EmptyState';

interface ProductsTableProps {
  products: Product[];
  onExportCSV: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

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