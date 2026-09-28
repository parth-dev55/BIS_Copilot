import React, { useState } from 'react';
import { 
  SquarePen, 
  Folder, 
  GitPullRequest, 
  Clock, 
  Cable, 
  Search, 
  Bell, 
  ChevronDown, 
  ArrowDownToLine,
  MessageSquarePlus,
  Trash2,
  History,
  ShieldCheck,
  FlaskConical,
  Award,
  BookOpen
} from 'lucide-react';
import { ChatSession } from '../types';
import { BisLogo } from './BisLogo';

interface SidebarProps {
  recents: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chat: ChatSession) => void;
  onNewChat: () => void;
  onOpenProjects: () => void;
  onOpenPullRequests: () => void;
  onOpenScheduled: () => void;
  onOpenPlugins: () => void;
  onOpenUserProfile: () => void;
  onOpenNotifications: () => void;
  onOpenBisTools: (tab?: 'standards' | 'schemes' | 'labs' | 'hallmarking') => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  recents,
  activeChatId,
  onSelectChat,
  onNewChat,
  onOpenProjects,
  onOpenPullRequests,
  onOpenScheduled,
  onOpenPlugins,
  onOpenUserProfile,
  onOpenNotifications,
  onOpenBisTools,
  onDeleteChat,
  isOpen
}) => {
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredRecents = searchQuery.trim() === ''
    ? recents
    : recents.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(searchQuery.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col h-full select-none shrink-0 transition-all duration-150">
      {/* Top Workspace / Brand Header with BIS Symbol */}
      <div className="pt-3 px-3 pb-2 flex items-center justify-between relative border-b border-[#E2E8F0]/60">
        <button
          onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
          className="flex items-center gap-2 px-1.5 py-1 -ml-1 rounded-lg hover:bg-[#EAF1FA] text-[#111827] font-semibold text-[15px] transition-colors"
        >
          <BisLogo size={22} />
          <span className="tracking-tight font-bold">
            BIS<span className="text-[#2F5FA7]">-GPT</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] mt-0.5" />
        </button>

        <div className="flex items-center gap-1 text-[#6B7280]">
          <button
            onClick={() => setIsSearching(!isSearching)}
            title="Search chats (Ctrl+K)"
            className={`p-1.5 rounded-md hover:bg-[#EAF1FA] hover:text-[#2F5FA7] transition-colors ${
              isSearching ? 'bg-[#EAF1FA] text-[#2F5FA7]' : ''
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="p-1.5 rounded-md hover:bg-[#EAF1FA] hover:text-[#2F5FA7] relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F22D3A] rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* Workspace Dropdown */}
        {isWorkspaceMenuOpen && (
          <div className="absolute top-11 left-3 w-56 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1 text-xs text-[#111827] z-50">
            <div className="px-3 py-1.5 font-semibold text-[11px] text-[#6B7280] uppercase tracking-wider">
              Workspaces
            </div>
            <button
              onClick={() => setIsWorkspaceMenuOpen(false)}
              className="w-full text-left px-3 py-2 hover:bg-[#EAF1FA] flex items-center justify-between font-semibold text-[#2F5FA7] bg-[#EAF1FA]/60"
            >
              <span>BIS-GPT Personal</span>
              <span className="text-[10px] bg-[#2F5FA7] text-white px-1.5 py-0.5 rounded font-medium">Active</span>
            </button>
            <button
              onClick={() => setIsWorkspaceMenuOpen(false)}
              className="w-full text-left px-3 py-2 hover:bg-[#EAF1FA] text-[#6B7280]"
            >
              BIS Team Enterprise
            </button>
            <div className="h-[1px] bg-[#E2E8F0] my-1" />
            <button
              onClick={() => setIsWorkspaceMenuOpen(false)}
              className="w-full text-left px-3 py-1.5 hover:bg-[#EAF1FA] text-[#6B7280]"
            >
              + Add Workspace...
            </button>
          </div>
        )}
      </div>

      {/* Quick Search bar if expanded */}
      {isSearching && (
        <div className="px-3 pt-2 pb-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recents..."
            autoFocus
            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg outline-none focus:border-[#2F5FA7] focus:ring-1 focus:ring-[#2F5FA7] text-[#111827] placeholder-[#6B7280]"
          />
        </div>
      )}

      {/* Core Nav Actions */}
      <div className="px-2 space-y-0.5 mt-2">
        {/* New Chat */}
        <button
          onClick={onNewChat}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-colors group ${
            activeChatId === null 
              ? 'bg-[#EAF1FA] text-[#2F5FA7] font-semibold border-l-2 border-[#2F5FA7]' 
              : 'text-[#111827] hover:bg-[#EAF1FA]/70 hover:text-[#2F5FA7]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SquarePen className={`w-4 h-4 ${activeChatId === null ? 'text-[#2F5FA7]' : 'text-[#6B7280]'}`} />
            <span>New chat</span>
          </div>
          <MessageSquarePlus className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2F5FA7]" />
        </button>

        {/* BIS Standards Directory */}
        <button
          onClick={() => onOpenBisTools('standards')}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-[#111827] hover:text-[#2F5FA7] hover:bg-[#EAF1FA]/70 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#2F5FA7]" />
          <span>Standards & QCOs</span>
        </button>

        {/* Certification Schemes */}
        <button
          onClick={() => onOpenBisTools('schemes')}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-[#6B7280] hover:text-[#2F5FA7] hover:bg-[#EAF1FA]/70 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-[#6B7280]" />
          <span>Certification Guide</span>
        </button>

        {/* Testing Labs */}
        <button
          onClick={() => onOpenBisTools('labs')}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-[#6B7280] hover:text-[#2F5FA7] hover:bg-[#EAF1FA]/70 transition-colors"
        >
          <FlaskConical className="w-4 h-4 text-[#6B7280]" />
          <span>Recognized Labs</span>
        </button>

        {/* Gold Hallmarking */}
        <button
          onClick={() => onOpenBisTools('hallmarking')}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-[#6B7280] hover:text-amber-700 hover:bg-amber-50/70 transition-colors"
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>Gold Hallmarking</span>
        </button>
      </div>

      {/* Recents / History Section */}
      <div className="flex-1 overflow-y-auto px-2 mt-3 space-y-0.5 min-h-[120px]">
        <div className="px-2.5 py-1 text-xs font-semibold text-[#6B7280] flex items-center justify-between uppercase tracking-wider text-[11px]">
          <span>Recents</span>
          {filteredRecents.length > 0 && (
            <span className="text-[10px] text-[#2F5FA7] bg-[#EAF1FA] px-1.5 py-0.2 rounded font-mono font-medium">
              {filteredRecents.length}
            </span>
          )}
        </div>

        {filteredRecents.length === 0 ? (
          <div className="px-3 py-6 text-xs text-[#6B7280] text-center flex flex-col items-center gap-1.5">
            <History className="w-4 h-4 text-[#94a3b8]" />
            <span>No previous chats</span>
          </div>
        ) : (
          filteredRecents.map((item) => {
            const isActive = activeChatId === item.id;
            const isHovered = hoveredId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group"
              >
                <button
                  onClick={() => onSelectChat(item)}
                  title={item.title}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#EAF1FA] text-[#2F5FA7] font-semibold border-l-2 border-[#2F5FA7]'
                      : 'text-[#111827] hover:text-[#2F5FA7] hover:bg-[#EAF1FA]/60'
                  }`}
                >
                  <span className="truncate pr-2">{item.title}</span>
                  {isHovered && (
                    <span 
                      onClick={(e) => onDeleteChat(item.id, e)}
                      title="Delete chat"
                      className="p-1 hover:text-[#F22D3A] rounded shrink-0 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-[#6B7280] hover:text-[#F22D3A]" />
                    </span>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer: Parth Chaudhari Profile & Blue Download button */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
        <button
          onClick={onOpenUserProfile}
          className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity"
        >
          {/* Avatar PC in dark blue circle #244B85 */}
          <div className="w-7 h-7 rounded-full bg-[#244B85] text-white flex items-center justify-center text-xs font-semibold shrink-0 ring-2 ring-[#EAF1FA]">
            PC
          </div>
          <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2F5FA7] transition-colors truncate max-w-[120px]">
            Parth Chaudhari
          </span>
        </button>

        {/* Download update button in PRIMARY #2F5FA7 hover #244B85 */}
        <button
          onClick={() => {
            alert('BIS-GPT Desktop is up to date (v2.4.0-stable). Ready for local workspace integration.');
          }}
          title="Download desktop update / Synchronized"
          className="w-7 h-7 rounded-full bg-[#2F5FA7] hover:bg-[#244B85] text-white flex items-center justify-center transition-colors shadow-sm"
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
