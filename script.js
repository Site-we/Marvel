function searchMovie() {
  // Get the user's search query
  const query = document.getElementById("search").value.trim().toLowerCase();

  // Reference to the search result container
  const resultContainer = document.getElementById("search-result");

  // Clear previous results
  resultContainer.innerHTML = "";

  if (query) {
    // Construct the expected image path
    const imagePath = `Movies/${query}/${query}.jpg`;

    // Create an image element to check if the file exists
    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      // If the image loads successfully, display it
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
      `;
    };

    img.onerror = function () {
      // If the image doesn't exist, show an error message
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and image file name.</p>
      `;
    };
  } else {
    alert("Please enter a movie name to search.");
  }
}
