document.addEventListener("DOMContentLoaded", () => {
  // ===== TRACKS =====
  const tracks = [
    { title: "Good Night - Lofi Cozy Chill Music", artist: "FASSounds", src: "assets/track-1.mp3" },
    { title: "Lofi Study - Calm Peaceful Chill Hop", artist: "FASSounds", src: "assets/track-2.mp3" },
    { title: "Cutie Japan Lofi", artist: "FASSounds", src: "assets/track-3.mp3" }
  ];

  // ===== STATE =====
  let currentTrack = 0;
  let isPlaying = false;
  let isDraggingProgress = false;
  let isDraggingVolume = false;

  const audio = new Audio();

  // ===== ELEMENTS =====
  const playPauseBtn = document.getElementById("playPauseBtn");
  const trackTitle = document.getElementById("track-title");
  const trackArtist = document.getElementById("track-artist");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const progressContainer = document.querySelector(".progress-bar");
  const progressBar = document.querySelector(".progress");
  const progressHandle = document.querySelector(".progress-handle");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");

  const volumeBar = document.querySelector(".volume-bar");
  const logo = document.querySelector(".logo");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const volumeFill = document.querySelector(".volume-fill");
  const volumeHandle = document.querySelector(".volume-handle");
  const volumeIcon = document.querySelector('.volume i');

  // ===== UTILS =====
  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const updateProgressVisual = (percent) => {
    progressBar.style.width = `${percent * 100}%`;
    progressHandle.style.left = `${percent * 100}%`;
  };

  const updateVolumeVisual = (percent) => {
    volumeFill.style.width = `${percent * 100}%`;
    volumeHandle.style.left = `${percent * 100}%`;
    updateVolumeIcon(percent);
  };

  const updateVolumeIcon = (volume) => {
    if (audio.muted || volume === 0) {
      volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (volume < 0.5) {
      volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
      volumeIcon.className = 'fa-solid fa-volume-high';
    }
  };

  // ===== LOAD TRACK =====
  const loadTrack = (index) => {
    const track = tracks[index];

    audio.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    updateProgressVisual(0);
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
    }, { once: true });

    if (isPlaying) {
      audio.play();
    }
  };

  // ===== PLAYBACK =====
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.classList.replace("fa-circle-pause", "fa-circle-play");
    } else {
      audio.play();
      playPauseBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    }
    isPlaying = !isPlaying;
  };

  // ===== PROGRESS DRAG =====
  let progressRect;

  const seekProgress = (e) => {
    const percent = Math.min(Math.max(0, (e.clientX - progressRect.left) / progressRect.width), 1);

    if (!isNaN(audio.duration)) {
      audio.currentTime = percent * audio.duration;
      updateProgressVisual(percent);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  };

  progressContainer.addEventListener("mousedown", (e) => {
    isDraggingProgress = true;
    progressRect = progressContainer.getBoundingClientRect();

    document.body.style.userSelect = "none";
    progressHandle.classList.add("dragging");

    seekProgress(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingProgress) seekProgress(e);
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingProgress) {
      isDraggingProgress = false;
      document.body.style.userSelect = "";
      progressHandle.classList.remove("dragging");
    }
  });

  // ===== TIME UPDATE =====
  audio.addEventListener("timeupdate", () => {
    if (!isDraggingProgress && !isNaN(audio.duration)) {
      const percent = audio.currentTime / audio.duration;
      updateProgressVisual(percent);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  // ===== VOLUME DRAG =====
  let volumeRect;

  const setVolume = (e) => {
    const percent = Math.min(Math.max(0, (e.clientX - volumeRect.left) / volumeRect.width), 1);

    audio.volume = percent;
    updateVolumeVisual(percent);
  };

  volumeBar.addEventListener("mousedown", (e) => {
    isDraggingVolume = true;
    volumeRect = volumeBar.getBoundingClientRect();

    document.body.style.userSelect = "none";
    volumeHandle.classList.add("dragging");

    setVolume(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingVolume) setVolume(e);
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingVolume) {
      isDraggingVolume = false;
      document.body.style.userSelect = "";
      volumeHandle.classList.remove("dragging");
    }
  });

  // ===== VOLUME ICON CLICK (MUTE/UNMUTE) =====
  volumeIcon.addEventListener('click', () => {
    if (audio.muted) {
      audio.muted = false;
      updateVolumeVisual(audio.volume);
    } else {
      audio.muted = true;
      updateVolumeVisual(0);
    }
  });

  // ===== TRACK CONTROLS =====
  prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
  });

  nextBtn.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
  });

  audio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
  });

  playPauseBtn.addEventListener("click", togglePlay);

  logo.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("sidebar-collapsed");
  });

  // ===== INIT =====
  loadTrack(currentTrack);
  audio.volume = 0.5;
  updateVolumeVisual(0.5);
});


/* =========================
   CARD TITLE SCROLL
========================= */
document.querySelectorAll('.track-card').forEach(card => {
  const title = card.querySelector('h3');
  if (!title) return;

  let shouldAnimate = false;

  card.addEventListener('mouseenter', () => {
    if (shouldAnimate) return;

    const containerWidth = title.parentElement.offsetWidth;
    const textWidth = title.scrollWidth;

    if (textWidth > containerWidth) {
      shouldAnimate = true;
      title.style.overflow = 'visible';

      const distance = textWidth - containerWidth;
      const speed = 50; // pixels per second
      const scrollDuration = distance / speed;
      const pauseDuration = 0.5; // seconds

      const animate = () => {
        if (!shouldAnimate) return;

        // Scroll to end
        title.style.transition = `transform ${scrollDuration}s linear`;
        title.style.transform = `translateX(-${distance}px)`;

        setTimeout(() => {
          if (!shouldAnimate) return;
          // Pause at end
          title.style.transition = 'none';
        }, scrollDuration * 1000);

        setTimeout(() => {
          if (!shouldAnimate) return;
          // Scroll back to start
          title.style.transition = `transform ${scrollDuration}s linear`;
          title.style.transform = `translateX(0)`;
        }, (scrollDuration + pauseDuration) * 1000);

        setTimeout(() => {
          if (!shouldAnimate) return;
          // Pause at start
          title.style.transition = 'none';
        }, (scrollDuration * 2 + pauseDuration) * 1000);

        // Loop
        setTimeout(() => {
          if (shouldAnimate) animate();
        }, (scrollDuration * 2 + pauseDuration * 2) * 1000);
      };

      animate();
    }
  });

  card.addEventListener('mouseleave', () => {
    shouldAnimate = false;
    title.style.transition = 'transform 0.3s ease';
    title.style.transform = 'translateX(0)';

    setTimeout(() => {
      title.style.overflow = 'hidden';
      title.style.textOverflow = 'ellipsis';
    }, 300);
  });
});


/* =========================
   COPY TO CLIPBOARD
========================= */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}