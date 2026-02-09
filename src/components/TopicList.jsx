import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import useSheetStore from "../store/sheetStore";
import TopicItem from "./TopicItem";

export default function TopicList() {
  const topics = useSheetStore((s) => s.topics);
  const reorderTopics = useSheetStore((s) => s.reorderTopics);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = topics.findIndex(t => t.id === active.id);
    const newIndex = topics.findIndex(t => t.id === over.id);

    reorderTopics(arrayMove(topics, oldIndex, newIndex));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={topics.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {topics.map(topic => (
          <TopicItem key={topic.id} topic={topic} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
