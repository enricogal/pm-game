export default function Result({ T, C, onRetry }) {
  let level = "Junior PM";

  if (T <= 10 && C <= 20) level = "Senior PM 🏆";
  else if (T <= 15 && C <= 30) level = "PM 👍";

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Risultato</h2>
      <p>Tempo: {T}</p>
      <p>Costi: {C}</p>
      <h3>{level}</h3>
      <button onClick={onRetry}>Riprova</button>
    </div>
  );
}