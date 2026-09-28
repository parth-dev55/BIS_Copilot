import React from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Folder, 
  GitPullRequest, 
  Clock, 
  Cable, 
  Plus, 
  ExternalLink,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { ProjectItem, PluginItem, ScheduledTask, PullRequestItem } from '../types';

interface ModalWrapperProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-2xl border border-[#e4e4e7] shadow-2xl w-full ${maxWidth} overflow-hidden animate-in fade-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f2]">
          <h3 className="font-semibold text-base text-[#18181b]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

/* --- Plus Upgrade Modal --- */
interface PlusUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const PlusUpgradeModal: React.FC<PlusUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess
}) => {
  return (
    <ModalWrapper title="Upgrade to BIS-GPT Plus" isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-[#EAF1FA] to-[#dce8f8] border border-[#2F5FA7]/30 rounded-xl p-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#2F5FA7] text-white mb-2 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-[#111827]">Unlock Unlimited Coding Workflows</h4>
          <p className="text-xs text-[#6B7280] mt-1">
            Get unrestricted access to BIS-GPT 5.6 Terra & 6.0 BIS-Ultra without hourly rate limits.
          </p>
        </div>

        <div className="space-y-2.5 text-xs text-[#111827]">
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#2F5FA7] shrink-0 mt-0.5" />
            <span><strong>Extended Limits:</strong> 10x higher message throughput and priority queuing</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#2F5FA7] shrink-0 mt-0.5" />
            <span><strong>Advanced Models:</strong> 5.6 Terra Medium, Fast, and 6.0 BIS-Ultra reasoning engine</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#2F5FA7] shrink-0 mt-0.5" />
            <span><strong>Autonomous Workflows:</strong> Multi-file background PR reviews & git branch management</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#2F5FA7] shrink-0 mt-0.5" />
            <span><strong>200k Token Context:</strong> Deep indexing of entire enterprise codebases</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
          <div>
            <div className="text-xl font-bold text-[#111827]">$20 <span className="text-xs font-normal text-[#6B7280]">/ month</span></div>
            <div className="text-[11px] text-[#6B7280]">Cancel anytime in account billing</div>
          </div>
          <button
            onClick={() => {
              onUpgradeSuccess();
              onClose();
            }}
            className="px-5 py-2.5 bg-[#2F5FA7] hover:bg-[#244B85] text-white rounded-full font-semibold text-xs transition-colors shadow-sm"
          >
            Upgrade to Plus
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

/* --- Projects Modal --- */
interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  currentProject: string;
  onSelectProject: (name: string) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProject,
  onSelectProject
}) => {
  return (
    <ModalWrapper title="Projects & Workspaces" isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-3">
        <p className="text-xs text-[#6B7280]">
          Select an active repository to load context, git history, and symbols into BIS-GPT.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {projects.map((proj) => {
            const isSelected = proj.name === currentProject;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.name);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[#2F5FA7] bg-[#EAF1FA] shadow-xs'
                    : 'border-[#E2E8F0] hover:border-[#2F5FA7]/40 hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#2F5FA7] text-white' : 'bg-[#EAF1FA] text-[#2F5FA7]'}`}>
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827] flex items-center gap-2">
                      <span>{proj.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-[#2F5FA7] text-white px-1.5 py-0.2 rounded font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[#6B7280] font-mono text-[11px] mt-0.5">
                      {proj.path} · branch: <span className="text-[#111827] font-medium">{proj.branch}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-[#6B7280] text-[11px]">
                  <div>{proj.filesCount} files</div>
                  <div>{proj.lastModified}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-[#E2E8F0]">
          <button
            onClick={() => {
              alert('Local file folder selector: Select repository from disk.');
            }}
            className="flex items-center gap-1.5 text-xs text-[#2F5FA7] hover:text-[#244B85] font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Local Folder...</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#EAF1FA] hover:bg-[#dce8f8] text-xs font-semibold text-[#2F5FA7] rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

/* --- Pull Requests Modal --- */
interface PullRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pullRequests: PullRequestItem[];
}

export const PullRequestsModal: React.FC<PullRequestsModalProps> = ({
  isOpen,
  onClose,
  pullRequests
}) => {
  return (
    <ModalWrapper title="Pull Requests" isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-3">
        <p className="text-xs text-[#71717a]">
          BIS-GPT monitors branches and can automatically suggest pull request reviews, fix conflicts, and generate test suites.
        </p>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {pullRequests.map((pr) => (
            <div
              key={pr.id}
              className="p-3 rounded-xl border border-[#e4e4e7] hover:border-[#cbd5e1] bg-white text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitPullRequest className={`w-4 h-4 ${pr.status === 'open' ? 'text-emerald-600' : 'text-purple-600'}`} />
                  <span className="font-semibold text-[#18181b]">{pr.title}</span>
                </div>
                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                  pr.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  #{pr.number} {pr.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#71717a] text-[11px]">
                <div className="font-mono">branch: {pr.branch} · author: {pr.author}</div>
                <div>{pr.commentsCount} comments · {pr.updatedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

/* --- Scheduled Modal --- */
interface ScheduledModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: ScheduledTask[];
}

export const ScheduledModal: React.FC<ScheduledModalProps> = ({
  isOpen,
  onClose,
  tasks
}) => {
  return (
    <ModalWrapper title="Scheduled Tasks" isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-3">
        <p className="text-xs text-[#71717a]">
          Automated background cron jobs and repository maintenance pipelines configured in BIS-GPT.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl border border-[#e4e4e7] bg-white text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-[#18181b] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{task.name}</span>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                  {task.status}
                </span>
              </div>
              <div className="text-[#71717a] text-[11px]">
                Schedule: <span className="font-mono text-[#3f3f46]">{task.schedule}</span>
              </div>
              <div className="text-[#a1a1aa] text-[10px]">
                Target: {task.target} · Last run: {task.lastRun}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

/* --- Plugins Modal --- */
interface PluginsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plugins: PluginItem[];
  onTogglePlugin: (id: string) => void;
}

export const PluginsModal: React.FC<PluginsModalProps> = ({
  isOpen,
  onClose,
  plugins,
  onTogglePlugin
}) => {
  return (
    <ModalWrapper title="Plugins & Tool Integrations" isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-3">
        <p className="text-xs text-[#71717a]">
          Installed workspace toolchains and language servers powering BIS-GPT code intelligence.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {plugins.map((pl) => (
            <div
              key={pl.id}
              className="p-3 rounded-xl border border-[#e4e4e7] bg-white text-xs flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-[#18181b] flex items-center gap-1.5">
                  <Cable className="w-3.5 h-3.5 text-blue-600" />
                  <span>{pl.name}</span>
                  <span className="text-[10px] text-[#a1a1aa] font-mono">v{pl.version}</span>
                </div>
                <div className="text-[#71717a] text-[11px] mt-0.5">{pl.description}</div>
              </div>
              <button
                onClick={() => onTogglePlugin(pl.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  pl.enabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7]'
                }`}
              >
                {pl.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

/* --- User Profile Modal --- */
interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlusUser: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  isPlusUser
}) => {
  return (
    <ModalWrapper title="Account & Preferences" isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4 text-xs">
        <div className="flex items-center gap-3 p-3 bg-[#f9f9fb] rounded-xl border border-[#eaebed]">
          <div className="w-10 h-10 rounded-full bg-[#18181b] text-white flex items-center justify-center font-bold text-sm">
            PC
          </div>
          <div>
            <div className="font-semibold text-sm text-[#18181b]">Parth Chaudhari</div>
            <div className="text-[#71717a] text-xs">iampkc990@gmail.com</div>
          </div>
        </div>

        <div className="space-y-2 border-t border-[#f0f0f2] pt-3">
          <div className="flex justify-between items-center py-1">
            <span className="text-[#71717a]">Active Plan</span>
            <span className="font-semibold text-[#18181b]">{isPlusUser ? 'BIS-GPT Plus' : 'Free Tier'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#71717a]">Usage Quota</span>
            <span className="font-semibold text-amber-600">{isPlusUser ? 'Unlimited' : 'Out of usage'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#71717a]">Next Reset</span>
            <span className="text-[#3f3f46]">Oct 5, 1:14 PM</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[#71717a]">Client Version</span>
            <span className="font-mono text-[#3f3f46]">BIS-GPT 2.4.0 (x64)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#f0f0f2] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#18181b] text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
