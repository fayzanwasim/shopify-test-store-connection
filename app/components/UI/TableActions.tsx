import { FaSync, FaFileCsv } from "react-icons/fa";

// TableActions component
export const TableActions = ({ 
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
