import { create } from "zustand";
import { v4 as uuid } from "uuid";

/* ---------- NORMALIZER (single source of truth) ---------- */
const normalizeCodolioDataset = (raw) => {
  const topicMap = {};

  raw.data.questions.forEach((item) => {
    const topicName = item.topic || "General";
    const subTopicName = item.subTopic || "Misc";

    if (!topicMap[topicName]) {
      topicMap[topicName] = {
        id: topicName,
        title: topicName,
        subTopics: {},
      };
    }

    if (!topicMap[topicName].subTopics[subTopicName]) {
      topicMap[topicName].subTopics[subTopicName] = {
        id: `${topicName}-${subTopicName}`,
        title: subTopicName,
        questions: [],
      };
    }

    topicMap[topicName].subTopics[subTopicName].questions.push({
      id: item.questionId._id,
      title: item.questionId.slug.replace(/-/g, " "),
      done: false,
    });
  });

  return Object.values(topicMap).map((topic) => ({
    id: topic.id,
    title: topic.title,
    subTopics: Object.values(topic.subTopics),
  }));
};

/* ---------- helpers ---------- */
const saveState = (topics) => {
  localStorage.setItem("codolio-sheet", JSON.stringify(topics));
};

/* ---------- store ---------- */
const useSheetStore = create((set, get) => ({
  topics: [],

  /* 🔹 async init (SAFE for Vite & Vercel) */
  initFromDataset: async () => {
    const saved = localStorage.getItem("codolio-sheet");
    if (saved) {
      set({ topics: JSON.parse(saved) });
      return;
    }

    const res = await fetch("/codolio-dataset.json");
    const raw = await res.json();

    const normalized = normalizeCodolioDataset(raw);
    saveState(normalized);
    set({ topics: normalized });
  },

  /* ---------- topic ---------- */
  addTopic: (title) =>
    set((state) => {
      const topics = [
        ...state.topics,
        { id: uuid(), title, subTopics: [] },
      ];
      saveState(topics);
      return { topics };
    }),

  editTopic: (id, title) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === id ? { ...t, title } : t
      );
      saveState(topics);
      return { topics };
    }),

  deleteTopic: (id) =>
    set((state) => {
      const topics = state.topics.filter((t) => t.id !== id);
      saveState(topics);
      return { topics };
    }),

  reorderTopics: (from, to) =>
    set((state) => {
      const topics = [...state.topics];
      const [moved] = topics.splice(from, 1);
      topics.splice(to, 0, moved);
      saveState(topics);
      return { topics };
    }),

  /* ---------- sub-topic ---------- */
  addSubTopic: (topicId, title) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: [
                ...t.subTopics,
                { id: uuid(), title, questions: [] },
              ],
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  editSubTopic: (topicId, subId, title) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId ? { ...s, title } : s
              ),
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  deleteSubTopic: (topicId, subId) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.filter((s) => s.id !== subId),
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  reorderSubTopics: (topicId, from, to) =>
    set((state) => {
      const topics = state.topics.map((t) => {
        if (t.id !== topicId) return t;

        const subTopics = [...t.subTopics];
        const [moved] = subTopics.splice(from, 1);
        subTopics.splice(to, 0, moved);

        return { ...t, subTopics };
      });

      saveState(topics);
      return { topics };
    }),

  /* ---------- questions ---------- */
  addQuestion: (topicId, subId, title) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: [
                        ...s.questions,
                        { id: uuid(), title, done: false },
                      ],
                    }
                  : s
              ),
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  editQuestion: (topicId, subId, qId, title) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: s.questions.map((q) =>
                        q.id === qId ? { ...q, title } : q
                      ),
                    }
                  : s
              ),
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  toggleQuestion: (topicId, subId, qId) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: s.questions.map((q) =>
                        q.id === qId ? { ...q, done: !q.done } : q
                      ),
                    }
                  : s
              ),
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  deleteQuestion: (topicId, subId, qId) =>
    set((state) => {
      const topics = state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      questions: s.questions.filter((q) => q.id !== qId),
                    }
                  : s
              ),
            }
          : t
      );
      saveState(topics);
      return { topics };
    }),

  reorderQuestions: (topicId, subId, from, to) =>
    set((state) => {
      const topics = state.topics.map((t) => {
        if (t.id !== topicId) return t;

        return {
          ...t,
          subTopics: t.subTopics.map((s) => {
            if (s.id !== subId) return s;

            const questions = [...s.questions];
            const [moved] = questions.splice(from, 1);
            questions.splice(to, 0, moved);

            return { ...s, questions };
          }),
        };
      });

      saveState(topics);
      return { topics };
    }),
}));

export default useSheetStore;
