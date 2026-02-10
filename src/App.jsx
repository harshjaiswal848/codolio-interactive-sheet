import { useEffect } from "react";
import TopicList from "./components/TopicList";
import useSheetStore from "./store/sheetStore";

export default function App() {
  const initFromDataset = useSheetStore((s) => s.initFromDataset);
  const addTopic = useSheetStore((s) => s.addTopic);

  // 🔹 initialize data once (safe for prod & dev)
  useEffect(() => {
    initFromDataset();
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
