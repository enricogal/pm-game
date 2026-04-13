import { useState } from "react";

const resources = ["OPS", "ENG", "IT", "Gru", "Fornitore"];

const projects = {
  ocr: {
    activities: [
      "requisiti ops",
      "sopralluogo gru",
      "installazione telecamere",
      "interconnessione con il TOS",
      "test funzionali",
      "test sul campo",
      "go live"
    ],
    correctResources: {
      "requisiti ops": ["OPS"],
      "sopralluogo gru": ["OPS","ENG","IT","Fornitore","Gru"],
      "installazione telecamere": ["ENG","IT","Fornitore","Gru"],
      "interconnessione con il TOS": ["IT","Fornitore","Gru"],
      "test funzionali": ["ENG","IT","Gru","Fornitore"],
      "test sul campo": ["OPS","Gru","Fornitore"],
      "go live": ["OPS","ENG","IT","Fornitore","Gru"]
    }
  },

  ferrovia: {
    activities: [
      "analisi flusso ferroviario",
      "rilievo infrastruttura",
      "installazione sensori",
      "integrazione sistema controllo",
      "configurazione logiche automazione",
      "test operativi",
      "avvio esercizio"
    ],
    correctResources: {
      "analisi flusso ferroviario": ["OPS","ENG"],
      "rilievo infrastruttura": ["OPS","ENG","Gru"],
      "installazione sensori": ["ENG","Fornitore"],
      "integrazione sistema controllo": ["IT","ENG","Fornitore"],
      "configurazione logiche automazione": ["IT","ENG"],
      "test operativi": ["OPS","ENG","Gru"],
      "avvio esercizio": ["OPS","IT"]
    }
  }
};

const riskDeck = ["OPS", "ENG", "IT", "Gru", "Fornitore"];

export default function ResourceGame({ onFinish, T, setT, projectKey }) {
  const project = projects[projectKey];
  const activities = project.activities;
  const correctResources = project.correctResources;

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

  const primaryButton = {
    marginTop: 20,
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  };

  const secondaryButton = {
    marginTop: 10,
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    background: "#e5e7eb",
    color: "#111",
    fontWeight: "600",
    cursor: "pointer"
  };

  const toggleResource = (res) => {
    if (selected.includes(res)) {
      setSelected(selected.filter(r => r !== res));
    } else {
      setSelected([...selected, res]);
    }
  };

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

  const acceptRisk = () => {
    const modified = selected.filter(r => r !== drawnRisk);
    resolveTurn(modified);
    setShowJollyChoice(false);
  };

  const useJolly = () => {
    const correct = correctResources[activities[turn]];

    let finalSel = [...selected];
    let C = 0;
    let Tgain = 0;
    let newT = T;
    let messages = [];

    if (correct.includes(drawnRisk)) {
      C += 1;
      messages.push(`Jolly usato su ${drawnRisk} → salvata (+1C)`);
    } else {
      C += 1;
      messages.push(`Jolly usato su ${drawnRisk} → non necessaria (+1C)`);
    }

    correct.forEach(r => {
      if (r === drawnRisk) return;

      if (finalSel.includes(r)) {
        C += 1;
      } else {
        C += 1;
        Tgain += 1;
        newT += 1;
        messages.push(`Manca ${r} → +1C +1T`);
      }
    });

    finalSel.forEach(r => {
      if (!correct.includes(r) && r !== drawnRisk) {
        C += 2;
        messages.push(`${r} inutile → +2C`);
      }
    });

    updateState(C, Tgain, newT, finalSel, messages);
    setJolly(jolly - 1);
  };

  const resolveTurn = (finalSel) => {
    const correct = correctResources[activities[turn]];

    let C = 0;
    let Tgain = 0;
    let newT = T;
    let messages = [];

    correct.forEach(r => {
      if (finalSel.includes(r)) {
        C += 1;
      } else {
        C += 1;
        Tgain += 1;
        newT += 1;
        messages.push(`Manca ${r} → +1C +1T`);
      }
    });

    finalSel.forEach(r => {
      if (!correct.includes(r)) {
        C += 2;
        messages.push(`${r} inutile → +2C`);
      }
    });

    updateState(C, Tgain, newT, finalSel, messages);
  };

  const updateState = (C, Tgain, newT, finalSel, messages) => {
    setTurnC(C);
    setTurnT(Tgain);
    setTotalC(totalC + C);
    setT(newT);
    setCorrectForTurn(correctResources[activities[turn]]);
    setFeedback(messages);
    setFinalSelected(finalSel);
    setShowJollyChoice(false);
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
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      padding: 20,
      background: "white",
      borderRadius: 16,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      textAlign: "center",
      color: "#111"
    }}>
      <h2 style={{ color: "#2563eb" }}>
        {activities[turn]}
      </h2>

      {!showResult && !showJollyChoice && (
        <>
          {resources.map(r => (
            <button key={r} onClick={() => toggleResource(r)}>
              {r}
            </button>
          ))}
          <button onClick={handleConfirm} style={primaryButton}>Conferma</button>
        </>
      )}

      {showJollyChoice && (
        <>
          <p>Imprevisto: manca {drawnRisk}</p>
          {jolly > 0 && <button onClick={useJolly} style={primaryButton}>Usa Jolly</button>}
          <button onClick={acceptRisk} style={secondaryButton}>Accetta</button>
        </>
      )}

      {showResult && (
        <>
          <p>Risorse: {finalSelected.join(", ")}</p>
          <p>Corrette: {correctForTurn.join(", ")}</p>
          <p>+{turnC}C +{turnT}T</p>
          <button onClick={nextTurn} style={primaryButton}>Continua</button>
        </>
      )}
    </div>
  );
}