const inputEL = document.getElementById("input");
const infoText = document.getElementById("info-text");
const meaningCo = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const meaningEL = document.getElementById("meaning");
const meaningEL2 = document.getElementById("meaning2");
const audioEl = document.getElementById("audio");
const songFrame = document.getElementById("songFrame");


async function fetchAPI(word) {
  try {
    infoText.style.display = "block";
    meaningCo.style.display = "none";
    infoText.innerText = `Searching the meaning for "${word}"...`;

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.title) {
      infoText.style.display = "none";
      meaningCo.style.display = "block";
      titleEl.innerText = word;
      meaningEL.innerText = "Not Found";
      meaningEL2.innerText = "Not Found";
      audioEl.style.display = "none";
      songFrame.src = "";
      return;
    }

 
    infoText.style.display = "none";
    meaningCo.style.display = "block";

    titleEl.innerText = result[0].word;
    meaningEL.innerText = result[0].meanings[0]?.definitions[0]?.definition || "N/A";
    meaningEL2.innerText = result[0].meanings[1]?.definitions[0]?.definition || "N/A";

   
    const phonetic = result[0].phonetics.find(p => p.audio);
    if (phonetic && phonetic.audio) {
      audioEl.style.display = "block";
      audioEl.src = phonetic.audio;
    } else {
      audioEl.style.display = "none";
    }

    await fetchSongFromYouTube(word);

  } catch (error) {
    console.log(error);
    infoText.innerText = "An error happened, try again later.";
  }
}

async function fetchSongFromYouTube(word) {
  const apiKey = "AIzaSyDnT2pWMFkgV92YrNyen3uPI1i3Ms9oS9c"; // <-- apna YouTube API key daalna hai
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${word}+song&type=video&maxResults=1&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      songFrame.src = videoUrl;
    } else {
      songFrame.src = "";
    }
  } catch (error) {
    console.error("YouTube fetch error:", error);
    songFrame.src = "";
  }
}


inputEL.addEventListener("keyup", (e) => {
  if (e.target.value && e.key === "Enter") {
    fetchAPI(e.target.value);
  }
});
