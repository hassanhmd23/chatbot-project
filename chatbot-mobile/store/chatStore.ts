import { create } from 'zustand';
import {
  ChatState,
  Message,
  SendMessageParams,
  ChatHistoryParams,
  ChatSession,
} from '../types/chat';
import chatService from '../services/chatService';
import { v4 as uuidv4 } from 'uuid';

export const useChatStore = create<
  ChatState & {
    fetchSessions: () => Promise<void>;
    fetchTrafficLawHistory: (params: ChatHistoryParams) => Promise<void>;
    fetchAccidentHistory: (params: ChatHistoryParams) => Promise<void>;
    sendTrafficLawMessage: (params: SendMessageParams) => Promise<void>;
    sendAccidentMessage: (params: SendMessageParams) => Promise<void>;
    createSession: (
      chatType: 'traffic' | 'accident',
      title: string
    ) => Promise<ChatSession>;
    setActiveSession: (sessionId?: string, type?: 'traffic' | 'accident') => void;
    getActiveSession: (type: 'traffic' | 'accident') => string | null;
    emptyMessages: () => void;
  }
>((set, get) => ({
  trafficSessions: [],
  accidentSessions: [],
  activeTrafficSessionId: null,
  activeAccidentSessionId: null,
  messages: {},
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { trafficSessions, accidentSessions } =
        await chatService.getSessions();
      set({
        trafficSessions,
        accidentSessions,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch sessions',
      });
    }
  },

  fetchTrafficLawHistory: async (params: ChatHistoryParams) => {
    try {
      const { sessionId } = params;

      set({ isLoading: true, error: null });

      const { messages: newMessages } = await chatService.getTrafficLawHistory(
        params
      );

      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: newMessages,
        },
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch traffic law chat history',
      });
    }
  },

  fetchAccidentHistory: async (params: ChatHistoryParams) => {
    try {
      const { sessionId } = params;

      set({ isLoading: true, error: null });

      const { messages: newMessages } = await chatService.getAccidentHistory(
        params
      );

      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: newMessages,
        },
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch accident chat history',
      });
    }
  },

  sendTrafficLawMessage: async (params: SendMessageParams) => {
    try {
      const { sessionId, content } = params;

      // Create a temporary message with pending status
      const tempMessage: Message = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: 'sending',
      };

      // Add the message to the UI immediately with 'sending' status
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: [...(state.messages[sessionId] || []), tempMessage],
        },
        isLoading: true,
        error: null,
      }));

      // Send the message to the server
      const response = await chatService.sendTrafficLawMessage(params);

      // Update the UI with the server response
      set((state) => {
        const updatedMessages = state.messages[sessionId].map((msg) => {
          if (msg.id === tempMessage.id) {
            // Replace temp message with the actual one from server
            return {
              ...msg,
              status: 'sent',
            };
          }
          return msg;
        });

        return {
          messages: {
            ...state.messages,
            [sessionId]: [...updatedMessages, response],
          },
          isLoading: false,
        };
      });

      // If the session isn't in the list, update it
      if (!get().trafficSessions.find((s) => s.id === sessionId)) {
        await get().fetchSessions();
      }
    } catch (error: any) {
      // Update the message status to 'error'
      set((state) => {
        const updatedMessages = state.messages[params.sessionId].map((msg) => {
          if (msg.status === 'sending') {
            return { ...msg, status: 'error' };
          }
          return msg;
        });

        return {
          messages: {
            ...state.messages,
            [params.sessionId]: updatedMessages,
          },
          isLoading: false,
          error: error.message || 'Failed to send message',
        };
      });
    }
  },

  sendAccidentMessage: async (params: SendMessageParams) => {
    try {
      const { sessionId, content, images } = params;

      // Create a temporary message with pending status
      const tempMessage: Message = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: 'sending',
        images: images, // These will be URLs for display only at this point
      };

      // Add the message to the UI immediately with 'sending' status
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: [...(state.messages[sessionId] || []), tempMessage],
        },
        isLoading: true,
        error: null,
      }));

      // Send the message to the server
      const response = await chatService.sendAccidentMessage(params);

      // Update the UI with the server response
      set((state) => {
        const updatedMessages = state.messages[sessionId].map((msg) => {
          if (msg.id === tempMessage.id) {
            // Replace temp message with the actual one from server
            return {
              ...msg,
              status: 'sent',
            };
          }
          return msg;
        });

        return {
          messages: {
            ...state.messages,
            [sessionId]: [...updatedMessages, response],
          },
          isLoading: false,
        };
      });

      // If the session isn't in the list, update it
      if (!get().accidentSessions.find((s) => s.id === sessionId)) {
        await get().fetchSessions();
      }
    } catch (error: any) {
      // Update the message status to 'error'
      set((state) => {
        const updatedMessages = state.messages[params.sessionId].map((msg) => {
          if (msg.status === 'sending') {
            return { ...msg, status: 'error' };
          }
          return msg;
        });

        return {
          messages: {
            ...state.messages,
            [params.sessionId]: updatedMessages,
          },
          isLoading: false,
          error: error.message || 'Failed to send message',
        };
      });
    }
  },

  createSession: async (chatType: 'traffic' | 'accident', title: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await chatService.createSession(chatType, title);

      // Update sessions list
      set((state) => {
        if (chatType === 'traffic') {
          return {
            trafficSessions: [session, ...state.trafficSessions],
            isLoading: false,
          };
        } else {
          return {
            accidentSessions: [session, ...state.accidentSessions],
            isLoading: false,
          };
        }
      });

      return session;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create session',
      });
      throw error;
    }
  },

  setActiveSession: (sessionId?: string, type?: 'traffic' | 'accident') => {
    if (type === 'traffic') {
      set({ activeTrafficSessionId: sessionId });
    } else if (type === 'accident') {
      set({ activeAccidentSessionId: sessionId });
    }
  },

  getActiveSession: (type: 'traffic' | 'accident') => {
    return type === 'traffic'
      ? get().activeTrafficSessionId
      : get().activeAccidentSessionId;
  },

  emptyMessages: () => {
    set({ messages: {} });
  }
}));

export default useChatStore;
