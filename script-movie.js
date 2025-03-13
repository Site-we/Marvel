document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieName = urlParams.get('movie');

    if (movieName) {
        const formattedQuery = movieName.replace(/\s+/g, "").toLowerCase();
        const resultContainer = document.getElementById("search-result");
        const movieTitleHeader = document.getElementById("movie-title-header");
        const moviePoster = document.getElementById("movie-poster");
        const downloadButton = document.getElementById("download-btn");
        const mxPlayerButton = document.getElementById("mx-player-btn");

        const imagePath = `Movies/${formattedQuery}/${formattedQuery}.jpg`;

        const img = new Image();
        img.src = imagePath;

        img.onload = function () {
            const formattedMovieName = movieName.replace(/\s+/g, "");
            movieTitleHeader.textContent = formattedMovieName;
            moviePoster.src = imagePath;
            moviePoster.style.display = "block";
            downloadButton.style.display = "inline-block";
            mxPlayerButton.style.display = "inline-block";

            resultContainer.classList.add("fade-in");

            downloadButton.onclick = () => redirectToDownload(formattedQuery);
            mxPlayerButton.onclick = () => redirectToMXPlayer(formattedQuery);
        };

        img.onerror = function () {
            const formattedMovieName = movieName.replace(/\s+/g, "");
            movieTitleHeader.textContent = `No results found for "${formattedMovieName}"`;
        };
    } else {
        document.getElementById('movie-title').textContent = 'Movie not found';
    }
});

function redirectToDownload(folderName) {
    localStorage.setItem("movieFolderName", folderName);
    window.location.href = "download.html";
}

function redirectToMXPlayer(folderName) {
    localStorage.setItem("movieFolderName", folderName);
    window.location.href = "mxplayer.html";
}
