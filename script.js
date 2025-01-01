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
  if (!gallery) {
    console.error("Gallery element not found.");
    return;
  }
  
  gallery.innerHTML = ''; // Clear any existing gallery content

  if (movies.length === 0) {
    gallery.innerHTML = `<p>No movies found in the dataset.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const imgElement = document.createElement("img");

    // Ensure the movie object has a name
    if (!movie.name) {
      console.warn("Movie object missing 'name' property:", movie);
      return;
    }

    // Construct the image path
    const formattedName = movie.name.replace(/\s+/g, "").toLowerCase();
    imgElement.src = `Movies/${formattedName}/${formattedName}.jpg`;
    imgElement.alt = movie.name;
    imgElement.title = movie.name;

    // Handle click event
    imgElement.onclick = () => searchMovieByImage(movie.name);

    imgElement.onerror = () => {
      console.error(`Image not found for movie: ${movie.name}`);
      imgElement.src = 'fallback.jpg'; // Optional fallback image
    };

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

// Check if the system is in dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  createBinaryRain();
}

function createBinaryRain() {
  const binaryCanvas = document.createElement("canvas");
  binaryCanvas.id = "binary-rain";
  document.body.appendChild(binaryCanvas);

  const ctx = binaryCanvas.getContext("2d");
  binaryCanvas.width = window.innerWidth;
  binaryCanvas.height = window.innerHeight;

  const fontSize = 16;
  const columns = Math.floor(binaryCanvas.width / fontSize);
  const drops = Array(columns).fill(1); // Initialize drop positions

  function drawBinaryRain() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Slightly fade the canvas
    ctx.fillRect(0, 0, binaryCanvas.width, binaryCanvas.height);

    ctx.fillStyle = "#00FF00"; // Light green binary numbers
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = Math.random() > 0.5 ? "1" : "0"; // Random binary number
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Reset drop position if it goes off-screen or randomly
      if (y > binaryCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  setInterval(drawBinaryRain, 50); // Refresh rate for the animation
}

// Adjust canvas size on window resize
window.addEventListener("resize", () => {
  const binaryCanvas = document.getElementById("binary-rain");
  if (binaryCanvas) {
    binaryCanvas.width = window.innerWidth;
    binaryCanvas.height = window.innerHeight;
  }
});
