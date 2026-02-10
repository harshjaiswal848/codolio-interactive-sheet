import TopicList from "./components/TopicList";
import useSheetStore from "./store/sheetStore";
import { useEffect } from "react";

export default function App() {
  const setTopics = useSheetStore((s) => s.setTopics);
  const addTopic = useSheetStore((s) => s.addTopic);

  useEffect(() => {
    // mock data (stable)
    setTopics([
      { id: "1", title: "Arrays", subTopics: [] },
      { id: "2", title: "Strings", subTopics: [] },
      { id: "3", title: "Linked List", subTopics: [] },
    ]);
  }, []);

  const handleAddTopic = () => {
    const title = prompt("Enter topic name");
    if (title && title.trim()) {
      addTopic(title.trim());
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Codolio Question Sheet
      </h1>

      <button
        onClick={handleAddTopic}
        style={{
          marginTop: "12px",
          padding: "8px 14px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ➕ Add Topic
      </button>

      <TopicList />
    </div>
  );
}
