import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import PerformanceMetrics from './PerformanceMetrics';

interface StockChartProps {
  data: Array<{ date: string; stock: number; spy: number }>;
  stockSymbol: string | null;
  loading: boolean;
}

const formatDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

const formatYAxisTick = (tick: number) => {
  return `$${tick.toFixed(0)}`;
};

const StockChart: React.FC<StockChartProps> = ({ data, stockSymbol, loading }) => {
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y'>('5Y');

  const filteredData = useMemo(() => {
    const now = new Date();

    function subtractYears(years: number) {
      const d = new Date();
      d.setFullYear(d.getFullYear() - years);
      d.setMonth(d.getMonth()); // Ensure we stay in the same month
      d.setDate(1);  // Set to the first day of the month
      d.setHours(0, 0, 0, 0); // Reset time to midnight
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
      const initialStockPrice = sortedData[0]?.stock || 1; // Use 1 to prevent NaN for SPY-only data

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
      if(!latest.stock || !initial.stock || !stockSymbol) {
        stockPerformance = null;
      } else {
        stockPerformance =((latest.stock - initial.stock) / initial.stock)*100;
      }

      const spyPerformance = ((latest.spy - initial.spy) / initial.spy) * 100;

      return {
        stockPerformance: stockPerformance ? stockPerformance.toFixed(2) : 'N/A',
        spyPerformance: spyPerformance.toFixed(2),
      };
    }

    return {
      stockPerformance: 'N/A',
      spyPerformance: '0.00',
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
    return <span style={{ color, marginRight: '20px' }}>{value}</span>;
  };

  return (
    <div>
      <PerformanceMetrics
        stockSymbol={stockSymbol}
        stockPerformance={performance.stockPerformance}
        spyPerformance={performance.spyPerformance}
        loading={loading}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <LineChart width={1000} height={500} data={filteredData}>
          {stockSymbol && (
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#2563eb"
              name={`Returns on $1000 (${stockSymbol})`}
            />
          )}
          <Line
            type="monotone"
            dataKey="spy"
            stroke="#82ca9d"
            name="Returns on $1000 (SPY)"
          />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis tickFormatter={formatYAxisTick} domain={yDomain} />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="left"
            iconType="line"
            formatter={renderColorfulLegendText}
          />
        </LineChart>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {['1Y', '3Y', '5Y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as '1Y' | '3Y' | '5Y')}
            style={{
              margin: '0 8px',
              padding: '4px 20px',
              background: '#ebebeb',
              color: timeRange === range ? '#2563eb' : '#000',
              border: timeRange === range ? '2px solid #2563eb' : '2px solid #ebebeb',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockChart;
