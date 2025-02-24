import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceMetricsProps {
  stockSymbol: string | null;
  stockPerformance: string | null;
  spyPerformance: string | null;
  loading: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  stockSymbol,
  stockPerformance,
  spyPerformance,
  loading,
}) => {
  const getPerformanceStyle = (performance: string | null) => {
    if (!performance) return '';
    const value = parseFloat(performance);
    if (value > 0) return 'text-green-500'; // Green
    if (value < 0) return 'text-red-500';   // Red
    return 'text-black';                   // Black
  };

  const getPerformanceIcon = (performance: string | null) => {
    if (!performance) return null;
    const value = parseFloat(performance);
    if (value > 0) {
      return <TrendingUp size={16} color="#4CAF50" style={{ marginLeft: '5px' }} />;
    } else if (value < 0) {
      return <TrendingDown size={16} color="#F44336" style={{ marginLeft: '5px' }} />;
    }
    return null; // No icon for 0
  };

  return (
    <div className="flex justify-center gap-16 mt-3 mb-3">
      {/* Stock Performance - Only show if stockSymbol exists */}
      {stockSymbol && (
        <div className="text-center">
          <div className="font-bold text-lg flex flex-row items-baseline gap-0.5 ">
            {loading ? (
              <div className="h-5 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
            ) : (
              `${stockSymbol}`
            )}
            <div className="font-normal text-sm text-gray-500">
          {loading ? (
            <div className="h-5 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
          ) : (
            'performance'
          )}
        </div>
          </div>
          <div
            className={`text-xl mt-2 flex items-center justify-center ${
              loading ? '' : getPerformanceStyle(stockPerformance)
            }`}
          >
            {loading ? (
              <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
            ) : (
              <>
                {stockPerformance}%{getPerformanceIcon(stockPerformance)}
              </>
            )}
          </div>
        </div>
      )}

      {/* SPY Performance */}
      <div className="text-center">
        <div className="font-bold text-lg flex flex-row items-baseline gap-0.5 ">
          {loading ? (
            <div className="h-5 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
          ) : (
            'S&P 500'
          )}
          <div className="font-normal text-sm text-gray-500">
          {loading ? (
            <div className="h-5 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
          ) : (
            'performance'
          )}
        </div>
        </div>
        <div
          className={`text-xl mt-2 flex items-center justify-center ${
            loading ? '' : getPerformanceStyle(spyPerformance)
          }`}
        >
          {loading ? (
            <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
          ) : (
            <>
              {spyPerformance}%{getPerformanceIcon(spyPerformance)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;