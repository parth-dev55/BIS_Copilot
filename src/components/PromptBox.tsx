import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  Plus, 
  Hand, 
  Mic, 
  ArrowUp, 
  ChevronDown, 
  Paperclip, 
  Code, 
  FileText, 
  Check,
  Sparkles,
  Zap,
  StopCircle,
  Globe
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../data/mockData';
import { GoogleIcon } from './GoogleIcon';

interface PromptBoxProps {
  currentProject: string;
  onOpenProjectPicker: () => void;
  onSubmit: (prompt: string, model: string, askForApproval: boolean, useSearch?: boolean) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  askForApproval: boolean;
  onToggleAskForApproval: () => void;
  isProcessing?: boolean;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  currentProject,
  onOpenProjectPicker,
  onSubmit,
  selectedModel,
  onSelectModel,
  askForApproval,
  onToggleAskForApproval,
  isProcessing = false
}) => {
  const [prompt, setPrompt] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isAttachDropdownOpen, setIsAttachDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const attachDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (attachDropdownRef.current && !attachDropdownRef.current.contains(e.target as Node)) {
        setIsAttachDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!prompt.trim() && attachedFiles.length === 0) || isProcessing) return;
    const finalPrompt = prompt.trim() || `Analyze ${attachedFiles.join(', ')}`;
    onSubmit(finalPrompt, selectedModel, askForApproval, useSearchGrounding);
    setPrompt('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Auto-grow
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech input
      setTimeout(() => {
        setPrompt((prev) => (prev ? prev + ' ' : '') + 'Review contact validation controller');
        setIsListening(false);
      }, 2500);
    }
  };

  const addMockAttachment = (name: string) => {
    if (!attachedFiles.includes(name)) {
      setAttachedFiles([...attachedFiles, name]);
    }
    setIsAttachDropdownOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(242,45,58,0.08)] focus-within:border-[#F22D3A] focus-within:ring-2 focus-within:ring-[#F22D3A]/20 transition-all flex flex-col p-3 px-4 relative">
      {/* Top attached project pill */}
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={onOpenProjectPicker}
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F22D3A]/10 hover:bg-[#F22D3A]/20 text-[#F22D3A] rounded-md text-xs font-semibold transition-colors"
        >
          <Folder className="w-3.5 h-3.5 text-[#F22D3A]" />
          <span>{currentProject}</span>
        </button>

        {/* Attached files indicators if any */}
        {attachedFiles.map((file, idx) => (
          <span 
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EAF1FA] text-[#2F5FA7] rounded text-[11px] font-medium border border-[#2F5FA7]/20"
          >
            <Paperclip className="w-3 h-3 text-[#2F5FA7]" />
            <span className="truncate max-w-[120px]">{file}</span>
            <button 
              onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
              className="ml-1 text-[#6B7280] hover:text-[#F22D3A]"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Main input text field with "Do anything" placeholder */}
      <div className="py-1">
        <textarea
          ref={textareaRef}
          rows={1}
          value={prompt}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Do anything"
          disabled={isProcessing}
          className="w-full resize-none border-none outline-none text-[15px] text-[#111827] placeholder-[#6B7280] bg-transparent leading-relaxed max-h-48 overflow-y-auto"
        />
      </div>

      {/* Audio speech simulation banner if active */}
      {isListening && (
        <div className="flex items-center gap-2 py-1 px-2.5 my-1 bg-[#F22D3A]/10 border border-[#F22D3A]/20 rounded-lg text-xs text-[#F22D3A] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#F22D3A] animate-ping" />
          <span className="font-medium">Listening to your voice... Speak your coding task</span>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-2 select-none border-t border-[#F8FAFC]">
        {/* Left Actions: + and Ask for approval */}
        <div className="flex items-center gap-2">
          {/* Plus button with dropdown */}
          <div className="relative" ref={attachDropdownRef}>
            <button
              onClick={() => setIsAttachDropdownOpen(!isAttachDropdownOpen)}
              type="button"
              title="Add context or files"
              className="w-7 h-7 rounded-full hover:bg-[#EAF1FA] text-[#6B7280] hover:text-[#2F5FA7] flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            {isAttachDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-1.5 text-xs text-[#111827] z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => addMockAttachment('ContactMasterService.java')}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#EAF1FA] rounded-lg flex items-center gap-2.5 text-[#111827]"
                >
                  <Code className="w-4 h-4 text-[#2F5FA7]" />
                  <span>Attach Code File</span>
                </button>
                <button
                  onClick={() => addMockAttachment('schema.sql')}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#EAF1FA] rounded-lg flex items-center gap-2.5 text-[#111827]"
                >
                  <FileText className="w-4 h-4 text-[#244B85]" />
                  <span>Attach Database Migration</span>
                </button>
                <button
                  onClick={() => addMockAttachment('git-diff.patch')}
                  className="w-full text-left px-2.5 py-2 hover:bg-[#EAF1FA] rounded-lg flex items-center gap-2.5 text-[#111827]"
                >
                  <Paperclip className="w-4 h-4 text-[#F22D3A]" />
                  <span>Attach Git Diff</span>
                </button>
              </div>
            )}
          </div>

          {/* Ask for approval toggle */}
          <button
            onClick={onToggleAskForApproval}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              askForApproval
                ? 'text-[#6B7280] hover:text-[#2F5FA7] hover:bg-[#EAF1FA]'
                : 'text-[#2F5FA7] bg-[#EAF1FA] hover:bg-[#d8e6f8]'
            }`}
          >
            <Hand className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>{askForApproval ? 'Ask for approval' : 'Auto execute'}</span>
          </button>

          {/* Google Search Grounding toggle with Google icon */}
          <button
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            type="button"
            title={useSearchGrounding ? "Google Search Grounding (gemini-3.5-flash) active" : "Enable Google Search data"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              useSearchGrounding
                ? 'bg-[#EAF1FA] text-[#2F5FA7] border border-[#2F5FA7]/30 shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC]'
            }`}
          >
            <GoogleIcon size={14} />
            <span>{useSearchGrounding ? 'Google Search' : 'Search Off'}</span>
          </button>
        </div>

        {/* Right Actions: Model selector, Mic, Send */}
        <div className="flex items-center gap-3">
          {/* Model selector dropdown */}
          <div className="relative" ref={modelDropdownRef}>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              type="button"
              className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#2F5FA7] transition-colors py-1 px-1.5 rounded hover:bg-[#EAF1FA]"
            >
              <span className="font-medium text-[#111827]">{selectedModel}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280] mt-0.5" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-1.5 text-xs text-[#111827] z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                  Select Model
                </div>
                {AVAILABLE_MODELS.map((m) => {
                  const isSelected = selectedModel.includes(m.name) || selectedModel === m.name;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModel(m.name);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between transition-colors ${
                        isSelected ? 'bg-[#EAF1FA] text-[#2F5FA7]' : 'hover:bg-[#F8FAFC] text-[#111827]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {m.tag === 'Plus' ? (
                            <span className="text-[10px] bg-[#F22D3A]/10 text-[#F22D3A] font-bold px-1.5 py-0.2 rounded">Plus</span>
                          ) : (
                            <span className="text-[10px] bg-[#EAF1FA] text-[#2F5FA7] font-semibold px-1.5 py-0.2 rounded">{m.tag}</span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">
                          {m.description}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#2F5FA7] shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Microphone */}
          <button
            onClick={toggleMic}
            type="button"
            title={isListening ? "Stop voice input" : "Voice input"}
            className={`p-1.5 rounded-full hover:bg-[#EAF1FA] transition-colors ${
              isListening ? 'text-[#F22D3A] bg-[#F22D3A]/10 animate-bounce' : 'text-[#6B7280] hover:text-[#2F5FA7]'
            }`}
          >
            {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Submit arrow button in ACCENT RED #F22D3A */}
          <button
            onClick={handleSend}
            disabled={(!prompt.trim() && attachedFiles.length === 0) || isProcessing}
            type="button"
            title="Send message (Enter)"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              (prompt.trim() || attachedFiles.length > 0) && !isProcessing
                ? 'bg-[#F22D3A] hover:bg-[#d9222e] text-white shadow-sm shadow-[#F22D3A]/30 cursor-pointer'
                : 'bg-[#F22D3A]/35 text-white cursor-not-allowed opacity-80'
            }`}
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
