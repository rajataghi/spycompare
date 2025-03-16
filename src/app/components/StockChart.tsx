import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import PerformanceMetrics from './PerformanceMetrics';

interface StockChartProps {
  data: Array<{ date: string; stock: number; spy: number }>;
  stockSymbol: string | null;
  loading: boolean;
}

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM-yy');
};

const formatTooltipDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const formatYAxisTick = (tick: number) => {
  return `$${tick.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
        <p className="font-medium mb-2 text-gray-900 dark:text-gray-100">{formatTooltipDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, stockSymbol, loading }) => {
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y'>('5Y');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date();

    function subtractYears(years: number) {
      const d = new Date();
      d.setFullYear(d.getFullYear() - years);
      d.setMonth(d.getMonth());
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }

    const result = (() => {
      switch (timeRange) {
        case '1Y':
          return data.filter((d) => new Date(d.date).getTime() >= subtractYears(1));
        case '3Y':
          return data.filter((d) => new Date(d.date).getTime() >= subtractYears(3));
        case '5Y':
          return data.filter((d) => new Date(d.date).getTime() >= subtractYears(5));
        default:
          return data;
      }
    })();

    const sortedData = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sortedData.length > 0) {
      const initialSpyPrice = sortedData[0].spy;
      const initialStockPrice = sortedData[0]?.stock || 1;

      return sortedData.map((d) => ({
        date: d.date,
        stock: stockSymbol ? parseFloat(((d.stock / initialStockPrice) * 1000).toFixed(2)) : null,
        spy: parseFloat(((d.spy / initialSpyPrice) * 1000).toFixed(2)),
      }));
    }

    return sortedData;
  }, [data, timeRange, stockSymbol]);

  const performance = useMemo(() => {
    if (filteredData.length > 1) {
      const initial = filteredData[0];
      const latest = filteredData[filteredData.length - 1];

      let stockPerformance;
      if (!latest.stock || !initial.stock || !stockSymbol) {
        stockPerformance = null;
      } else {
        stockPerformance = ((latest.stock - initial.stock) / initial.stock) * 100;
      }

      const spyPerformance = ((latest.spy - initial.spy) / initial.spy) * 100;

      return {
        stockPerformance: stockPerformance,
        spyPerformance: spyPerformance
      };
    }

    return {
      stockPerformance: null,
      spyPerformance: 0
    };
  }, [filteredData, stockSymbol]);

  const yDomain = useMemo(() => {
    if (filteredData.length === 0) return [0, 1000];

    const allValues: number[] = filteredData.flatMap((d) => [d.stock, d.spy].filter((v) => v !== null));
    const minValue = Math.floor(Math.min(...allValues) / 100) * 100;
    const maxValue = Math.ceil(Math.max(...allValues) / 100) * 100;

    const lowerBound = Math.max(minValue - 100, 0);
    const upperBound = Math.max(maxValue + 100, 1000);

    return [lowerBound, upperBound];
  }, [filteredData]);

  const renderColorfulLegendText = (value: string, entry: any) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  };

  return (
    <div className="w-full px-4">
      <PerformanceMetrics
        stockSymbol={stockSymbol}
        stockPerformance={performance.stockPerformance}
        spyPerformance={performance.spyPerformance}
        loading={loading}
      />

      <div className="w-full mt-8 h-[400px] md:h-[500px] bg-white dark:bg-gray-800 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            {stockSymbol && (
              <Line
                type="monotone"
                dataKey="stock"
                stroke="#60a5fa"
                name={`Returns on $1000 (${stockSymbol})`}
                dot={false}
                activeDot={{ r: 4 }}
                strokeWidth={2}
              />
            )}
            <Line
              type="monotone"
              dataKey="spy"
              stroke="#34d399"
              name="Returns on $1000 (SPY)"
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={2}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={Math.ceil(filteredData.length / (isMobile ? 4 : 8)) - 1}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-300"
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              domain={yDomain}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-300"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={renderColorfulLegendText}
              wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {['1Y', '3Y', '5Y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as '1Y' | '3Y' | '5Y')}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${timeRange === range
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockChart;
