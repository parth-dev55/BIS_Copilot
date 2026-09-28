import React from 'react';

interface BisLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const BisLogo: React.FC<BisLogoProps> = ({ 
  size = 24, 
  className = "",
  showText = false 
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* BIS Emblem / Symbol: Stylized Standard Mark with #2F5FA7 blue & #F22D3A red */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Circular Shield / Border */}
        <circle cx="50" cy="50" r="46" stroke="#2F5FA7" strokeWidth="6" fill="#EAF1FA" />
        
        {/* Inner geometric standard mark - BIS triangle / stepped chevron with Red accent */}
        {/* Top chevron apex in red #F22D3A */}
        <path 
          d="M 50 16 L 76 56 H 24 Z" 
          fill="#2F5FA7" 
        />
        
        {/* Central Core Cutout / Diamond */}
        <polygon 
          points="50,30 64,52 36,52" 
          fill="#EAF1FA" 
        />

        {/* Central Red Standard Benchmark Bar / Dot (#F22D3A) */}
        <circle cx="50" cy="44" r="5.5" fill="#F22D3A" />

        {/* Bottom Stepped Tier / Base Bar in Primary Dark #244B85 */}
        <rect x="22" y="60" width="56" height="8" rx="2" fill="#244B85" />
        <rect x="30" y="71" width="40" height="6" rx="2" fill="#2F5FA7" />

        {/* Small Red Accent Point at base */}
        <circle cx="50" cy="83" r="3" fill="#F22D3A" />
      </svg>

      {showText && (
        <span className="font-bold tracking-tight text-[15px] text-[#111827]">
          BIS<span className="text-[#2F5FA7]">-GPT</span>
        </span>
      )}
    </div>
  );
};
