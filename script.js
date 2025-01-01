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
    displayMovies(); // Display the movies on the main page after loading the data
  })
  .catch(error => {
    console.error("Error loading movies.json:", error);
  });

// Display all movie images on the main page
function displayMovies() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = ''; // Clear any existing gallery content

  movies.forEach((movie) => {
    const imgElement = document.createElement("img");
    imgElement.src = `Movies/${movie.name.replace(/\s+/g, "").toLowerCase()}/${movie.name.replace(/\s+/g, "").toLowerCase()}.jpg`;
    imgElement.alt = movie.name;
    imgElement.onclick = () => searchMovieByImage(movie.name);
    gallery.appendChild(imgElement);
  });
}

// Search for the movie
function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim(); // Keep original search text
  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

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
      gallery.style.display = "none"; // Hide the gallery
      // Apply fade-in animation to the search result
      resultContainer.classList.add("fade-in");
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
    gallery.style.display = "grid"; // Show the gallery
  }

  // Clear the search input after performing the search
  searchInput.value = ''; // Clear the search bar
}

// Fallback logic for alternative search
function fallbackSearch(query, resultContainer, gallery) {
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
    gallery.style.display = "grid"; // Show the gallery
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
  const gallery = document.getElementById("gallery");

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
    gallery.style.display = "none"; // Hide the gallery

    // Apply fade-in animation to the search result
    resultContainer.classList.add("fade-in");
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
// Detect back button press and refresh the page
window.addEventListener('popstate', function () {
  location.reload(); // Refresh the page
});

// Optional: Push a state to history when the page loads, to detect back action
window.history.pushState({}, document.title, window.location.href);

const canvas = document.getElementById("binary-background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const binarySymbols = "01"; // Binary numbers
const fontSize = 16; // Font size for the binary characters
const columns = canvas.width / fontSize; // Number of columns based on font size

// Create an array of drops, one for each column
const drops = Array(Math.floor(columns)).fill(1);

let animationInterval = null;

function drawBinaryAnimation() {
  // Set a semi-transparent black background for fade effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set the font color and style
  ctx.fillStyle = "#0f0"; // Light green color
  ctx.font = `${fontSize}px monospace`;

  // Loop through each drop
  drops.forEach((y, x) => {
    const text = binarySymbols[Math.floor(Math.random() * binarySymbols.length)];
    ctx.fillText(text, x * fontSize, y * fontSize);

// Create binary animation in dark mode
function createBinaryAnimation() {
  const binaryContainer = document.createElement('div');
  binaryContainer.className = 'binary-container';
  document.body.appendChild(binaryContainer);

  const numberOfColumns = Math.floor(window.innerWidth / 20); // Adjust column count based on screen width
  for (let i = 0; i < numberOfColumns; i++) {
    const column = document.createElement('div');
    column.className = 'binary-column';
    column.style.left = `${i * 20}px`; // Space columns evenly
    column.style.animationDuration = `${Math.random() * 5 + 3}s`; // Random fall speed
    column.style.animationDelay = `${Math.random() * 5}s`; // Random start delay

    // Generate random binary numbers
    const binaryNumbers = Array.from({ length: 20 }, () =>
      Math.random() > 0.5 ? '1' : '0'
    ).join('<br>');
    column.innerHTML = binaryNumbers;

    binaryContainer.appendChild(column);
  }
}

// Detect dark mode and add binary animation
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  createBinaryAnimation();
}

// Reapply the animation if the theme changes dynamically
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (e.matches) {
    createBinaryAnimation();
  } else {
    const binaryContainer = document.querySelector('.binary-container');
    if (binaryContainer) binaryContainer.remove();
  }
});
