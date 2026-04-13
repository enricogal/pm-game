import { useState } from "react";

const activities = [
  "requisiti ops",
  "sopralluogo gru",
  "installazione telecamere",
  "interconnessione con il TOS",
  "test funzionali",
  "test sul campo",
  "go live"
];

const resources = ["OPS", "ENG", "IT", "Gru", "Fornitore"];

const correctResources = {
  "requisiti ops": ["OPS"],
  "sopralluogo gru": ["OPS","ENG","IT","Fornitore","Gru"],
  "installazione telecamere": ["ENG","IT","Fornitore","Gru"],
  "interconnessione con il TOS": ["IT","Fornitore","Gru"],
  "test funzionali": ["ENG","IT","Gru","Fornitore"],
  "test sul campo": ["OPS","Gru","Fornitore"],
  "go live": ["OPS","ENG","IT","Fornitore","Gru"]
};

const riskDeck = ["OPS", "ENG", "IT", "Gru", "Fornitore"];

export default function ResourceGame({ onFinish, T, setT }) {
  const [turn, setTurn] = useState(0);
  const [selected, setSelected] = useState([]);
  const [finalSelected, setFinalSelected] = useState([]);

  const [totalC, setTotalC] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const [showJollyChoice, setShowJollyChoice] = useState(false);

  const [correctForTurn, setCorrectForTurn] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [turnC, setTurnC] = useState(0);
  const [turnT, setTurnT] = useState(0);

  const [drawnRisk, setDrawnRisk] = useState(null);

  const [jolly, setJolly] = useState(2);

  const toggleResource = (res) => {
    if (selected.includes(res)) {
      setSelected(selected.filter(r => r !== res));
    } else {
      setSelected([...selected, res]);
    }
  };

  // 🎴 pesca imprevisto
  const handleConfirm = () => {
    const activity = activities[turn];

    if (
      activity !== "test funzionali" &&
      activity !== "test sul campo"
    ) {
      const drawn =
        riskDeck[Math.floor(Math.random() * riskDeck.length)];

      setDrawnRisk(drawn);
      setShowJollyChoice(true);
    } else {
      resolveTurn(selected);
    }
  };

  // ❌ accetta imprevisto
  const acceptRisk = () => {
    const modified = selected.filter(r => r !== drawnRisk);
    resolveTurn(modified);
    setShowJollyChoice(false);
  };

  // 🃏 usa jolly (NUOVA LOGICA CORRETTA)
  const useJolly = () => {
    const activity = activities[turn];
    const correct = correctResources[activity];

    let finalSel = [...selected]; // NON rimuoviamo la risorsa
    let C = 0;
    let Tgain = 0;
    let newT = T;
    let messages = [];
    let isPerfect = true;

    // gestione risorsa salvata dal jolly
    if (correct.includes(drawnRisk)) {
      // ✔️ necessaria → solo costo normale
      C += 1;
      messages.push(
        `Hai usato il jolly su ${drawnRisk} → risorsa salvata (+1C)`
      );
    } else {
      // ❌ non necessaria → solo costo base
      C += 1;
      messages.push(
        `Hai usato il jolly su ${drawnRisk} (non necessaria) → +1C`
      );
      isPerfect = false;
    }

    // altre risorse
    correct.forEach(r => {
      if (r === drawnRisk) return;

      if (finalSel.includes(r)) {
        C += 1;
      } else {
        C += 1;
        Tgain += 1;
        newT += 1;
        messages.push(`Hai dimenticato ${r} → +1C +1T`);
        isPerfect = false;
      }
    });

    // inutili
    finalSel.forEach(r => {
      if (!correct.includes(r) && r !== drawnRisk) {
        C += 2;
        messages.push(`Hai chiamato ${r} inutilmente → +2C`);
        isPerfect = false;
      }
    });

    if (isPerfect) {
      messages.push("Ottima gestione del rischio con il jolly ✅");
    }

    setTurnC(C);
    setTurnT(Tgain);

    setTotalC(totalC + C);
    setT(newT);

    setCorrectForTurn(correct);
    setFeedback(messages);
    setFinalSelected(finalSel);

    setJolly(jolly - 1);
    setShowJollyChoice(false);
    setShowResult(true);
  };

  // 🧠 turno normale (senza jolly)
  const resolveTurn = (finalSel) => {
    const activity = activities[turn];
    const correct = correctResources[activity];

    let C = 0;
    let Tgain = 0;
    let newT = T;
    let messages = [];
    let isPerfect = true;

    correct.forEach(r => {
      if (finalSel.includes(r)) {
        C += 1;
      } else {
        C += 1;
        Tgain += 1;
        newT += 1;
        messages.push(`Hai perso ${r} → +1C +1T`);
        isPerfect = false;
      }
    });

    finalSel.forEach(r => {
      if (!correct.includes(r)) {
        C += 2;
        messages.push(`Hai chiamato ${r} inutilmente → +2C`);
        isPerfect = false;
      }
    });

    if (isPerfect) {
      messages.push("Perfetto! Tutto corretto ✅");
    }

    setTurnC(C);
    setTurnT(Tgain);

    setTotalC(totalC + C);
    setT(newT);

    setCorrectForTurn(correct);
    setFeedback(messages);
    setFinalSelected(finalSel);

    setShowResult(true);
  };

  const nextTurn = () => {
    if (turn === activities.length - 1) {
      onFinish(totalC);
    } else {
      setTurn(turn + 1);
      setSelected([]);
      setFinalSelected([]);
      setFeedback([]);
      setTurnC(0);
      setTurnT(0);
      setDrawnRisk(null);
      setShowResult(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Attività: {activities[turn]}</h2>

      {!showResult && !showJollyChoice && (
        <>
          <div>
            {resources.map(r => (
              <button
                key={r}
                onClick={() => toggleResource(r)}
                style={{
                  margin: 5,
                  padding: 10,
                  background: selected.includes(r) ? "#2E7D32" : "#ddd",
                  color: selected.includes(r) ? "white" : "black"
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <button onClick={handleConfirm}>Conferma</button>
        </>
      )}

      {showJollyChoice && (
        <div>
          <h3>Imprevisto!</h3>
          <p>Mancanza risorsa: {drawnRisk}</p>

          {jolly > 0 && (
            <button onClick={useJolly}>
              Usa Jolly ({jolly} rimasti)
            </button>
          )}

          <button onClick={acceptRisk}>
            Accetta imprevisto
          </button>
        </div>
      )}

      {showResult && (
        <div>
          {drawnRisk && <p>Imprevisto: {drawnRisk}</p>}

          <p>Risorse effettive: {finalSelected.join(", ")}</p>

          <h4>Soluzione corretta:</h4>
          <p>{correctForTurn.join(", ")}</p>

          <h4>Feedback:</h4>
          <ul style={{ listStyle: "none" }}>
            {feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <h4>Risultato turno:</h4>
          <p>+{turnC} C</p>
          <p>+{turnT} T</p>

          <button onClick={nextTurn}>Continua</button>
        </div>
      )}

      <p>Turno {turn + 1} / 7</p>
      <p>Costi (C): {totalC}</p>
      <p>Tempo (T): {T}</p>
      <p>Jolly: {jolly}</p>
    </div>
  );
}