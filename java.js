let recentlyPlayed = [];

function toggleContent(id) {
    let content = document.getElementById(id);

    document.querySelectorAll('.content').forEach(item => {
        if (item !== content) {
            item.style.display = 'none';
        }
    });

    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

async function searchSongs() {
    const query = document.getElementById("searchInput").value;
    if (!query) return;

    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const resultsContainer = document.getElementById("songResults");
        resultsContainer.innerHTML = ""; // Clear previous results

        if (data.results.length === 0) {
            resultsContainer.innerHTML = "<li>No songs found</li>";
        } else {
            data.results.forEach(song => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    ${song.trackName} - ${song.artistName}
                    <button class="play-button" onclick="playSong('${song.previewUrl}', '${song.trackName}', '${song.artistName}')">▶ Play</button>
                    <button class="add-button" onclick="addToFavorites('${song.trackName}', '${song.artistName}', '${song.previewUrl}')">Add</button>
                `;
                resultsContainer.appendChild(listItem);
            });
        }

        document.getElementById("Search results").style.display = "block";
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

function playSong(previewUrl, trackName, artistName) {
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');
    audioSource.src = previewUrl;
    audioPlayer.load(); // Reload the audio element to update source
    audioPlayer.play();

    // Add to Recently Played
    addToRecentlyPlayed(trackName, artistName, previewUrl);
}

function addToFavorites(songName, artistName, previewUrl) {
    let favoritesList = document.getElementById('allSongs');
    let newSong = document.createElement('li');
    newSong.textContent = `${songName} - ${artistName}`;

    const playButton = document.createElement('button');
    playButton.textContent = "▶ Play";
    playButton.onclick = function() {
        playSong(previewUrl, songName, artistName);
    };

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.onclick = function() {
        favoritesList.removeChild(newSong);
    };

    newSong.appendChild(playButton);
    newSong.appendChild(removeButton);
    favoritesList.appendChild(newSong);
}

function playPause() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.paused) {
        audioPlayer.play();
        document.querySelector('.audio-player button').textContent = "⏸ Pause";
    } else {
        audioPlayer.pause();
        document.querySelector('.audio-player button').textContent = "▶ Play";
    }
}

function stopAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.pause();
    audioPlayer.currentTime = 0; // Reset to the beginning
    document.querySelector('.audio-player button').textContent = "▶ Play";
}

function addToRecentlyPlayed(trackName, artistName, previewUrl) {
    if (recentlyPlayed.length >= 30) {
        recentlyPlayed.shift(); // Remove the first item if we already have 5 songs
    }
    recentlyPlayed.push({ trackName, artistName, previewUrl });

    // Update Recently Played list UI
    const recentlyPlayedList = document.getElementById("recentlyPlayedSongs");
    recentlyPlayedList.innerHTML = ''; // Clear previous list

    recentlyPlayed.forEach(song => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${song.trackName} - ${song.artistName}
            <button class="play-button" onclick="playSong('${song.previewUrl}', '${song.trackName}', '${song.artistName}')">▶ Play</button>`;
        recentlyPlayedList.appendChild(listItem);
    });
}
