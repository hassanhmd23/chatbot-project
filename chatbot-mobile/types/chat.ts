export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  images?: string[]; // URLs to images
  status: 'sending' | 'sent' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  lastUpdated: string;
  chatType: 'traffic' | 'accident';
}

export interface ChatState {
  trafficSessions: ChatSession[];
  accidentSessions: ChatSession[];
  activeTrafficSessionId: string | null;
  activeAccidentSessionId: string | null;
  messages: Record<string, Message[]>; // sessionId -> messages
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageParams {
  sessionId: string;
  content: string;
  images?: string[]; // Base64 encoded images
  chatType: 'traffic' | 'accident';
}

export interface ChatHistoryParams {
  sessionId: string;
}

export interface UploadImageResponse {
  url: string;
  id: string;
}