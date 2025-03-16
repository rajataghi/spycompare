import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M3 17L7 13L11 17L17 11L21 15"
                className="stroke-blue-600 dark:stroke-blue-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17 11L13 7L9 11L7 9L3 13"
                className="stroke-green-500 dark:stroke-green-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="12"
                r="11"
                className="stroke-gray-700 dark:stroke-gray-300"
                strokeWidth="2"
            />
        </svg>
    );
};

export default Logo; 