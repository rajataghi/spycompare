import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceMetricsProps {
  stockPerformance: number | null;
  spyPerformance: number | null;
  loading: boolean;
  stockSymbol: string | null;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  stockPerformance,
  spyPerformance,
  loading,
  stockSymbol,
}) => {
  const getPerformanceStyle = (performance: number | null) => {
    if (performance === null) return 'text-gray-900 dark:text-gray-100';
    if (performance > 0) return 'text-green-600 dark:text-green-400';
    if (performance < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-900 dark:text-gray-100';
  };

  const getPerformanceIcon = (performance: number | null) => {
    if (performance === null) return null;
    if (performance > 0) {
      return <TrendingUp className="ml-1" size={16} color="currentColor" />;
    }
    if (performance < 0) {
      return <TrendingDown className="ml-1" size={16} color="currentColor" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-16 mt-3 mb-3 px-4">
      {/* Stock Performance - Only show if stockSymbol exists */}
      {stockSymbol && (
        <div className="text-center">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
            {stockSymbol} Performance
          </h3>
          <div
            className={`flex items-center justify-center mt-2 text-lg sm:text-xl ${loading ? '' : getPerformanceStyle(stockPerformance)
              }`}
          >
            {loading ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded"></div>
            ) : (
              <>
                {stockPerformance !== null
                  ? `${stockPerformance > 0 ? '+' : ''}${stockPerformance.toFixed(2)}%`
                  : 'N/A'}
                {getPerformanceIcon(stockPerformance)}
              </>
            )}
          </div>
        </div>
      )}

      {/* SPY Performance */}
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          S&P 500 Performance
        </h3>
        <div
          className={`flex items-center justify-center mt-2 text-lg sm:text-xl ${loading ? '' : getPerformanceStyle(spyPerformance)
            }`}
        >
          {loading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded"></div>
          ) : (
            <>
              {spyPerformance !== null
                ? `${spyPerformance > 0 ? '+' : ''}${spyPerformance.toFixed(2)}%`
                : 'N/A'}
              {getPerformanceIcon(spyPerformance)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;