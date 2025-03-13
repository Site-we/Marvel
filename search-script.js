let movies = [];
// Load movies from JSON file
fetch('movies.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load movies dataset.');
    }
    return response.json();
  })
  .then(data => {
    movies = data; // Save loaded movies
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
      searchMovie(query);
    }
  })
  .catch(error => {
    console.error("Error loading movies.json:", error);
  });

// Search for the movie
function searchMovie(query) {
  const resultContainer = document.getElementById("search-result");

  resultContainer.innerHTML = ""; // Clear previous results

  if (query) {
    const formattedQuery = query.replace(/\s+/g, "").toLowerCase();
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
        <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedQuery}')">Play with MX Player</button>
      `;
      // Apply fade-in animation to the search result
      resultContainer.classList.add("fade-in");
    };

    img.onerror = function () {
      // Fallback to alternative search
      fallbackSearch(query, resultContainer);
    };
  } else {
    // Display message for empty input
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
  }
}

// Fallback logic for alternative search
function fallbackSearch(query, resultContainer) {
  let matchedMovie = null;

  // Search through the loaded movies dataset
  movies.forEach((movie) => {
    movie.keywords.forEach((keyword) => {
      // Directly compare the query with the keyword (no normalization)
      if (fuzzyMatch(query, keyword)) {
        matchedMovie = movie; // Set matched movie if a match is found
      }
    });
  });

  if (matchedMovie) {
    // Automatically search for the matched movie
    searchMovieByImage(matchedMovie.name);
  } else {
    resultContainer.innerHTML = `
      <h2>No results found for "${query}"</h2>
      <p>Make sure the movie name matches the folder and file structure.</p>
    `;
    resultContainer.style.display = "block"; // Show the result container
    resultContainer.classList.add("fade-in"); // Add animation class
  }
}

// Normalize strings for consistency (e.g., remove extra spaces, lowercase)
function normalizeString(str) {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

// Fuzzy match function to check if a keyword is part of the search input
function fuzzyMatch(input, keyword) {
  return input.toLowerCase().includes(keyword.toLowerCase());
}

// Search by image or programmatically fill input and search
function searchMovieByImage(movieName) {
  const formattedQuery = movieName.replace(/\s+/g, "").toLowerCase(); // Format query for file paths
  const resultContainer = document.getElementById("search-result");

  const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
  const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

  const img = new Image();
  img.src = imagePath;

  img.onload = function () {
    resultContainer.innerHTML = `
      <h2>Result for "${movieName}"</h2>
      <img src="${imagePath}" alt="${movieName}">
      <br>
      <button id="download-btn" onclick="redirectToDownload('${formattedQuery}')">Download</button>
      <br>
      <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedQuery}')">Play with MX Player</button>
    `;
    // Apply fade-in animation to the search result
    resultContainer.classList.add("fade-in");
  };

  img.onerror = function () {
    resultContainer.innerHTML = `
      <h2>No results found for "${movieName}"</h2>
      <p>Make sure the movie name matches the folder and file structure.</p>
    `;
  };
}

// Redirect to download.html with the folder name stored in local storage
function redirectToDownload(folderName) {
  localStorage.setItem("movieFolderName", folderName); // Save folder name to local storage
  window.location.href = "download.html"; // Redirect to download.html
}

// Redirect to mxplayer.html with the folder name stored in local storage
function redirectToMXPlayer(folderName) {
  localStorage.setItem("movieFolderName", folderName); // Save folder name to local storage
  window.location.href = "mxplayer.html"; // Redirect to mxplayer.html
}
