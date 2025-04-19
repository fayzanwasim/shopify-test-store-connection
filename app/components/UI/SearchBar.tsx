import { FaSearch } from "react-icons/fa";

// SearchBar component
export const SearchBar = ({ 
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