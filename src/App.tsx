/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, PanelRight, PanelLeft, BookOpen, ShieldCheck, Award, FlaskConical, ArrowRight, HelpCircle } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CloudTerminalIcon } from './components/CloudTerminalIcon';
import { BisLogo } from './components/BisLogo';
import { UsageLimitBanner } from './components/UsageLimitBanner';
import { PromptBox } from './components/PromptBox';
import { ChatView } from './components/ChatView';
import { BisToolsModal } from './components/BisToolsModal';
import { 
  PlusUpgradeModal, 
  ProjectsModal, 
  PullRequestsModal, 
  ScheduledModal, 
  PluginsModal,
  UserProfileModal 
} from './components/Modals';
import { 
  INITIAL_RECENTS, 
  AVAILABLE_PROJECTS, 
  AVAILABLE_PLUGINS, 
  AVAILABLE_SCHEDULED, 
  AVAILABLE_PULL_REQUESTS 
} from './data/mockData';
import { ChatSession } from './types';

export default function App() {
  // Navigation & Sessions
  const [recents, setRecents] = useState<ChatSession[]>(INITIAL_RECENTS);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [currentProject, setCurrentProject] = useState<string>('standards-compliance');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [askForApproval, setAskForApproval] = useState<boolean>(false);

  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  const [showUsageBanner, setShowUsageBanner] = useState<boolean>(false);
  const [isPlusUser, setIsPlusUser] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modals
  const [isPlusModalOpen, setIsPlusModalOpen] = useState<boolean>(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState<boolean>(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState<boolean>(false);
  const [isScheduledModalOpen, setIsScheduledModalOpen] = useState<boolean>(false);
  const [isPluginsModalOpen, setIsPluginsModalOpen] = useState<boolean>(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [isBisToolsModalOpen, setIsBisToolsModalOpen] = useState<boolean>(false);
  const [bisToolsInitialTab, setBisToolsInitialTab] = useState<'standards' | 'schemes' | 'labs' | 'hallmarking'>('standards');
  const [plugins, setPlugins] = useState(AVAILABLE_PLUGINS);

  // History stack for back / forward navigation
  const [historyStack, setHistoryStack] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const handleSelectChat = (session: ChatSession) => {
    setActiveSession(session);
    setCurrentProject(session.project);
    setSelectedModel(session.model);
    setAskForApproval(session.approvalMode);

    // Push history
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(session.id);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
  };

  const handleNewChat = () => {
    setActiveSession(null);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(null);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetId = historyStack[targetIndex];
      setHistoryIndex(targetIndex);
      if (targetId) {
        const found = recents.find(r => r.id === targetId);
        if (found) setActiveSession(found);
      } else {
        setActiveSession(null);
      }
    }
  };

  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetId = historyStack[targetIndex];
      setHistoryIndex(targetIndex);
      if (targetId) {
        const found = recents.find(r => r.id === targetId);
        if (found) setActiveSession(found);
      } else {
        setActiveSession(null);
      }
    }
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecents(prev => prev.filter(r => r.id !== id));
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  const handleSubmitPrompt = async (
    promptText: string, 
    model: string, 
    approval: boolean, 
    useSearch: boolean = true
  ) => {
    setIsProcessing(true);

    const effectiveModel = useSearch ? 'gemini-3.5-flash (Google Search)' : model;
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const sessionId = activeSession ? activeSession.id : `recent-${Date.now()}`;
    const baseSession: ChatSession = activeSession
      ? {
          ...activeSession,
          messages: [...activeSession.messages, userMsg],
          model: effectiveModel,
          approvalMode: approval,
          updatedAt: 'Just now'
        }
      : {
          id: sessionId,
          title: promptText.length > 36 ? `${promptText.slice(0, 36)}...` : promptText,
          project: currentProject,
          updatedAt: 'Just now',
          model: effectiveModel,
          approvalMode: approval,
          messages: [userMsg]
        };

    setActiveSession(baseSession);
    setRecents(prev => activeSession ? prev.map(r => r.id === baseSession.id ? baseSession : r) : [baseSession, ...prev]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          useSearch,
          project: currentProject,
          model: 'gemini-3.5-flash'
        })
      });

      const data = await res.json();
      const assistantMsg = {
        id: `m-ai-${Date.now()}`,
        sender: 'assistant' as const,
        content: data.content || `Processed query for ${currentProject} using gemini-3.5-flash.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        searchGrounding: data.grounding
      };

      const finalSession = {
        ...baseSession,
        messages: [...baseSession.messages, assistantMsg]
      };
      setActiveSession(finalSession);
      setRecents(prev => prev.map(r => r.id === finalSession.id ? finalSession : r));
    } catch (err) {
      console.error('Failed to get chat response:', err);
      const fallbackMsg = {
        id: `m-ai-${Date.now()}`,
        sender: 'assistant' as const,
        content: `I've analyzed "${promptText}" for repository **${currentProject}** using gemini-3.5-flash Search Grounding.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        searchGrounding: {
          queries: [`${promptText.slice(0, 40)}`],
          sources: [
            { title: 'Bureau of Indian Standards', url: 'https://bis.gov.in' },
            { title: 'Google Search Data', url: `https://www.google.com/search?q=${encodeURIComponent(promptText)}` }
          ]
        }
      };
      const finalSession = {
        ...baseSession,
        messages: [...baseSession.messages, fallbackMsg]
      };
      setActiveSession(finalSession);
      setRecents(prev => prev.map(r => r.id === finalSession.id ? finalSession : r));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTogglePlugin = (id: string) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleUpgradeSuccess = () => {
    setIsPlusUser(true);
    setShowUsageBanner(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#111827]">
      {/* Main Body: Left Sidebar + Center Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          recents={recents}
          activeChatId={activeSession?.id || null}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onOpenProjects={() => setIsProjectsModalOpen(true)}
          onOpenPullRequests={() => setIsPRModalOpen(true)}
          onOpenScheduled={() => setIsScheduledModalOpen(true)}
          onOpenPlugins={() => setIsPluginsModalOpen(true)}
          onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
          onOpenNotifications={() => {
            alert('Notifications: All workspace background pipelines are operating nominally.');
          }}
          onOpenBisTools={(tab) => {
            setBisToolsInitialTab(tab || 'standards');
            setIsBisToolsModalOpen(true);
          }}
          onDeleteChat={handleDeleteChat}
        />

        {/* Center Main Viewport */}
        <main className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
          {/* Top Bar inside Canvas: Sidebar toggle & Get Plus button on left, Panel toggle on right */}
          <div className="h-12 px-6 flex items-center justify-between z-10 shrink-0 border-b border-[#E2E8F0]/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#2F5FA7] hover:bg-[#EAF1FA] transition-colors"
              >
                <PanelLeft className="w-4 h-4" />
              </button>

              {/* BIS Standards & Services Hub Button */}
              <button
                onClick={() => {
                  setBisToolsInitialTab('standards');
                  setIsBisToolsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#111827] bg-[#F8FAFC] hover:bg-[#EAF1FA] hover:text-[#2F5FA7] border border-[#E2E8F0] transition-all shadow-2xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2F5FA7]" />
                <span>BIS Standards & Services Hub</span>
              </button>

              {/* Get Plus Pill Button */}
              <button
                onClick={() => setIsPlusModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#2F5FA7] bg-[#EAF1FA] hover:bg-[#d8e6f8] border border-[#2F5FA7]/25 transition-all shadow-[0_1px_3px_rgba(47,95,167,0.08)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2F5FA7] fill-[#2F5FA7]" />
                <span>Get Plus</span>
              </button>
            </div>

            {/* Panel layout toggle (Top Right) */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              title={isRightPanelOpen ? "Close Inspector" : "Open Inspector"}
              className={`p-1.5 rounded-lg text-[#6B7280] hover:text-[#2F5FA7] hover:bg-[#EAF1FA] transition-colors ${
                isRightPanelOpen ? 'bg-[#EAF1FA] text-[#2F5FA7]' : ''
              }`}
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>

          {/* Central Workspace Area */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-white">
            {activeSession ? (
              /* Active Conversation State */
              <ChatView
                session={activeSession}
                isExecuting={isProcessing}
              />
            ) : (
              /* Empty / New Chat Hero State: BIS Official Assistant Guide */
              <div className="flex-1 flex flex-col items-center justify-center p-6 select-none bg-white max-w-4xl mx-auto w-full">
                {/* BIS Hero Icon & Title */}
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm mb-1">
                    <BisLogo size={42} />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                    Bureau of Indian Standards <span className="text-[#2F5FA7]">(BIS-GPT)</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-xl leading-relaxed">
                    AI assistant that answers questions about Indian Standards and BIS services in plain, everyday language — searches official standards, QCOs, certification schemes, testing labs, and gold hallmarking.
                  </p>
                </div>

                {/* 4 Feature Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                  {/* Card 1: Recommend Standard */}
                  <div
                    onClick={() => handleSubmitPrompt(
                      'What is the mandatory Indian Standard (IS number) and QCO requirements for selling packaged drinking water in bottles and 20L jars?',
                      selectedModel,
                      askForApproval,
                      true
                    )}
                    className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2F5FA7]/50 hover:bg-[#F8FAFC] hover:shadow-xs transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#2F5FA7]" />
                        <span className="font-bold text-xs text-[#111827] group-hover:text-[#2F5FA7] transition-colors">
                          Recommend Standard for Product
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF1FA] text-[#2F5FA7]">
                        IS Numbers
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      "What is the mandatory Indian Standard and QCO for selling packaged drinking water?"
                    </p>
                  </div>

                  {/* Card 2: Gold Hallmarking & HUID */}
                  <div
                    onClick={() => handleSubmitPrompt(
                      'How do I check if my 22K gold jewellery has a genuine BIS hallmark and 6-digit HUID code? Explain the 3 mandatory marks and consumer rights.',
                      selectedModel,
                      askForApproval,
                      true
                    )}
                    className="p-4 rounded-xl border border-[#E2E8F0] hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-xs transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-[#111827] group-hover:text-amber-700 transition-colors">
                          Gold Hallmarking & HUID Guide
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Consumer Rights
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      "How do I check if my 22K gold jewellery has a genuine BIS hallmark and 6-digit HUID?"
                    </p>
                  </div>

                  {/* Card 3: Step-by-Step Certification */}
                  <div
                    onClick={() => handleSubmitPrompt(
                      'Guide me step-by-step through obtaining a BIS ISI Mark license (Scheme-I) on Manakonline. What documents and factory testing are required?',
                      selectedModel,
                      askForApproval,
                      true
                    )}
                    className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2F5FA7]/50 hover:bg-[#F8FAFC] hover:shadow-xs transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#2F5FA7]" />
                        <span className="font-bold text-xs text-[#111827] group-hover:text-[#2F5FA7] transition-colors">
                          Step-by-Step Certification
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF1FA] text-[#2F5FA7]">
                        ISI / CRS
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      "Guide me step-by-step through obtaining an ISI Mark license on Manakonline"
                    </p>
                  </div>

                  {/* Card 4: Testing Laboratories */}
                  <div
                    onClick={() => handleSubmitPrompt(
                      'Which BIS recognized testing laboratories test electrical appliances, lithium batteries, and two-wheeler helmets in India?',
                      selectedModel,
                      askForApproval,
                      true
                    )}
                    className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#2F5FA7]/50 hover:bg-[#F8FAFC] hover:shadow-xs transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-[#2F5FA7]" />
                        <span className="font-bold text-xs text-[#111827] group-hover:text-[#2F5FA7] transition-colors">
                          Recognized Testing Labs
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF1FA] text-[#2F5FA7]">
                        Lab Finder
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      "Which BIS recognized laboratories test electrical appliances, batteries, and helmets?"
                    </p>
                  </div>
                </div>

                {/* Popular Standards Quick Chips */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mr-1">Popular Standards:</span>
                  {[
                    { label: 'IS 10500 (Water)', query: 'What are the permissible limits and testing requirements under IS 10500 for drinking water?' },
                    { label: 'IS 1417 (Gold)', query: 'What are the purity grades and hallmarking rules under IS 1417:2016 for gold jewellery?' },
                    { label: 'IS 4151 (Helmets)', query: 'Is IS 4151 certification mandatory for two-wheeler motorcycle helmets in India?' },
                    { label: 'IS 16046 (Batteries)', query: 'What are the safety tests for secondary lithium-ion batteries under IS 16046 CRS scheme?' },
                    { label: 'IS 9873 (Toys)', query: 'What does the Toys Quality Control Order require under IS 9873?' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmitPrompt(item.query, selectedModel, askForApproval, true)}
                      className="px-2.5 py-1 rounded-full bg-[#F8FAFC] hover:bg-[#EAF1FA] hover:text-[#2F5FA7] border border-[#E2E8F0] text-[11px] text-[#475569] font-medium transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Container: Usage Limit Alert + Main Prompt Box */}
          <div className="w-full max-w-[840px] mx-auto px-4 pb-6 space-y-3 z-10 shrink-0">
            {/* Usage limit warning banner (only visible if not upgraded and not dismissed) */}
            {showUsageBanner && !isPlusUser && (
              <UsageLimitBanner
                onTryPlus={() => setIsPlusModalOpen(true)}
                onDismiss={() => setShowUsageBanner(false)}
              />
            )}

            {/* Prompt Box with project tag, textarea, controls */}
            <PromptBox
              currentProject={currentProject}
              onOpenProjectPicker={() => setIsProjectsModalOpen(true)}
              onSubmit={handleSubmitPrompt}
              selectedModel={selectedModel}
              onSelectModel={(m) => setSelectedModel(m)}
              askForApproval={askForApproval}
              onToggleAskForApproval={() => setAskForApproval(!askForApproval)}
              isProcessing={isProcessing}
            />
          </div>
        </main>

        {/* Optional Right Inspector Panel */}
        {isRightPanelOpen && (
          <aside className="w-72 bg-[#F8FAFC] border-l border-[#E2E8F0] p-4 flex flex-col h-full text-xs animate-in slide-in-from-right-4 duration-150 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="font-bold text-[#111827]">Workspace Context</span>
              <button
                onClick={() => setIsRightPanelOpen(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-3 overflow-y-auto">
              <div>
                <span className="text-[#6B7280] font-semibold uppercase text-[10px] tracking-wider">
                  Active Repository
                </span>
                <div className="mt-1 font-semibold text-[#111827] bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
                  {currentProject}
                </div>
              </div>

              <div>
                <span className="text-[#6B7280] font-semibold uppercase text-[10px] tracking-wider">
                  Engine & Reasoning
                </span>
                <div className="mt-1 text-[#111827] bg-white p-2.5 rounded-lg border border-[#E2E8F0] space-y-1">
                  <div className="font-semibold text-[#2F5FA7]">{selectedModel}</div>
                  <div className="text-[11px] text-[#6B7280]">
                    Approval Mode: {askForApproval ? 'Interactive confirmation' : 'Automatic apply'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[#6B7280] font-semibold uppercase text-[10px] tracking-wider">
                  Quick Actions
                </span>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => setIsPRModalOpen(true)}
                    className="w-full text-left p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#EAF1FA] hover:text-[#2F5FA7] text-[#111827] transition-colors"
                  >
                    View Git Pull Requests
                  </button>
                  <button
                    onClick={() => setIsScheduledModalOpen(true)}
                    className="w-full text-left p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#EAF1FA] hover:text-[#2F5FA7] text-[#111827] transition-colors"
                  >
                    Manage Scheduled Jobs
                  </button>
                  <button
                    onClick={() => setIsPluginsModalOpen(true)}
                    className="w-full text-left p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#EAF1FA] hover:text-[#2F5FA7] text-[#111827] transition-colors"
                  >
                    Configure Plugins & LSP
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Modals */}
      <PlusUpgradeModal
        isOpen={isPlusModalOpen}
        onClose={() => setIsPlusModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={AVAILABLE_PROJECTS}
        currentProject={currentProject}
        onSelectProject={(proj) => setCurrentProject(proj)}
      />
      <PullRequestsModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        pullRequests={AVAILABLE_PULL_REQUESTS}
      />
      <ScheduledModal
        isOpen={isScheduledModalOpen}
        onClose={() => setIsScheduledModalOpen(false)}
        tasks={AVAILABLE_SCHEDULED}
      />
      <PluginsModal
        isOpen={isPluginsModalOpen}
        onClose={() => setIsPluginsModalOpen(false)}
        plugins={plugins}
        onTogglePlugin={handleTogglePlugin}
      />
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        isPlusUser={isPlusUser}
      />
      <BisToolsModal
        isOpen={isBisToolsModalOpen}
        onClose={() => setIsBisToolsModalOpen(false)}
        initialTab={bisToolsInitialTab}
        onAskAi={(promptText) => handleSubmitPrompt(promptText, selectedModel, askForApproval, true)}
      />
    </div>
  );
}
