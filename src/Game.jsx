import { useState } from "react";

const initial = [
  "requisiti ops",
  "sopralluogo gru",
  "installazione telecamere",
  "interconnessione con il TOS",
  "test funzionali",
  "test sul campo",
  "go live"
];

const correct = [...initial];

export default function Game({ onFinish }) {
  const [items, setItems] = useState(
    [...initial].sort(() => Math.random() - 0.5)
  );
  const [checked, setChecked] = useState(false);

  const moveUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index], newItems[index - 1]] =
      [newItems[index - 1], newItems[index]];
    setItems(newItems);
  };

  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] =
      [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  const handleCheck = () => {
  let T = 0;

  items.forEach((item, i) => {
    if (item === correct[i]) T += 1;
    else T += 2;
  });

  setChecked(true);

  setTimeout(() => {
    onFinish(T);
  }, 1500);
};

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Ordina le attività</h2>

      {items.map((item, index) => {
        let bg = "white";

        if (checked) {
          bg =
            item === correct[index]
              ? "#4CAF50"
              : "#E53935";
        }

        return (
          <div
            key={item}
            style={{
              padding: 12,
              margin: 8,
              border: "2px solid #333",
              background: bg,
              color: "black",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>{item}</span>

            <div>
              <button onClick={() => moveUp(index)}>↑</button>
              <button onClick={() => moveDown(index)}>↓</button>
            </div>
          </div>
        );
      })}

      <button onClick={handleCheck}>
        Conferma sequenza
      </button>
    </div>
  );
}