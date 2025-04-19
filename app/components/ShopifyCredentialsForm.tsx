import React from 'react';

interface ShopifyConnectionStatusProps {
  isLoading: boolean;
  productCount: number;
  error: string | null;
}

export default function ShopifyConnectionStatus({ isLoading, productCount, error }: ShopifyConnectionStatusProps) {
  const domain = process.env.SHOPIFY_DOMAIN;
  const isConnected = !isLoading && !error && productCount > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6 text-gray-900">
      <h2 className="text-xl font-semibold mb-4">Shopify Connection Status</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>Error: {error}</p>
          <p className="mt-2 text-sm">
            Please check your environment variables and make sure they are properly configured.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Connecting to Shopify...</span>
        </div>
      )}

      {isConnected && (
        <div>
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="font-medium text-green-600">Connected to Shopify</span>
          </div>
          <p className="text-gray-600">Store: {domain}</p>
          <p className="text-gray-600">Products found: {productCount}</p>
        </div>
      )}

      {!isLoading && !error && productCount === 0 && (
        <div>
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="font-medium text-yellow-600">Connected, but no products found</span>
          </div>
          <p className="text-gray-600">Store: {domain}</p>
          <p className="text-gray-600">No products were found in this store.</p>
        </div>
      )}
    </div>
  );
} 