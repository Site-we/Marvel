function searchMovie() {
  const query = document.getElementById("search").value.trim().replace(/\s+/g, "").toLowerCase();

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  resultContainer.innerHTML = "";

  if (query) {
    const imagePath = `Movies/${query}/${query}.jpg`;
    const txtPath = `Movies/${query}/${query}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
        <a id="download-btn" href="${txtPath}" target="_blank" download>Download</a>
      `;
      gallery.style.display = "none";
    };

    img.onerror = function () {
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and file structure.</p>
      `;
      gallery.style.display = "grid";
    };
  } else {
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    gallery.style.display = "grid";
  }
}

document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});
