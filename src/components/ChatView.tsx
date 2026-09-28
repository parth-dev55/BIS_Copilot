import React from 'react';
import { ChatSession } from '../types';
import { 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Search 
} from 'lucide-react';
import { GoogleIcon } from './GoogleIcon';

interface ChatViewProps {
  session: ChatSession;
  onApproveAction?: () => void;
  isExecuting?: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({ session, isExecuting = false }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Session Title & Metadata Header */}
      <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111827] tracking-tight">
            {session.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-1">
            <span className="font-mono bg-[#EAF1FA] text-[#2F5FA7] px-2 py-0.5 rounded font-semibold">
              {session.project}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              {session.model.includes('Google') && <GoogleIcon size={12} />}
              <span>Model: {session.model}</span>
            </span>
            <span>·</span>
            <span>{session.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-6">
        {session.messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="font-semibold text-[#111827]">
                  {isUser ? 'Parth Chaudhari' : 'BIS-GPT Assistant'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

                {/* Message Bubble / Content */}
              <div
                className={`text-[14px] leading-relaxed max-w-3xl rounded-2xl p-4 ${
                  isUser
                    ? 'bg-[#EAF1FA] text-[#111827] border border-[#2F5FA7]/20 rounded-tr-sm shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#111827] shadow-sm rounded-tl-sm w-full'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Google Search Grounding Section */}
                {msg.searchGrounding && (
                  <div className="mt-3.5 pt-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#111827]">
                      <GoogleIcon size={14} />
                      <span className="text-[#2F5FA7]">Search Grounded with Google (gemini-3.5-flash)</span>
                    </div>

                    {/* Search queries used */}
                    {msg.searchGrounding.queries && msg.searchGrounding.queries.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="text-[11px] font-medium text-[#6B7280]">Searched:</span>
                        {msg.searchGrounding.queries.map((q, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569]">
                            <Search className="w-3 h-3 text-[#2F5FA7]" />
                            <span>"{q}"</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Grounding Source Link Cards */}
                    {msg.searchGrounding.sources && msg.searchGrounding.sources.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                          Verified Web Sources ({msg.searchGrounding.sources.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.searchGrounding.sources.map((src, idx) => {
                            let hostname = src.url;
                            try {
                              hostname = new URL(src.url).hostname;
                            } catch {
                              hostname = src.url;
                            }
                            return (
                              <a
                                key={idx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EAF1FA] hover:border-[#2F5FA7]/40 transition-all text-xs group"
                              >
                                <div className="p-1 rounded-lg bg-white text-[#2F5FA7] border border-[#E2E8F0] shrink-0 mt-0.5 shadow-2xs">
                                  <Globe className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-[#111827] group-hover:text-[#2F5FA7] transition-colors truncate">
                                    {src.title}
                                  </div>
                                  <div className="text-[11px] text-[#6B7280] truncate font-mono mt-0.5 flex items-center gap-1">
                                    <span>{hostname}</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2F5FA7]" />
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isExecuting && (
          <div className="flex items-center gap-3 p-4 bg-white border border-[#E2E8F0] rounded-2xl max-w-xl shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-[#2F5FA7] animate-spin" />
            <div className="text-xs text-[#6B7280]">
              BIS-GPT is analyzing workspace and executing instructions...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
