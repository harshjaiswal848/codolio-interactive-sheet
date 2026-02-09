import { useEffect } from "react";
import useSheetStore from "./store/sheetStore";
import TopicList from "./components/TopicList";

export default function App() {
  const setTopics = useSheetStore((s) => s.setTopics);

  useEffect(() => {
    fetch("https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet")
      .then(res => res.json())
      .then(data => setTopics(data.data.topics));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Codolio Question Sheet</h1>
      <TopicList />
    </div>
  );
}
