import { create } from "zustand";

interface PromptStore {
  prompt: string;
  timestamp: number;
  setPrompt: (prompt: string) => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
  prompt: "",
  timestamp: 0,
  setPrompt: (prompt) => set({ prompt, timestamp: Date.now() }),
}));
