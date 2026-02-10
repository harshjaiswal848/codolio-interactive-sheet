import useSheetStore from "../store/sheetStore";
import TopicItem from "./TopicItem";

export default function TopicList() {
  const topics = useSheetStore((s) => s.topics);

  return (
    <div style={{ marginTop: "20px" }}>
      {topics.map((topic) => (
        <TopicItem key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
