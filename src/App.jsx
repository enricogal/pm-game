import { useState } from "react";
import Game from "./Game";
import ResourceGame from "./ResourceGame";
import Result from "./Result";

function App() {
  const [screen, setScreen] = useState("home");
  const [T, setT] = useState(0);
  const [C, setC] = useState(0);
  const [project, setProject] = useState(null);

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      
      {/* HOME */}
      {screen === "home" && (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <h1 style={{ fontSize: 24 }}>🚀 Mission Go-Live</h1>

          <p>Scegli progetto:</p>

          <button
            onClick={() => {
              setProject("ocr");
              setScreen("order");
            }}
            style={{ margin: 10 }}
          >
            OCR Project
          </button>

          <button
            onClick={() => {
              setProject("ferrovia");
              setScreen("order");
            }}
            style={{ margin: 10 }}
          >
            Semi automazione gru ferrovia
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
          projectKey={project}
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