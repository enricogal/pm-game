import { useState } from "react";
import Game from "./Game";
import Result from "./Result";
import ResourceGame from "./ResourceGame";

function App() {
  const [screen, setScreen] = useState("home");
  const [T, setT] = useState(0);
  const [C, setC] = useState(0);

  // HOME
  if (screen === "home") {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>PM Simulator</h1>
        <button onClick={() => setScreen("order")}>
          Inizia
        </button>
      </div>
    );
  }

  // FASE 1 — ORDINE
  if (screen === "order") {
    return (
      <Game
        onFinish={(scoreT) => {
          setT(scoreT);
          setScreen("resources");
        }}
      />
    );
  }

  // FASE 2 — RISORSE
  if (screen === "resources") {
    return (
      <ResourceGame
  T={T}
  setT={setT}
  onFinish={(scoreC) => {
    setC(scoreC);
    setScreen("result");
  }}
/>
    );
  }

  // RISULTATO FINALE
  if (screen === "result") {
    return (
      <Result
  T={T}
  C={C}
  onRetry={() => setScreen("home")}
/>
    );
  }
}

export default App;