import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
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
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      <div ref={searchBarRef} style={{ width: '33%', display: 'flex', position: 'relative' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter stock symbol (e.g., AAPL)"
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#2563eb',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Compare
        </button>

        {/* Suggestions Dropdown */}
{suggestions.length > 0 && (
  <ul
    style={{
      position: 'absolute',
      top: '100%',
      left: '0',
      width: '100%',
      maxHeight: '200px',
      overflowY: 'auto',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '5px',
      padding: '0',
      listStyleType: 'none',
      zIndex: 1000, // Ensures dropdown stays above the graph
      pointerEvents: 'auto', // Allows interactions with the dropdown
    }}
  >
    {suggestions.map((item, index) => (
      <li
        key={index}
        style={{
          padding: '10px',
          cursor: 'pointer',
          backgroundColor: '#fff', // Ensure plain white background
          transition: 'background-color 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
        onClick={() => {
          onSearch(item.symbol);
          setInputValue(item.symbol); // Set symbol to input
          setSuggestions([]); // Clear suggestions
        }}
      >
        {item.symbol} - {item.description}
      </li>
    ))}
  </ul>
)}

      </div>
    </div>
  );
};

export default SearchBar;