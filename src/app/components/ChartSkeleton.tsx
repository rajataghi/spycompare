import React from 'react';

const ChartSkeleton: React.FC = () => {
    return (
        <div className="w-full px-4">
            {/* Performance Metrics Skeleton */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-16 mt-3 mb-3 px-4">
                <div className="text-center">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 mx-auto"></div>
                    <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                </div>
                <div className="text-center">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 mx-auto"></div>
                    <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                </div>
            </div>

            {/* Chart Area Skeleton */}
            <div className="w-full mt-8 h-[400px] md:h-[500px] bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="w-full h-full flex flex-col">
                    {/* Y-axis */}
                    <div className="flex h-full">
                        <div className="w-12 h-full flex flex-col justify-between py-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            ))}
                        </div>
                        {/* Chart Area */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 grid grid-cols-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="border-t border-gray-200 dark:border-gray-700"></div>
                                ))}
                            </div>
                            {/* Animated loading line */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="h-1 bg-blue-200 dark:bg-blue-700 rounded animate-pulse transform translate-y-1/2 w-full"></div>
                            </div>
                        </div>
                    </div>
                    {/* X-axis */}
                    <div className="h-8 flex justify-between mt-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Time Range Buttons Skeleton */}
            <div className="flex justify-center gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
            </div>
        </div>
    );
};

export default ChartSkeleton; 