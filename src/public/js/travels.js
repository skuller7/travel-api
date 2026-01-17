const container = document.getElementById("travels");

async function loadTravels() {
  const res = await fetch("/api/travels");
  const data = await res.json();

  container.innerHTML = "";
  data.forEach(t => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${t.name}</h3>
      <p>${t.destination.name}</p>
      <p>${t.price} €</p>
    `;
    container.appendChild(div);
  });
}

loadTravels();
