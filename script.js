// Function to handle movie search
function searchMovie() {
  // Get the user's search query and process it
  const query = document.getElementById("search").value.trim().replace(/\s+/g, "").toLowerCase();

  // Reference to the search result container and the gallery
  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  // Clear previous results
  resultContainer.innerHTML = "";

  if (query) {
    // Construct the expected image and text file paths
    const imagePath = `Movies/${query}/${query}.jpg`;
    const txtPath = `Movies/${query}/${query}.txt`;

    // Create an image element to check if the file exists
    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      // If the image loads successfully, display it and add the download button
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
        <button id="download-btn" onclick="downloadFile('${txtPath}', '${query}')">Download</button>
      `;
      // Hide the gallery
      gallery.style.display = "none";
    };

    img.onerror = function () {
      // If the image doesn't exist, show an error message
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and file structure.</p>
      `;
      // Show the gallery in case of an error
      gallery.style.display = "grid";
    };
  } else {
    // Display an error message if the input is empty
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    // Show the gallery
    gallery.style.display = "grid";
  }
}

// Function to handle Enter key press
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});

// Function to download the TXT file
function downloadFile(filePath, movieName) {
  fetch(filePath)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Download link not found.");
      }
    })
    .then((content) => {
      // Create a download link dynamically
      const a = document.createElement("a");
      a.href = content.trim(); // The content of the TXT file is treated as the download link
      a.download = `${movieName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error) => {
      alert(error.message);
    });
}
