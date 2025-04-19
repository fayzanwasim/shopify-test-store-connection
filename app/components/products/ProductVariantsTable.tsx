import { Product } from '../../utils/data-export';

// ProductVariantsTable component
export const ProductVariantsTable = ({ variants }: { variants: Product['variants'] }) => (
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