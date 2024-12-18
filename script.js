function searchMovie() {
  const query = document.getElementById("search").value.trim();
  if (query) {
    alert(`Searching for: ${query}`);
  } else {
    alert("Please enter a movie name to search.");
  }
}
