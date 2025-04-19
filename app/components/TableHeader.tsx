import { FaSort } from 'react-icons/fa';

// TableHeader component for sortable column headers
export const TableHeader = ({ 
  title, 
  field, 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  title: string; 
  field: string; 
  sortField: string | null; 
  sortDirection: 'asc' | 'desc'; 
  onSort: (field: string) => void;
}) => (
  <th 
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center">
      {title}
      {sortField === field && (
        <FaSort className={`ml-1 text-${sortDirection === 'asc' ? 'gray' : 'blue'}-500`} />
      )}
    </div>
  </th>
);