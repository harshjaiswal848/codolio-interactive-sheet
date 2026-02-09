import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useSheetStore from "../store/sheetStore";

export default function TopicItem({ topic }) {
  const deleteTopic = useSheetStore((s) => s.deleteTopic);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white p-4 rounded shadow mb-3"
    >
      <div className="flex justify-between items-center">
        <h2
          {...listeners}
          className="text-lg font-semibold cursor-grab"
        >
          {topic.title}
        </h2>
        <button
          onClick={() => deleteTopic(topic.id)}
          className="text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
