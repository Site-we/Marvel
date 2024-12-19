function searchMovieByImage(movieName) {
  const searchInput = document.getElementById("search");
  searchInput.value = movieName; // Set the search input value to the full movie name
  searchMovie(); // Trigger the search
}

function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim(); // Get the user input and trim spaces

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");
  const downloadBtn = document.getElementById("download-btn");

  resultContainer.innerHTML = ""; // Clear previous search results
  downloadBtn.style.display = "none"; // Hide the download button initially

  if (query === "") {
    // Handle empty input
    searchInput.placeholder = "Please search a movie..."; // Update placeholder text
    searchInput.value = ""; // Clear the input field
    gallery.style.display = "grid"; // Show the gallery again
    return; // Exit the function
  }

  const formattedQuery = query.replace(/\s+/g, "").toLowerCase(); // Format input for file paths
  const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
  const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

  const img = new Image();
  img.src = imagePath;

  img.onload = function () {
    // Display search result
    resultContainer.innerHTML = `
      <h2>Result for "${query}"</h2>
      <img src="${imagePath}" alt="${query}">
    `;
    gallery.style.display = "none"; // Hide the gallery

    // Show and configure the download button
    downloadBtn.style.display = "inline-block";
    downloadBtn.onclick = function () {
      fetchAndDownload(txtPath, query);
    };
  };

  img.onerror = function () {
    // Handle invalid search
    resultContainer.innerHTML = `
      <h2>No results found for "${query}"</h2>
      <p>Make sure the movie name matches the folder and file structure.</p>
    `;
    gallery.style.display = "grid"; // Show the gallery again
  };
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

document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Call the search function
    this.blur(); // Close the keyboard
  }
});
