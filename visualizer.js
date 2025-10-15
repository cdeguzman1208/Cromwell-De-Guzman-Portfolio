const visualizer = document.getElementById("visualizer");
const canvas = document.createElement("canvas");
canvas.id = "particleCanvas";
visualizer.appendChild(canvas);

const ctx = canvas.getContext("2d");
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = h + Math.random() * 100;
    this.size = Math.random() * 20 + 1;
    this.speedY = Math.random() * 1 + 0.3;
    this.alpha = Math.random() * 0.6 + 0.4;
    const hue = 120 + Math.random() * 120; // green-purple spectrum
    this.color = `hsla(${hue}, 70%, 60%, ${this.alpha})`;
  }
  update() {
    this.y -= this.speedY;
    this.alpha -= 0.002;
    this.color = this.color.replace(/[\d.]+\)$/g, `${this.alpha})`);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  if (particles.length < 100) {
    particles.push(new Particle());
  }

  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();

  const songs = [
    { title: "Good Night - Lofi Cozy Chill Music by FASSounds", src: "assets/track-1.mp3" },
    { title: "Lofi Study - Calm Peaceful Chill Hop by FASSounds", src: "assets/track-2.mp3" },
    { title: "Cutie Japan Lofi by FASSounds", src: "assets/track-3.mp3" }
  ];

  let currentTrack = 0;
  let isPlaying = false;

  const audio = document.getElementById("audio-player");
  const trackTitle = document.getElementById("track-title");
  const progressBar = document.querySelector(".progress");
  const playBtn = document.querySelector(".fa-circle-play");
  const prevBtn = document.querySelector(".fa-backward-step");
  const nextBtn = document.querySelector(".fa-forward-step");
  audio.volume = 0.25; // sets volume to 25%


  function loadTrack(index) {
    currentTrack = index;
    audio.src = songs[currentTrack].src;
    trackTitle.textContent = `Now Playing: ${songs[currentTrack].title}`;
    progressBar.style.width = "0%";
  }

  function playTrack() {
    audio.play();
    isPlaying = true;
    playBtn.classList.remove("fa-circle-play");
    playBtn.classList.add("fa-circle-pause");
  }

  function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playBtn.classList.remove("fa-circle-pause");
    playBtn.classList.add("fa-circle-play");
  }

  function nextTrack() {
    currentTrack = (currentTrack + 1) % songs.length;
    loadTrack(currentTrack);
    if (isPlaying) playTrack();
  }

  function prevTrack() {
    currentTrack = (currentTrack - 1 + songs.length) % songs.length;
    loadTrack(currentTrack);
    if (isPlaying) playTrack();
  }

  // Update progress bar
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = progress + "%";
    }
  });

  // Auto-next when song ends
  audio.addEventListener("ended", nextTrack);

  // Controls
  playBtn.addEventListener("click", () => (isPlaying ? pauseTrack() : playTrack()));
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  // Initialize first track
  loadTrack(0);