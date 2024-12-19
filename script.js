function searchMovie(queryFromImage = null) {
  const searchInput = document.getElementById("search");
  const query = queryFromImage || searchInput.value.trim(); // Get query from image click or input value

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");
  const downloadBtn = document.getElementById("download-btn");

  // Clear previous results and reset UI components for each new search
  resultContainer.innerHTML = ""; // Clear previous search result
  downloadBtn.style.display = "none"; // Hide the download button initially
  searchInput.placeholder = "Search your favorite Marvel movie..."; // Reset placeholder text
  gallery.style.display = "grid"; // Always show gallery initially

  if (!query) {
    // If no input is provided, show the message and return
    searchInput.placeholder = "Please enter a movie to search...";
    return;
  }

  const formattedQuery = query.replace(/\s+/g, "").toLowerCase(); // Format input for file paths
  const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
  const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

  const img = new Image();
  img.src = imagePath;

  img.onload = function () {
    // Show result when image is successfully loaded
    resultContainer.innerHTML = `
      <h2>Result for "${query}"</h2>
      <img src="${imagePath}" alt="${query}">
    `;
    gallery.style.display = "none"; // Hide the gallery if result found

    // Show download button for valid movie
    downloadBtn.style.display = "inline-block";
    downloadBtn.onclick = function () {
      fetchAndDownload(txtPath, query);
    };
  };

  img.onerror = function () {
    // Show error message when image is not found
    resultContainer.innerHTML = `
      <h2>No results found for "${query}"</h2>
      <p>Please ensure the movie name is correct and matches the file structure.</p>
    `;
    gallery.style.display = "grid"; // Show gallery again if no result
  };

  // Reset search input for new search
  searchInput.value = "";
}

// Function to handle download from .txt file
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

// Trigger search when pressing Enter
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Trigger search on Enter key press
    this.blur(); // Close the keyboard
  }
});

// Add click event listeners to gallery images
document.querySelectorAll(".gallery img").forEach((image) => {
  image.addEventListener("click", function () {
    const movieName = this.alt; // Use the alt attribute of the image as the movie name
    searchMovie(movieName); // Trigger search for that movie
  });
});
