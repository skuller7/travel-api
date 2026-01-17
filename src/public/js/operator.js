document.getElementById("createTravel").addEventListener("submit", async e => {
    e.preventDefault();
  
    await fetch("/api/travels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: name.value,
        price: price.value,
        destinationId: destinationId.value
      })
    });
  
    alert("Putovanje kreirano");
  });
  