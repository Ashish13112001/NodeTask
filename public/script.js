document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/cryptoData")
    .then((response) => response.json())
    .then((data) => {
      const cryptoDataContainer = document.getElementById("cryptoData");
      data.forEach((crypto) => {
        const cryptoDiv = document.createElement("div");
        cryptoDiv.classList.add("crypto");
        cryptoDiv.innerHTML = `
                    <h2>${crypto.name}</h2>
                    <p>Last: ${crypto.last}</p>
                    <p>Buy: ${crypto.buy}</p>
                    <p>Sell: ${crypto.sell}</p>
                    <p>Volume: ${crypto.volume}</p>
                    <p>Base Unit: ${crypto.base_unit}</p>
                `;
        cryptoDataContainer.appendChild(cryptoDiv);
      });
    })
    .catch((error) => console.error("Error fetching crypto data:", error));
});
