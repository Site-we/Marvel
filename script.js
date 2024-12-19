function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim();  // Get the search query and trim any extra spaces
  const formattedQuery = query.replace(/\s+/g, "").toLowerCase();  // Format the query for file paths

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");
  const downloadBtn = document.getElementById("download-btn");

  resultContainer.innerHTML = "";
  downloadBtn.style.display = "none";  // Hide the button initially

  if (formattedQuery) {
    const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
    const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
      `;
      gallery.style.display = "none";  // Hide the gallery while showing the result

      // Show the download button
      downloadBtn.style.display = "inline-block";
      // Set the download button's onclick action to trigger the fetchAndDownload function
      downloadBtn.onclick = function () {
        fetchAndDownload(txtPath, query);
      };
    };

    img.onerror = function () {
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and file structure.</p>
      `;
      gallery.style.display = "grid";  // Show the gallery again if no result
    };
  } else {
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    gallery.style.display = "grid";  // Show the gallery if no input was provided
  }
}

function fetchAndDownload(txtPath, movieName) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch the download link.");
      }
      return response.text();
    })
    .then((downloadUrl) => {
      const trimmedUrl = downloadUrl.trim();

      const a = document.createElement("a");
      a.href = trimmedUrl;
      a.download = movieName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
