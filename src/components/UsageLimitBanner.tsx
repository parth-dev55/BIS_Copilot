import React from 'react';
import { Gauge, X } from 'lucide-react';

interface UsageLimitBannerProps {
  onTryPlus: () => void;
  onDismiss?: () => void;
}

export const UsageLimitBanner: React.FC<UsageLimitBannerProps> = ({ onTryPlus, onDismiss }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] border-l-4 border-l-[#F22D3A] p-3 px-4 flex items-center justify-between shadow-[0_2px_6px_rgba(47,95,167,0.04)] transition-all">
      {/* Left icon and message */}
      <div className="flex items-center gap-3">
        <div className="text-[#F22D3A] shrink-0 p-1.5 bg-[#F22D3A]/10 rounded-xl">
          <Gauge className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#111827]">
            You're out of BIS-GPT and Work usage
          </span>
          <span className="text-xs text-[#6B7280] mt-0.5">
            Try Plus for more now, or wait for usage to reset on Oct 5, 1:14 PM
          </span>
        </div>
      </div>

      {/* Right Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTryPlus}
          className="bg-[#2F5FA7] hover:bg-[#244B85] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap shadow-sm shadow-[#2F5FA7]/20"
        >
          Try Plus
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            title="Dismiss notification"
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
