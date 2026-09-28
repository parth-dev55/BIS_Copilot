import React, { useState, useRef, useEffect } from 'react';
import { 
  PanelLeft, 
  ArrowLeft, 
  ArrowRight, 
  Minus, 
  Square, 
  X, 
  PanelRight, 
  Check,
  Maximize2
} from 'lucide-react';

interface TopWindowBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onToggleRightPanel: () => void;
  isRightPanelOpen: boolean;
  onNewChat: () => void;
  onOpenProjects: () => void;
  onOpenAbout: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export const TopWindowBar: React.FC<TopWindowBarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onToggleRightPanel,
  isRightPanelOpen,
  onNewChat,
  onOpenProjects,
  onOpenAbout,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="h-10 bg-[#f9f9fb] border-b border-[#e5e7eb] flex items-center justify-between px-3 select-none text-xs text-[#52525b] z-30 shrink-0">
      {/* Left zone: Sidebar toggle, nav arrows, window menus */}
      <div className="flex items-center gap-1.5" ref={menuRef}>
        {/* Sidebar Toggle Icon */}
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)"}
          className={`p-1.5 rounded hover:bg-[#edeef0] text-[#52525b] hover:text-[#18181b] transition-colors ${
            !isSidebarOpen ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Back Arrow */}
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          title="Back"
          className={`p-1.5 rounded transition-colors ${
            canGoBack 
              ? 'hover:bg-[#edeef0] text-[#52525b] hover:text-[#18181b] cursor-pointer' 
              : 'text-[#d4d4d8] cursor-default'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        {/* Forward Arrow */}
        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          title="Forward"
          className={`p-1.5 rounded transition-colors ${
            canGoForward 
              ? 'hover:bg-[#edeef0] text-[#52525b] hover:text-[#18181b] cursor-pointer' 
              : 'text-[#d4d4d8] cursor-default'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Menu Bar: File, Edit, View, Help */}
        <div className="flex items-center gap-0.5 ml-2 relative">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'File' ? null : 'File')}
              onMouseEnter={() => activeMenu && setActiveMenu('File')}
              className={`px-2 py-1 rounded hover:bg-[#edeef0] text-[#3f3f46] hover:text-[#18181b] transition-colors ${
                activeMenu === 'File' ? 'bg-[#e4e4e7] text-[#18181b]' : ''
              }`}
            >
              File
            </button>
            {activeMenu === 'File' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-[#e4e4e7] py-1 text-xs text-[#27272a] z-50">
                <button
                  onClick={() => { onNewChat(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between items-center"
                >
                  <span>New Chat</span>
                  <span className="text-[#a1a1aa] text-[10px]">Ctrl+N</span>
                </button>
                <button
                  onClick={() => { onOpenProjects(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between items-center"
                >
                  <span>Open Project...</span>
                  <span className="text-[#a1a1aa] text-[10px]">Ctrl+O</span>
                </button>
                <div className="h-[1px] bg-[#e4e4e7] my-1" />
                <button
                  onClick={() => { onOpenProjects(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between items-center"
                >
                  <span>Switch Workspace</span>
                </button>
                <div className="h-[1px] bg-[#e4e4e7] my-1" />
                <button
                  onClick={() => setActiveMenu(null)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] text-red-600"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'Edit' ? null : 'Edit')}
              onMouseEnter={() => activeMenu && setActiveMenu('Edit')}
              className={`px-2 py-1 rounded hover:bg-[#edeef0] text-[#3f3f46] hover:text-[#18181b] transition-colors ${
                activeMenu === 'Edit' ? 'bg-[#e4e4e7] text-[#18181b]' : ''
              }`}
            >
              Edit
            </button>
            {activeMenu === 'Edit' && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#e4e4e7] py-1 text-xs text-[#27272a] z-50">
                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between">
                  <span>Undo</span>
                  <span className="text-[#a1a1aa] text-[10px]">Ctrl+Z</span>
                </button>
                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between">
                  <span>Redo</span>
                  <span className="text-[#a1a1aa] text-[10px]">Ctrl+Y</span>
                </button>
                <div className="h-[1px] bg-[#e4e4e7] my-1" />
                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5]">Cut</button>
                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5]">Copy</button>
                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5]">Paste</button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'View' ? null : 'View')}
              onMouseEnter={() => activeMenu && setActiveMenu('View')}
              className={`px-2 py-1 rounded hover:bg-[#edeef0] text-[#3f3f46] hover:text-[#18181b] transition-colors ${
                activeMenu === 'View' ? 'bg-[#e4e4e7] text-[#18181b]' : ''
              }`}
            >
              View
            </button>
            {activeMenu === 'View' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-[#e4e4e7] py-1 text-xs text-[#27272a] z-50">
                <button
                  onClick={() => { onToggleSidebar(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between items-center"
                >
                  <span>Toggle Sidebar</span>
                  {isSidebarOpen && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => { onToggleRightPanel(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between items-center"
                >
                  <span>Toggle Inspector</span>
                  {isRightPanelOpen && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <div className="h-[1px] bg-[#e4e4e7] my-1" />
                <button
                  onClick={() => { toggleFullscreen(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5] flex justify-between items-center"
                >
                  <span>Toggle Fullscreen</span>
                  <span className="text-[#a1a1aa] text-[10px]">F11</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'Help' ? null : 'Help')}
              onMouseEnter={() => activeMenu && setActiveMenu('Help')}
              className={`px-2 py-1 rounded hover:bg-[#edeef0] text-[#3f3f46] hover:text-[#18181b] transition-colors ${
                activeMenu === 'Help' ? 'bg-[#e4e4e7] text-[#18181b]' : ''
              }`}
            >
              Help
            </button>
            {activeMenu === 'Help' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-[#e4e4e7] py-1 text-xs text-[#27272a] z-50">
                <button onClick={() => { onOpenAbout(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5]">
                  Documentation
                </button>
                <button onClick={() => { onOpenAbout(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5]">
                  Keyboard Shortcuts
                </button>
                <div className="h-[1px] bg-[#e4e4e7] my-1" />
                <button onClick={() => { onOpenAbout(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#f4f4f5]">
                  About BIS-GPT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Drag Region */}
      <div className="flex-1 h-full mx-4" />

      {/* Right zone: Window controls (Minimize, Maximize, Close) */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {}}
          title="Minimize"
          className="p-1.5 rounded hover:bg-[#edeef0] text-[#71717a] hover:text-[#18181b] transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Restore" : "Maximize"}
          className="p-1.5 rounded hover:bg-[#edeef0] text-[#71717a] hover:text-[#18181b] transition-colors"
        >
          {isFullscreen ? <Maximize2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
        </button>
        <button
          onClick={() => {}}
          title="Close"
          className="p-1.5 rounded hover:bg-red-500 hover:text-white text-[#71717a] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
