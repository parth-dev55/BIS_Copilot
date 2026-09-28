import React from 'react';

export const CloudTerminalIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-20 h-20 text-[#2F5FA7]",
  size = 72
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cloud Outline in PRIMARY #2F5FA7 with soft PRIMARY LIGHT #EAF1FA fill */}
      <path
        d="M 32 68 
           H 78 
           C 89 68 97 59 95 48 
           C 94 38 86 32 77 32 
           C 76 21 66 12 53 12 
           C 42 12 32 19 30 30 
           C 21 30 14 38 14 48 
           C 14 59 22 68 32 68 Z"
        stroke="#2F5FA7"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#EAF1FA"
        fillOpacity="0.5"
      />
      {/* >_ terminal prompt inside */}
      {/* > bracket in #2F5FA7 */}
      <path
        d="M 42 39 L 52 47 L 42 55"
        stroke="#2F5FA7"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* _ underscore cursor in ACCENT RED #F22D3A (matching BIS symbol mark) */}
      <path
        d="M 58 55 L 68 55"
        stroke="#F22D3A"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

