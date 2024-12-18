function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim(); // Keep original search text
  const formattedQuery = query.replace(/\s+/g, "").toLowerCase(); // Format query for file paths

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  resultContainer.innerHTML = "";

  if (formattedQuery) {
    const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
    const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      // Dynamically create an <a> tag for the download button
      const downloadBtn = document.createElement("a");
      downloadBtn.textContent = "Download";
      downloadBtn.href = "#"; // Default placeholder
      downloadBtn.target = "_blank";
      downloadBtn.id = "download-btn";
      downloadBtn.style.cursor = "pointer";

      // Fetch and set the href when the button is clicked
      downloadBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default behavior
        fetchAndDownloadLink(txtPath, downloadBtn);
      });

      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
      `;
      resultContainer.appendChild(downloadBtn); // Append the button dynamically
      gallery.style.display = "none";
    };

    img.onerror = function () {
      resultContainer.innerHTML = `
        <h2>No results found for "${query}"</h2>
        <p>Make sure the movie name matches the folder and file structure.</p>
      `;
      gallery.style.display = "grid";
    };
  } else {
    resultContainer.innerHTML = `
      <h2>No input provided</h2>
      <p>Please enter a movie name to search.</p>
    `;
    gallery.style.display = "grid";
  }
}

// Fetch the URL from the TXT file, set it to the href of the anchor tag, and trigger download
function fetchAndDownloadLink(txtPath, anchor) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not fetch the download link.");
      }
      return response.text();
    })
    .then((downloadUrl) => {
      const trimmedUrl = downloadUrl.trim(); // Trim unnecessary spaces/newlines
      anchor.href = trimmedUrl; // Update the href with the link from the text file
      anchor.download = ""; // Add the download attribute
      anchor.click(); // Trigger the download programmatically
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Close the keyboard on Enter
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie(); // Call the search function
    this.blur(); // Close the keyboard
  }
});
