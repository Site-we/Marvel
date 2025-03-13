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
    const searchQuery = localStorage.getItem("searchQuery");
    if (searchQuery) {
      document.getElementById("search").value = searchQuery; // Display search text from local storage
      searchMovie(searchQuery); // Perform search with stored query
    }
  })
  .catch(error => {
    console.error("Error loading movies.json:", error);
  });

// Search for the movie
function searchMovie(query) {
  const searchInput = document.getElementById("search");
  const resultContainer = document.getElementById("search-result");

  if (!query) {
    query = searchInput.value.trim(); // Get query from input if not provided
  }

  resultContainer.innerHTML = ""; // Clear previous results

  if (query) {
    const formattedQuery = query.replace(/\s+/g, "").toLowerCase();
    const results = movies.filter(movie => fuzzyMatch(movie.name, query) || movie.keywords.some(keyword => fuzzyMatch(keyword, query)));

    if (results.length > 0) {
      results.forEach(movie => {
        const formattedName = movie.name.replace(/\s+/g, "").toLowerCase();
        const imagePath = `Movies/${formattedName}/${formattedName}.jpg`;

        const img = new Image();
        img.src = imagePath;

        img.onload = function () {
          resultContainer.innerHTML += `
            <h2>Result for "${movie.name}"</h2>
            <img src="${imagePath}" alt="${movie.name}">
            <br>
            <button id="download-btn" onclick="redirectToDownload('${formattedName}')">Download</button>
            <br>
            <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedName}')">Play with MX Player</button>
          `;
          // Apply fade-in animation to the search result
          resultContainer.classList.add("fade-in");
        };

        img.onerror = function () {
          resultContainer.innerHTML += `
            <h2>Result for "${movie.name}"</h2>
            <p>Image not found.</p>
            <br>
            <button id="download-btn" onclick="redirectToDownload('${formattedName}')">Download</button>
            <br>
            <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedName}')">Play with MX Player</button>
          `;
        };
      });
    } else {
      fallbackSearch(query, resultContainer);
    }
  } else {
    // Display message for empty input
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
  }

  // Clear the search input after performing the search
  searchInput.value = ''; // Clear the search bar
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
    // Display matched movie
    const formattedName = matchedMovie.name.replace(/\s+/g, "").toLowerCase();
    const imagePath = `Movies/${formattedName}/${formattedName}.jpg`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      resultContainer.innerHTML += `
        <h2>Result for "${matchedMovie.name}"</h2>
        <img src="${imagePath}" alt="${matchedMovie.name}">
        <br>
        <button id="download-btn" onclick="redirectToDownload('${formattedName}')">Download</button>
        <br>
        <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedName}')">Play with MX Player</button>
      `;
      // Apply fade-in animation to the search result
      resultContainer.classList.add("fade-in");
    };

    img.onerror = function () {
      resultContainer.innerHTML += `
        <h2>Result for "${matchedMovie.name}"</h2>
        <p>Image not found.</p>
        <br>
        <button id="download-btn" onclick="redirectToDownload('${formattedName}')">Download</button>
        <br>
        <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedName}')">Play with MX Player</button>
      `;
    };
  } else {
    resultContainer.innerHTML = `
      <h2>No results found for "${query}"</h2>
      <p>Make sure the movie name matches the folder and file structure.</p>
    `;
    resultContainer.style.display = "block"; // Show the result container
    resultContainer.classList.add("fade-in"); // Add animation class
  }
}

// Fuzzy match function to check if a keyword is part of the search input
function fuzzyMatch(input, keyword) {
  return input.toLowerCase().includes(keyword.toLowerCase());
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

// Search on pressing Enter key
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Call the search function
    this.blur(); // Close the keyboard
  }
});
