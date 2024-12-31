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
    displayMovies(); // Display movies on the main page
  })
  .catch(error => {
    console.error("Error loading movies.json:", error);
  });

// Display movie images on the main page
function displayMovies() {
  const gallery = document.getElementById("gallery");

  // Clear the gallery before adding new movies
  gallery.innerHTML = '';

  // Loop through the movies and create images for the gallery
  movies.forEach(movie => {
    const img = document.createElement('img');
    img.src = `Movies/${movie.name.toLowerCase().replace(/\s+/g, '')}/${movie.name.toLowerCase().replace(/\s+/g, '')}.jpg`;
    img.alt = movie.name;
    img.onclick = function() {
      searchMovieByImage(movie.name); // Search when the image is clicked
    };
    
    // Append the image to the gallery
    gallery.appendChild(img);
  });
}

// Search for the movie
function searchMovie() {
  const searchInput = document.getElementById("search");
  let query = searchInput.value.trim(); // Get the input text and trim whitespace
  query = formatMovieName(query); // Format the movie name to match the file structure

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  resultContainer.innerHTML = ""; // Clear previous results

  if (query) {
    const imagePath = `Movies/${query}/${query}.jpg`;
    const txtPath = `Movies/${query}/${query}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      // Add search result with buttons
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
        <button id="download-btn" onclick="redirectToDownload('${query}')">Download</button>
        <br>
        <button id="mx-player-btn" onclick="redirectToMXPlayer('${query}')">Play with MX Player</button>
      `;
      
      // Animate the search results
      resultContainer.style.display = "block";  // Show the result container
      resultContainer.classList.add("fade-in"); // Add animation class
      gallery.style.display = "none"; // Hide the gallery
    };

    img.onerror = function () {
      // Fallback to alternative search
      fallbackSearch(query, resultContainer, gallery);
    };
  } else {
    // Display message for empty input
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    resultContainer.style.display = "block";  // Show the result container
    resultContainer.classList.add("fade-in"); // Add animation class
    gallery.style.display = "grid"; // Show the gallery
  }

  // Clear the search input after performing the search
  searchInput.value = ''; // Clear the search bar
}

// Fallback logic for alternative search
function fallbackSearch(query, resultContainer, gallery) {
  const normalizedQuery = normalizeString(query);
  let matchedMovie = null;

  // Search through the loaded movies dataset
  movies.forEach((movie) => {
    movie.keywords.forEach((keyword) => {
      if (fuzzyMatch(normalizedQuery, normalizeString(keyword))) {
        matchedMovie = movie;
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
    resultContainer.style.display = "block";  // Show the result container
    resultContainer.classList.add("fade-in"); // Add animation class
    gallery.style.display = "grid"; // Show the gallery
  }
}

// Normalize strings for consistency (e.g., remove extra spaces, lowercase)
function normalizeString(str) {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

// Fuzzy match function to check if a keyword is part of the search input
function fuzzyMatch(input, keyword) {
  return normalizeString(input).includes(normalizeString(keyword));
}

// Function to format the movie name, e.g., remove spaces or standardize the name
function formatMovieName(query) {
  return query.replace(/\s+/g, '').toLowerCase();  // Remove spaces and make lowercase
}

// Search by image or programmatically fill input and search
function searchMovieByImage(movieName) {
  const formattedQuery = movieName.replace(/\s+/g, "").toLowerCase(); // Format query for file paths
  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
  const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

  const img = new Image();
  img.src = imagePath;

  img.onload = function () {
    // Add search result with buttons
    resultContainer.innerHTML = `
      <h2>Result for "${movieName}"</h2>
      <img src="${imagePath}" alt="${movieName}">
      <br>
      <button id="download-btn" onclick="redirectToDownload('${formattedQuery}')">Download</button>
      <br>
      <button id="mx-player-btn" onclick="redirectToMXPlayer('${formattedQuery}')">Play with MX Player</button>
    `;
    resultContainer.style.display = "block";  // Show the result container
    resultContainer.classList.add("fade-in"); // Add animation class
    gallery.style.display = "none"; // Hide the gallery
  };

  img.onerror = function () {
    resultContainer.innerHTML = `
      <h2>No results found for "${movieName}"</h2>
      <p>Make sure the movie name matches the folder and file structure.</p>
    `;
    gallery.style.display = "grid"; // Show the gallery
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

// Search on pressing Enter key
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Call the search function
    this.blur(); // Close the keyboard
  }
});
