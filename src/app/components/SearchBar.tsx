import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]); // To store symbol suggestions
  const searchBarRef = useRef<HTMLDivElement>(null); // Ref to the search bar container

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim().toUpperCase());
      setInputValue(''); // Clear the input after search
      setSuggestions([]); // Clear suggestions on search
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 1) {
      try {
        // Fetch symbol search suggestions from Finnhub API
        const response = await axios.get(`/api/symbol-search?symbol=${value}`);
        setSuggestions(response.data.result || []);
      } catch (error) {
        console.error('Error fetching symbol suggestions:', error);
      }
    } else {
      setSuggestions([]); // Clear suggestions when input is too short
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Hide suggestions when clicking outside of the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setSuggestions([]); // Clear suggestions when clicking outside
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center px-4 mb-2">
      <div ref={searchBarRef} className="relative w-full max-w-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md
                     hover:bg-blue-700 dark:hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-900 disabled:opacity-50
                     transition-colors duration-200"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto 
                        bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                        rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.symbol}
                onClick={() => {
                  onSearch(suggestion.symbol);
                  setInputValue(suggestion.symbol);
                  setSuggestions([]);
                }}
                className={`px-4 py-2 cursor-pointer 
                          ${index > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          text-gray-900 dark:text-gray-100`}
              >
                <div className="font-medium">{suggestion.symbol}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{suggestion.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;