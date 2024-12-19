window.onload = function () {
  const moviePlayer = document.getElementById("movie-player");
  const languageSelect = document.getElementById("language");

  // Retrieve the saved video link from localStorage
  const movieUrl = localStorage.getItem("a");
  if (!movieUrl) {
    alert("No movie data found!");
    window.location.href = "index.html";
    return;
  }

  // Set the video source to the URL stored in localStorage
  const movieSource = document.getElementById("movie-source");
  movieSource.src = movieUrl;
  moviePlayer.load();

  // Populate the language selection dropdown after the video is loaded
  moviePlayer.addEventListener("loadedmetadata", () => {
    const audioTracks = moviePlayer.audioTracks;

    if (audioTracks && audioTracks.length > 0) {
      for (let i = 0; i < audioTracks.length; i++) {
        const track = audioTracks[i];
        const option = document.createElement("option");
        option.value = i;
        option.textContent = track.language || `Track ${i + 1}`;
        languageSelect.appendChild(option);

        // Set the default audio track to Hindi if available
        if (track.language === "hi" || track.label.toLowerCase().includes("hindi")) {
          track.enabled = true;
          languageSelect.value = i; // Set the dropdown to match the selected track
        } else {
          track.enabled = false; // Disable other tracks by default
        }
      }
    } else {
      alert("No audio tracks found in this video.");
    }
  });
};

// Function to change the audio track
function changeAudioTrack() {
  const moviePlayer = document.getElementById("movie-player");
  const audioTracks = moviePlayer.audioTracks;
  const selectedTrackIndex = document.getElementById("language").value;

  if (audioTracks && audioTracks.length > 0) {
    for (let i = 0; i < audioTracks.length; i++) {
      audioTracks[i].enabled = i === parseInt(selectedTrackIndex);
    }
  } else {
    alert("Audio tracks are not available.");
  }
}
