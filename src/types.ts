export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  searchGrounding?: {
    queries?: string[];
    sources?: GroundingSource[];
  };
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  toolExecution?: {
    command: string;
    output: string;
    status: 'completed' | 'running' | 'failed';
  };
}

export interface ChatSession {
  id: string;
  title: string;
  project: string;
  updatedAt: string;
  messages: ChatMessage[];
  approvalMode: boolean;
  model: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  path: string;
  branch: string;
  lastModified: string;
  filesCount: number;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  author: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  status: 'active' | 'paused' | 'running';
  lastRun: string;
  target: string;
}

export interface PullRequestItem {
  id: string;
  number: number;
  title: string;
  branch: string;
  author: string;
  status: 'open' | 'merged' | 'draft';
  commentsCount: number;
  updatedAt: string;
}
