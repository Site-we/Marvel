function searchMovie() {
  const searchInput = document.getElementById("search");
  const query = searchInput.value.trim();
  const formattedQuery = query.replace(/\s+/g, "").toLowerCase();

  const resultContainer = document.getElementById("search-result");
  const gallery = document.getElementById("gallery");

  resultContainer.innerHTML = "";

  if (formattedQuery) {
    const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;
    const txtPath = `Movies/${formattedQuery}/${formattedQuery}.txt`;

    const img = new Image();
    img.src = imagePath;

    img.onload = function () {
      resultContainer.innerHTML = `
        <h2>Result for "${query}"</h2>
        <img src="${imagePath}" alt="${query}">
        <br>
        <button id="download-btn" onclick="fetchAndDownload('${txtPath}', '${query}')">Download</button>
      `;
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

  searchInput.value = '';
}

function fetchAndDownload(txtPath, movieName) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) throw new Error("Could not fetch the download link.");
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

//Search when clicking on an image in the gallery
function searchMovieByImage(movieName) {
  const searchInput = document.getElementById("search");
  searchInput.value = movieName; // Set the movie name into the search input

  searchMovie(); // Trigger the search function
}

document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie();
    this.blur();
  }
});
function saveMXLinkAndPlay(txtPath) {
  fetch(txtPath)
    .then((response) => {
      if (!response.ok) throw new Error("Could not fetch the watch link.");
      return response.text();
    })
    .then((watchUrl) => {
      const trimmedUrl = watchUrl.trim();
      // Construct MX Player's deep link
      const mxPlayerLink = `intent:${trimmedUrl}#Intent;package=com.mxtech.videoplayer.ad;scheme=http;end;`;

      // Redirect to MX Player
      window.location.href = mxPlayerLink;
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
