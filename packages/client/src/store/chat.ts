import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ChatStore = {
  prompt: string;
  chatType: string;
  messages: Chat.IMessage[];
  visualizing: boolean;
  autoVisualize: boolean;
  autoVizType: string;
  multiRoundChat: boolean; // 新增状态

  setMessages: (messages: Chat.IMessage[]) => void;
  setPrompt: (prompt: string) => void;
  clearMessages: () => void;
  setChatType: (chatType: string) => void;
  setAutoVisualize: (autoVisualize: boolean) => void;
  setVisualizing: (visualizing: boolean) => void;
  setAutoVizType: (autoVizType: string) => void;
  addMessage: (messages: Chat.IMessage[]) => void;
  setMultiRoundChat: (multiRoundChat: boolean) => void; // 新增方法
};

const useChatDbStore = create(
  persist<ChatStore>(
    (set) => ({
      prompt: '',
      messages: [],
      chatType: 'chat',
      autoVisualize: true,
      visualizing: false,
      autoVizType: 'ava',
      multiRoundChat: false, // 初始值为 false

      setAutoVizType: (autoVizType: string) => {
        set(() => {
          return {
            autoVizType,
          };
        });
      },
      setVisualizing: (visualizing: boolean) => {
        set(() => {
          return {
            visualizing,
          };
        });
      },
      setAutoVisualize: (autoVisualize: boolean) => {
        set(() => {
          return {
            autoVisualize,
          };
        });
      },
      setChatType: (chatType: string) => {
        set(() => {
          return {
            chatType,
          };
        });
      },
      clearMessages: () => {
        set(() => {
          return {
            messages: [],
          };
        });
      },
      setMessages: (messages: Chat.IMessage[]) => {
        set((state) => {
          return {
            messages: [...state.messages, ...messages],
          };
        });
      },
      addMessage: (messages: Chat.IMessage[]) => {
        set((state) => {
          return {
            messages: [...state.messages, ...messages],
          };
        });
      },
      setPrompt: (prompt: string) => {
        set(() => {
          return {
            prompt,
          };
        });
      },
      setMultiRoundChat: (multiRoundChat: boolean) => set({ multiRoundChat }), // 新增方法
    }),
    {
      name: 'chat-db-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useChatDbStore;
