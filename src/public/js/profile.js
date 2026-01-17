const API = "/api";
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

// Učitavanje profila
async function loadProfile() {
  const res = await fetch(`${API}/users/me`, {
    credentials: "include"
  });

  if (!res.ok) {
    alert("Niste prijavljeni");
    window.location.href = "/";
    return;
  }

  const user = await res.json();
  nameInput.value = user.name;
  emailInput.value = user.email;
}

loadProfile();

// Update profila
document.getElementById("profileForm").addEventListener("submit", async e => {
  e.preventDefault();

  const res = await fetch(`${API}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: nameInput.value
    })
  });

  if (res.ok) {
    alert("Profil ažuriran");
  } else {
    alert("Greška pri ažuriranju");
  }
});

// Brisanje naloga
document.getElementById("deleteAccount").addEventListener("click", async () => {
  if (!confirm("Da li ste sigurni? Ova akcija je trajna.")) return;

  const res = await fetch(`${API}/users/me`, {
    method: "DELETE",
    credentials: "include"
  });

  if (res.ok) {
    alert("Nalog obrisan");
    window.location.href = "/";
  }
});
