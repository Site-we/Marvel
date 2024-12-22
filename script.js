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
        <button id="download-btn" onclick="fetchAndDownload('${txtPath}', '${query}')">Download</button>
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

// Fetch the URL from the TXT file and download the linked content
function fetchAndDownload(txtPath, movieName) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch the download link.");
      }
      return response.text();
    })
    .then((downloadUrl) => {
      // Trim the URL and initiate a download
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

// Event listener for gallery image clicks
function searchMovieByImage(movieName) {
  const searchInput = document.getElementById("search");
  searchInput.value = movieName; // Fill the search bar with the movie name
  searchMovie(); // Trigger the search functionality
}

// Detect back button press and refresh the page
window.addEventListener('popstate', function () {
  location.reload(); // Refresh the page
});

// Optional: Push a state to history when the page loads, to detect back action
window.history.pushState({}, document.title, window.location.href);

// Search on pressing Enter key
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Call the search function
    this.blur(); // Close the keyboard
  }
});
