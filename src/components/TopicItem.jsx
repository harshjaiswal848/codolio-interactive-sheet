import { useState } from "react";
import useSheetStore from "../store/sheetStore";

export default function TopicItem({ topic }) {
  const {
    editTopic,
    deleteTopic,
    addSubTopic,
    editSubTopic,
    deleteSubTopic,
    addQuestion,
    editQuestion,
    toggleQuestion,
    deleteQuestion,
    reorderSubTopics,
    reorderQuestions,
  } = useSheetStore();

  const [dragSubIndex, setDragSubIndex] = useState(null);
  const [dragQIndex, setDragQIndex] = useState(null);

  return (
    <div
      style={{
        background: "#fff",
        padding: 12,
        marginBottom: 12,
        borderRadius: 6,
      }}
    >
      {/* ---------- TOPIC ---------- */}
      <h3 style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {topic.title}
        <button onClick={() => editTopic(topic.id, prompt("Edit topic"))}>
          ✏️
        </button>
        <button onClick={() => deleteTopic(topic.id)}>🗑</button>
        <button
          onClick={() =>
            addSubTopic(topic.id, prompt("Sub-topic name"))
          }
        >
          ➕ Sub Topic
        </button>
      </h3>

      {/* ---------- SUB-TOPICS ---------- */}
      {topic.subTopics.map((sub, subIndex) => (
        <div
          key={sub.id}
          draggable
          onDragStart={() => setDragSubIndex(subIndex)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() =>
            reorderSubTopics(topic.id, dragSubIndex, subIndex)
          }
          style={{
            marginLeft: 20,
            marginTop: 8,
            paddingLeft: 10,
            borderLeft: "2px solid #ddd",
            cursor: "grab",
          }}
        >
          <strong style={{ display: "flex", gap: 6 }}>
            📁 {sub.title}
            <button
              onClick={() =>
                editSubTopic(
                  topic.id,
                  sub.id,
                  prompt("Edit sub-topic", sub.title)
                )
              }
            >
              ✏️
            </button>
            <button
              onClick={() => deleteSubTopic(topic.id, sub.id)}
            >
              🗑
            </button>
            <button
              onClick={() =>
                addQuestion(
                  topic.id,
                  sub.id,
                  prompt("Question name")
                )
              }
            >
              ➕ Question
            </button>
          </strong>

          {/* ---------- QUESTIONS ---------- */}
          <ul style={{ marginLeft: 20 }}>
            {sub.questions.map((q, qIndex) => (
              <li
                key={q.id}
                draggable
                onDragStart={() => setDragQIndex(qIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() =>
                  reorderQuestions(
                    topic.id,
                    sub.id,
                    dragQIndex,
                    qIndex
                  )
                }
                style={{
                  cursor: "grab",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={q.done}
                  onChange={() =>
                    toggleQuestion(topic.id, sub.id, q.id)
                  }
                />

                <span
                  style={{
                    textDecoration: q.done
                      ? "line-through"
                      : "none",
                  }}
                >
                  {q.title}
                </span>

                <button
                  onClick={() => {
                    const newTitle = prompt(
                      "Edit question",
                      q.title
                    );
                    if (newTitle && newTitle.trim()) {
                      editQuestion(
                        topic.id,
                        sub.id,
                        q.id,
                        newTitle.trim()
                      );
                    }
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={() =>
                    deleteQuestion(topic.id, sub.id, q.id)
                  }
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
