export default function Result({ T, C, onRetry }) {
  let level = "Junior PM";
  let message = "";

  if (T <= 10 && C <= 20) {
    level = "Senior PM 🏆";
    message = "Gestione eccellente di tempo e costi.";
  } else if (T <= 15 && C <= 30) {
    level = "PM 👍";
    message = "Buona gestione, ma migliorabile.";
  } else {
    level = "Junior PM";
    message = "Attenzione a sprechi e inefficienze.";
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Risultato Finale</h2>

      <h3>Tempo (T): {T}</h3>
      <h3>Costi (C): {C}</h3>

      <h2>{level}</h2>
      <p>{message}</p>

      <button onClick={onRetry}>Riprova</button>
    </div>
  );
}