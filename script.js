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

  const audio = new Audio(tracks[currentTrack].src);

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
  const volumeFill = document.querySelector(".volume-fill");
  const volumeHandle = document.querySelector(".volume-handle");

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

  const loadTrack = (index) => {
    const track = tracks[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    updateProgressVisual(0);
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    // Preload metadata for duration
    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
    }, { once: true });
  };

  // ===== PLAYBACK =====
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.classList.replace("fa-circle-pause", "fa-circle-play");
    } else {
      audio.play().catch(() => {
        audio.addEventListener("canplay", () => audio.play(), { once: true });
      });
      playPauseBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    }
    isPlaying = !isPlaying;
  };

  // ===== PROGRESS BAR =====
  const seekProgress = (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const percent = offsetX / rect.width;
    if (!isNaN(audio.duration)) {
      audio.currentTime = percent * audio.duration;
      updateProgressVisual(percent);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  };

  progressContainer.addEventListener("mousedown", (e) => {
    isDraggingProgress = true;
    progressHandle.style.transform = "translate(-50%, -50%) scale(1)";
    seekProgress(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingProgress) seekProgress(e);
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingProgress) {
      isDraggingProgress = false;
      progressHandle.style.transform = "translate(-50%, -50%) scale(0)";
    }
  });

  // Update progress & timestamp during playback
  audio.addEventListener("timeupdate", () => {
    if (!isDraggingProgress && !isNaN(audio.duration)) {
      const percent = audio.currentTime / audio.duration;
      updateProgressVisual(percent);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  // ===== VOLUME BAR =====
  const setVolumeFromEvent = (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    audio.volume = percent;
    volumeFill.style.width = `${percent * 100}%`;
    volumeHandle.style.left = `${percent * 100}%`;
    volumeHandle.style.transform = "translate(-50%, -50%) scale(1)";
  };

  volumeBar.addEventListener("mousedown", e => {
    isDraggingVolume = true;
    setVolumeFromEvent(e);
  });

  document.addEventListener("mousemove", e => {
    if (isDraggingVolume) setVolumeFromEvent(e);
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingVolume) {
      isDraggingVolume = false;
      volumeHandle.style.transform = "translate(-50%, -50%) scale(0)";
    }
  });

  volumeBar.addEventListener("click", setVolumeFromEvent);

  // ===== EVENTS =====
  playPauseBtn.addEventListener("click", togglePlay);
  audio.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
  });

  prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
  });

  nextBtn.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play();
  });

  // ===== INIT =====
  loadTrack(currentTrack);
  audio.volume = 0.5;
  volumeFill.style.width = "50%";
  volumeHandle.style.left = "50%";
});

document.querySelectorAll('.track-card').forEach(card => {
  const title = card.querySelector('h3');

  card.addEventListener('mouseenter', () => {
    const containerWidth = title.parentElement.offsetWidth;
    const textWidth = title.scrollWidth;

    if (textWidth > containerWidth) {
      // Remove clipping/ellipsis
      title.style.overflow = 'visible';
      title.style.textOverflow = 'clip';

      // Animate scroll
      const distance = textWidth - containerWidth;
      title.style.transition = `transform ${distance / 30}s linear`; // speed: 30px/sec
      title.style.transform = `translateX(-${distance}px)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    // Snap back
    title.style.transition = 'transform 0.3s ease';
    title.style.transform = 'translateX(0)';

    // Restore clipping/ellipsis after snap
    setTimeout(() => {
      title.style.overflow = 'hidden';
      title.style.textOverflow = 'ellipsis';
    }, 300);
  });
});
