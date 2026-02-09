import { create } from "zustand";
import { v4 as uuid } from "uuid";

const useSheetStore = create((set) => ({
  topics: [],

  setTopics: (topics) => set({ topics }),

  addTopic: (title) =>
    set((state) => ({
      topics: [
        ...state.topics,
        { id: uuid(), title, subTopics: [] }
      ]
    })),

  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter(t => t.id !== id)
    })),

  reorderTopics: (newTopics) => set({ topics: newTopics }),
}));

export default useSheetStore;
