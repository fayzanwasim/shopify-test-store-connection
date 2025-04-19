'use client';

import { useState, useEffect } from 'react';
import ProductsTable from './components/ProductsTable';
import ShopifyConnectionStatus from './components/ShopifyCredentialsForm';
import { Product } from './utils/data-export';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'json' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  // Load products automatically when the page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'csv' }),
      });

      if (!response.ok) {
        throw new Error('Failed to export CSV file');
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a link to download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shopify-products.csv';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError('Failed to export CSV file');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-12 bg-gray-100">
      <div className="w-full max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopify Product Data Explorer</h1>
          <p className="text-gray-600">
            View, analyze, and export product data including variants and inventory.
          </p>
        </header>

        <ShopifyConnectionStatus 
          isLoading={isLoading} 
          productCount={products.length} 
          error={error} 
        />

        <ProductsTable 
          products={products} 
          onExportCSV={handleExportCSV}
          onRefresh={fetchProducts}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
