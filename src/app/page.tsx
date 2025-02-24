'use client'

import React, { useState, useEffect } from 'react';
import SearchBar from '../app/components/SearchBar';
import StockChart from '../app/components/StockChart';
import { getFromCache, setInCache } from '@/lib/cache';
import axios from 'axios';
import MyAppBar from './components/AppBar';

const SPY_SYMBOL = 'SPY';

const Home = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  // @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error handling
  const [isClient, setIsClient] = useState(false); // New state to track if it's client-side

  // Set isClient to true once the component has mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch stock data when selectedSymbol changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        let stockData: any[] = [];
        let spyData: any[] = [];

        if (selectedSymbol) {
          // Check cache first for selected symbol
          const cachedDataForSymbol: any = getFromCache(selectedSymbol);
          const cachedDataForSpy: any = getFromCache(SPY_SYMBOL);

          if (cachedDataForSymbol) {
            console.log('Using cached data for', selectedSymbol);
            stockData = cachedDataForSymbol.arr;
          } else {
            console.log('Fetching new data for', selectedSymbol);
            const stockResponse = await axios.get(`/api/stocks?symbol=${selectedSymbol}`);
            stockData = stockResponse.data.data;
            setInCache(selectedSymbol, { arr: stockData });
          }

          if (cachedDataForSpy) {
            console.log('Using cached data for', SPY_SYMBOL);
            spyData = cachedDataForSpy.arr;
          } else {
            console.log('Fetching new data for', SPY_SYMBOL);
            const spyResponse = await axios.get(`/api/stocks?symbol=${SPY_SYMBOL}`);
            spyData = spyResponse.data.data;
            setInCache(SPY_SYMBOL, { arr: spyData });
          }

          // Combine data with length safety
          const minLength = Math.min(stockData.length, spyData.length);
          const combinedData = Array.from({ length: minLength }, (_, index) => ({
            date: stockData[index].date,
            stock: stockData[index].stock,
            spy: spyData[index].stock,
          }));

          setChartData(combinedData); // Update chart data with the combined data
        } else {
          // If no symbol is selected, load only SPY data
          const cachedDataForSpy: any = getFromCache(SPY_SYMBOL);
          if (cachedDataForSpy) {
            console.log('Using cached data for SPY');
            spyData = cachedDataForSpy.arr;
          } else {
            console.log('Fetching new data for SPY');
            const spyResponse = await axios.get(`/api/stocks?symbol=${SPY_SYMBOL}`);
            spyData = spyResponse.data.data;
            setInCache(SPY_SYMBOL, { arr: spyData });
          }

          // Create default dataset with only SPY data
          const spyCombinedData = spyData.map((data: any) => ({
            date: data.date,
            stock: 0, // No stock data, just SPY
            spy: data.stock,
          }));

          setChartData(spyCombinedData); // Update chart data with only SPY
        }
      } catch (err) {
        setError('Error fetching stock data. Please enter valid symbol or try again later.');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [selectedSymbol]); // Only fetch when selectedSymbol changes

  // Handle search and set the selected symbol
  const handleSearch = (symbol: string) => {
    setSelectedSymbol(symbol);
    setChartData([]); // Clear chart data when the symbol changes to avoid showing old data
  };

  // Ensure that content only renders once on the client to avoid hydration issues
  if (!isClient) {
    return null; // Prevent rendering the component on the server side
  }

  return (
    <div style={{ padding: '20px' }}>
      <MyAppBar />
      <SearchBar onSearch={handleSearch} />
      
      {/* Spacer */}
      <div style={{ margin: '60px 0' }}></div>

      {/* {loading && !error && (
        <p>Loading...</p> // Show loading message only if there's no error
      )} */}

      {error ? (
        <p style={{ color: 'red' }}>{error}</p> // Show error message only if there's an error
      ) : (
        <StockChart
          data={chartData}
          stockSymbol={selectedSymbol}
          loading={loading}
        />
      )}
      
      {/* Display 'No data' message only when there's no chart data and not loading */}
      {chartData.length === 0 && !loading && !error && (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default Home;