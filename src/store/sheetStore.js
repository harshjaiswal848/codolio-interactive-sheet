import sampleData from "../data/dataset.json";
import rawDataset from "../data/dataset.json";


import { create } from "zustand";
import { v4 as uuid } from "uuid";

const normalizeDataset = (raw) => {
  const topicMap = {};

  raw.data.questions.forEach((q) => {
    const topicName = q.topic || "General";
    const subTopicName = q.subTopic || "Misc";

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
      id: q.questionId._id,
      title: q.questionId.slug.replace(/-/g, " "),
      done: false,
    });
  });

  // convert maps to arrays
  return Object.values(topicMap).map((topic) => ({
    id: topic.id,
    title: topic.title,
    subTopics: Object.values(topic.subTopics),
  }));
};


/* ---------- helpers ---------- */
const loadState = () => {
  const saved = localStorage.getItem("codolio-sheet");

  if (saved) {
    return JSON.parse(saved);
  }

  // 👇 Normalize Codolio dataset
  const normalized = normalizeDataset(rawDataset);

  localStorage.setItem("codolio-sheet", JSON.stringify(normalized));
  return normalized;
};


const saveState = (topics) => {
  localStorage.setItem("codolio-sheet", JSON.stringify(topics));
};

/* ---------- store ---------- */
const useSheetStore = create((set) => ({
  topics: loadState(),

  /* ---------- topic ---------- */
  setTopics: (topics) => {
    saveState(topics);
    set({ topics });
  },

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

  /* 🔄 reorder topics */
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

  /* 🔄 reorder sub-topics */
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

  /* 🔄 reorder questions */
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
