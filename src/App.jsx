import { useState } from "react";
import Game from "./Game";
import ResourceGame from "./ResourceGame";
import Result from "./Result";

function App() {
  const [screen, setScreen] = useState("home");
  const [T, setT] = useState(0);
  const [C, setC] = useState(0);

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        padding: 20
      }}
    >
      {/* HOME */}
      {screen === "home" && (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <h1 style={{ fontSize: 24, marginBottom: 20 }}>
            🚀 OCR Project: Mission Go-Live
          </h1>

          <button
            onClick={() => setScreen("order")}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 20px",
              borderRadius: 10
            }}
          >
            Inizia
          </button>
        </div>
      )}

      {/* FASE 1 */}
      {screen === "order" && (
        <Game
          onFinish={(scoreT) => {
            setT(scoreT);
            setScreen("resources");
          }}
        />
      )}

      {/* FASE 2 */}
      {screen === "resources" && (
        <ResourceGame
          T={T}
          setT={setT}
          onFinish={(scoreC) => {
            setC(scoreC);
            setScreen("result");
          }}
        />
      )}

      {/* RISULTATO */}
      {screen === "result" && (
        <Result
          T={T}
          C={C}
          onRetry={() => {
            setScreen("home");
            setT(0);
            setC(0);
          }}
        />
      )}
    </div>
  );
}

export default App;