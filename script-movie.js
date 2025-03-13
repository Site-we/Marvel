document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieName = urlParams.get('name');

    if (movieName) {
        document.getElementById('movie-title').textContent = movieName;
        document.getElementById('download-button').addEventListener('click', () => {
            window.location.href = `download/${movieName}.mp4`;
        });
        document.getElementById('play-button').addEventListener('click', () => {
            window.location.href = `intent:${window.location.origin}/play/${movieName}.mp4#Intent;package=com.mxtech.videoplayer.ad;end`;
        });
    } else {
        document.getElementById('movie-title').textContent = 'Movie not found';
    }
});
