function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim(); // Keep original search text
  const formattedQuery = query.replace(/\s+/g, "").toLowerCase(); // Format query for file paths

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  resultContainer.innerHTML = ""; // Clear previous results

  if (formattedQuery) {
    const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
    const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      // Add search result with buttons
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
        <button id="download-btn" onclick="redirectToDownload('${formattedQuery}')">Download</button>
        <br>
        <button id="mx-player-btn" onclick="playWithMXPlayer('${txtPath}')">Play with MX Player</button>
      `;
      gallery.style.display = "none"; // Hide the gallery
    };

    img.onerror = function () {
      // Display "no result found" message
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and file structure.</p>
      `;
      gallery.style.display = "grid"; // Show the gallery
    };
  } else {
    // Display message for empty input
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    gallery.style.display = "grid"; // Show the gallery
  }

  // Clear the search input after performing the search
  searchInput.value = ''; // Clear the search bar
}

// Redirect to download.html with the folder name stored in local storage
function redirectToDownload(folderName) {
  localStorage.setItem("movieFolderName", folderName); // Save folder name to local storage
  window.location.href = "download.html"; // Redirect to download.html
}

// Play the video with MX Player using the link from the TXT file
function playWithMXPlayer(txtPath) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch the streaming link.");
      }
      return response.text();
    })
    .then((streamingUrl) => {
      const trimmedUrl = streamingUrl.trim();
      window.open(trimmedUrl, "_blank"); // Open the link in a new tab (replace with MX Player integration if needed)
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
