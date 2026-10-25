/**
 * PROJECT: KOWSARR ALI — A SPECIAL BIRTHDAY EXPERIENCE
 * Premium Visual Interactions, Particle Canvases, Cursor Sparkles & Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {

  // Global State Guard to prevent duplicate clicks and race conditions
  let isTransitioning = false;

  // =========================================================================
  // 1. Audio System: Romantic Hindi Song "Hawayein" (Arijit Singh)
  // =========================================================================
  let audioContext = null;
  let isMelodyPlaying = false;
  let melodyTimeoutId = null;
  const bgMusicTrack = document.getElementById('bgMusicTrack');

  function ensureAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Plays a bell-like music box note with harmonic richness
  function playMusicBoxNote(freq, duration = 1.2, volume = 0.055) {
    if (!audioContext) return;
    try {
      const t = audioContext.currentTime;

      // Fundamental tone
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, t);

      gain1.gain.setValueAtTime(volume, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.start(t);
      osc1.stop(t + duration);

      // Warm overtone for celestial music box timbre
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, t);

      gain2.gain.setValueAtTime(volume * 0.35, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + (duration * 0.7));

      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.start(t);
      osc2.stop(t + duration);
    } catch (e) {
      // Audio playback fails silently if blocked
    }
  }

  // Authentic Hindi Romantic Melody: "Hawayein" (Le jaayein jaane kahaan... Hawayein hawayein)
  const hawayeinScore = [
    // "Tujhko main rakh loon wahaan"
    { freq: 440.00, dur: 0.35, pause: 380 }, // A4
    { freq: 392.00, dur: 0.35, pause: 380 }, // G4
    { freq: 369.99, dur: 0.45, pause: 450 }, // F#4
    { freq: 369.99, dur: 0.35, pause: 380 }, // F#4
    { freq: 392.00, dur: 0.35, pause: 380 }, // G4
    { freq: 369.99, dur: 0.35, pause: 380 }, // F#4
    { freq: 329.63, dur: 0.35, pause: 380 }, // E4
    { freq: 293.66, dur: 0.45, pause: 450 }, // D4
    { freq: 293.66, dur: 0.75, pause: 800 }, // D4

    // "Jahaan pe kahin hai mera yaqeen"
    { freq: 493.88, dur: 0.35, pause: 380 }, // B4
    { freq: 493.88, dur: 0.35, pause: 380 }, // B4
    { freq: 587.33, dur: 0.45, pause: 450 }, // D5
    { freq: 659.25, dur: 0.45, pause: 450 }, // E5
    { freq: 739.99, dur: 0.50, pause: 550 }, // F#5
    { freq: 659.25, dur: 0.90, pause: 1100 }, // E5

    // "Main jo tera na huaa"
    { freq: 440.00, dur: 0.35, pause: 380 }, // A4
    { freq: 392.00, dur: 0.35, pause: 380 }, // G4
    { freq: 369.99, dur: 0.45, pause: 450 }, // F#4
    { freq: 369.99, dur: 0.35, pause: 380 }, // F#4
    { freq: 392.00, dur: 0.35, pause: 380 }, // G4
    { freq: 369.99, dur: 0.35, pause: 380 }, // F#4
    { freq: 329.63, dur: 0.35, pause: 380 }, // E4
    { freq: 293.66, dur: 0.45, pause: 450 }, // D4
    { freq: 293.66, dur: 0.75, pause: 800 }, // D4

    // "Kisi ka nahin, kisi ka nahin"
    { freq: 554.37, dur: 0.35, pause: 380 }, // C#5
    { freq: 554.37, dur: 0.35, pause: 380 }, // C#5
    { freq: 587.33, dur: 0.45, pause: 450 }, // D5
    { freq: 554.37, dur: 0.35, pause: 380 }, // C#5
    { freq: 493.88, dur: 0.35, pause: 380 }, // B4
    { freq: 440.00, dur: 0.90, pause: 1200 }, // A4

    // === CHORUS / HOOK: "Le jaayein jaane kahaan... Hawayein hawayein" ===
    { freq: 587.33, dur: 0.45, pause: 480 }, // D5
    { freq: 587.33, dur: 0.45, pause: 480 }, // D5
    { freq: 554.37, dur: 0.50, pause: 550 }, // C#5
    { freq: 440.00, dur: 0.35, pause: 380 }, // A4
    { freq: 493.88, dur: 0.70, pause: 750 }, // B4
    { freq: 493.88, dur: 0.90, pause: 1000 }, // B4

    // "Hawayein, hawayein..."
    { freq: 440.00, dur: 0.30, pause: 350 }, // A4
    { freq: 493.88, dur: 0.45, pause: 480 }, // B4
    { freq: 493.88, dur: 0.70, pause: 800 }, // B4
    { freq: 440.00, dur: 0.30, pause: 350 }, // A4
    { freq: 493.88, dur: 0.45, pause: 480 }, // B4
    { freq: 493.88, dur: 1.10, pause: 1200 }, // B4

    // "Le jaayein tujhe kahaan..."
    { freq: 587.33, dur: 0.45, pause: 480 }, // D5
    { freq: 587.33, dur: 0.45, pause: 480 }, // D5
    { freq: 554.37, dur: 0.50, pause: 550 }, // C#5
    { freq: 369.99, dur: 0.35, pause: 380 }, // F#4
    { freq: 493.88, dur: 0.45, pause: 480 }, // B4
    { freq: 440.00, dur: 0.90, pause: 1000 }, // A4

    // "Hawayein, hawayein..."
    { freq: 392.00, dur: 0.30, pause: 350 }, // G4
    { freq: 440.00, dur: 0.45, pause: 480 }, // A4
    { freq: 440.00, dur: 0.70, pause: 800 }, // A4
    { freq: 392.00, dur: 0.30, pause: 350 }, // G4
    { freq: 440.00, dur: 0.45, pause: 480 }, // A4
    { freq: 440.00, dur: 1.40, pause: 1900 }, // A4
  ];

  let currentHawayeinStep = 0;

  function scheduleNextHawayeinNote() {
    if (!isMelodyPlaying) return;
    const note = hawayeinScore[currentHawayeinStep];
    playMusicBoxNote(note.freq, note.dur, 0.05);

    currentHawayeinStep = (currentHawayeinStep + 1) % hawayeinScore.length;
    melodyTimeoutId = setTimeout(scheduleNextHawayeinNote, note.pause);
  }

  function startHawayeinSong() {
    stopHawayeinSong();
    isMelodyPlaying = true;
    currentHawayeinStep = 0;

    // Try playing full audio MP3 first if supported and available
    if (bgMusicTrack) {
      bgMusicTrack.volume = 0.45;
      const playPromise = bgMusicTrack.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks audio file or network is offline, synthesize live melody!
          scheduleNextHawayeinNote();
        });
      }
    } else {
      scheduleNextHawayeinNote();
    }
  }

  function stopHawayeinSong() {
    isMelodyPlaying = false;
    if (melodyTimeoutId) {
      clearTimeout(melodyTimeoutId);
      melodyTimeoutId = null;
    }
    if (bgMusicTrack) {
      bgMusicTrack.pause();
    }
  }

  function playCelebrationHarp() {
    ensureAudioContext();
    if (!audioContext) return;
    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    arpeggio.forEach((f, i) => {
      setTimeout(() => {
        playMusicBoxNote(f, 1.4, 0.06);
      }, i * 110);
    });
  }

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      ensureAudioContext();
      if (!isMelodyPlaying) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.querySelector('.sound-label').textContent = 'Hawayein: On';
        startHawayeinSong();
      } else {
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.querySelector('.sound-label').textContent = 'Hawayein: Off';
        stopHawayeinSong();
      }
    });
  }


  // =========================================================================
  // 2. Ambient Canvas: Soft Floating Sparkles & Rose Petals
  // =========================================================================
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ambCtx = ambientCanvas.getContext('2d');
  let ambientParticles = [];

  function setCanvasDimensions() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', setCanvasDimensions);
  setCanvasDimensions();

  class FloatingAmbientParticle {
    constructor() {
      this.init(true);
    }
    init(initial = false) {
      this.x = Math.random() * ambientCanvas.width;
      this.y = initial ? Math.random() * ambientCanvas.height : ambientCanvas.height + 25;
      this.size = Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.55 + 0.2;
      this.isPetal = Math.random() > 0.65;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.colorBase = this.isPetal 
        ? (Math.random() > 0.5 ? 'rgba(254, 205, 214, ' : 'rgba(248, 187, 208, ')
        : (Math.random() > 0.5 ? 'rgba(230, 184, 125, ' : 'rgba(255, 255, 255, ');
    }
    step() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4;
      this.rotation += this.rotSpeed;
      if (this.y < -35) {
        this.init();
      }
    }
    render() {
      ambCtx.save();
      ambCtx.translate(this.x, this.y);
      ambCtx.rotate((this.rotation * Math.PI) / 180);
      ambCtx.fillStyle = this.colorBase + this.opacity + ')';

      if (this.isPetal) {
        ambCtx.beginPath();
        ambCtx.moveTo(0, 0);
        ambCtx.quadraticCurveTo(-this.size, this.size, 0, this.size * 2);
        ambCtx.quadraticCurveTo(this.size, this.size, 0, 0);
        ambCtx.fill();
      } else {
        ambCtx.beginPath();
        ambCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ambCtx.fill();
      }
      ambCtx.restore();
    }
  }

  for (let i = 0; i < 45; i++) {
    ambientParticles.push(new FloatingAmbientParticle());
  }

  function ambientLoop() {
    ambCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    for (const p of ambientParticles) {
      p.step();
      p.render();
    }
    requestAnimationFrame(ambientLoop);
  }
  ambientLoop();


  // =========================================================================
  // 3. Interactive Cursor / Touch Sparkle Trail
  // =========================================================================
  const cursorCanvas = document.getElementById('cursorCanvas');
  const curCtx = cursorCanvas.getContext('2d');
  let cursorSparks = [];

  function setCursorDimensions() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', setCursorDimensions);
  setCursorDimensions();

  class CursorSparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 1.6;
      this.speedY = (Math.random() - 0.5) * 1.6 - 0.4;
      this.opacity = 1;
      this.color = Math.random() > 0.5 ? '#d4af37' : '#f48fb1';
    }
    step() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= 0.025;
    }
    render() {
      curCtx.save();
      curCtx.globalAlpha = Math.max(0, this.opacity);
      curCtx.fillStyle = this.color;
      curCtx.beginPath();
      curCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      curCtx.fill();
      curCtx.restore();
    }
  }

  function addCursorSparks(x, y) {
    if (cursorSparks.length < 50) {
      cursorSparks.push(new CursorSparkle(x, y));
    }
  }

  window.addEventListener('mousemove', (e) => {
    addCursorSparks(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      addCursorSparks(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function cursorLoop() {
    curCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    for (let i = cursorSparks.length - 1; i >= 0; i--) {
      const spark = cursorSparks[i];
      spark.step();
      spark.render();
      if (spark.opacity <= 0) {
        cursorSparks.splice(i, 1);
      }
    }
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();


  // =========================================================================
  // 4. Romantic Confetti Engine
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];

  function setConfettiDimensions() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', setConfettiDimensions);
  setConfettiDimensions();

  const confettiPalette = ['#f48fb1', '#f06292', '#e6b87d', '#d4af37', '#ffffff', '#ffd1dc', '#ec407a'];

  class ConfettiItem {
    constructor(x, y) {
      this.x = x ?? Math.random() * confettiCanvas.width;
      this.y = y ?? (Math.random() * -confettiCanvas.height * 0.4);
      this.width = Math.random() * 8 + 6;
      this.height = Math.random() * 6 + 4;
      this.color = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
      this.vx = (Math.random() - 0.5) * 6;
      this.vy = Math.random() * 4 + 3.2;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.wobble = Math.random() * 10;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.wobble += 0.05;
      this.vx += Math.sin(this.wobble) * 0.12;
      this.vy += 0.04;
    }
    render() {
      confCtx.save();
      confCtx.translate(this.x, this.y);
      confCtx.rotate((this.rotation * Math.PI) / 180);
      confCtx.fillStyle = this.color;
      confCtx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      confCtx.restore();
    }
  }

  let confettiLoopId = null;

  function runConfetti() {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const piece = confettiPieces[i];
      piece.step();
      piece.render();
      if (piece.y > confettiCanvas.height + 40) {
        confettiPieces.splice(i, 1);
      }
    }
    if (confettiPieces.length > 0) {
      confettiLoopId = requestAnimationFrame(runConfetti);
    } else {
      confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      cancelAnimationFrame(confettiLoopId);
      confettiLoopId = null;
    }
  }

  function spawnConfetti(count = 80) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * confettiCanvas.width;
      const y = Math.random() * (confettiCanvas.height * 0.35);
      confettiPieces.push(new ConfettiItem(x, y));
    }
    if (!confettiLoopId) {
      runConfetti();
    }
  }


  // =========================================================================
  // 5. Smooth Screen Transitions with Race-Condition Lock
  // =========================================================================
  function transitionScreen(fromId, toId, onComplete = null) {
    if (isTransitioning) return;
    isTransitioning = true;

    const currentScreen = document.getElementById(fromId);
    const nextScreen = document.getElementById(toId);

    if (!currentScreen || !nextScreen) {
      isTransitioning = false;
      return;
    }

    currentScreen.classList.add('fading-out');

    setTimeout(() => {
      currentScreen.classList.remove('active', 'fading-out');
      nextScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      isTransitioning = false;

      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 450);
  }


  // =========================================================================
  // 6. SCREEN 01: Welcome Screen Logic
  // =========================================================================
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const playfulHint = document.getElementById('playfulHint');
  const balloonOverlay = document.getElementById('balloonCelebrationOverlay');

  const playfulMessages = [
    "Wait, really? 🥺",
    "Nice try! Catch me if you can 😉",
    "No isn't an option for Kowsarr! 💖",
    "You have to say YES! 🥰",
    "Are you sure? Try again! 🙈"
  ];
  let playfulIndex = 0;

  function dodgePlayfully() {
    const offsetX = (Math.random() - 0.5) * 150;
    const offsetY = (Math.random() - 0.5) * 75;
    btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    playfulHint.textContent = playfulMessages[playfulIndex];
    playfulIndex = (playfulIndex + 1) % playfulMessages.length;
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgePlayfully);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgePlayfully();
    }, { passive: false });
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      dodgePlayfully();
    });
  }

  function launchFloatingBalloons() {
    balloonOverlay.innerHTML = '';
    balloonOverlay.classList.add('active');

    const colorPalettes = [
      'radial-gradient(circle at 35% 35%, #fff0f5, #f48fb1 70%, #d81b60 100%)',
      'radial-gradient(circle at 35% 35%, #fff9e6, #e6b87d 70%, #c59b27 100%)',
      'radial-gradient(circle at 35% 35%, #ffebee, #ef9a9a 70%, #c62828 100%)',
      'radial-gradient(circle at 35% 35%, #ffffff, #f8bbd0 70%, #ad1457 100%)'
    ];

    const totalBalloons = 32;
    for (let i = 0; i < totalBalloons; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'floating-celebration-balloon';

      const left = Math.random() * 90 + 5;
      const duration = Math.random() * 2.2 + 2.8;
      const delay = Math.random() * 1.4;
      const drift = (Math.random() - 0.5) * 70;
      const rotation = (Math.random() - 0.5) * 22;

      balloon.style.left = `${left}%`;
      balloon.style.setProperty('--drift', `${drift}px`);
      balloon.style.setProperty('--rot', `${rotation}deg`);
      balloon.style.animation = `riseUpLuxury ${duration}s ease-in ${delay}s forwards`;

      const sphere = document.createElement('div');
      sphere.className = 'balloon-giant-body';
      sphere.style.background = colorPalettes[i % colorPalettes.length];

      const string = document.createElement('div');
      string.className = 'balloon-giant-string';

      balloon.appendChild(sphere);
      balloon.appendChild(string);
      balloonOverlay.appendChild(balloon);
    }

    setTimeout(() => {
      balloonOverlay.classList.remove('active');
      balloonOverlay.innerHTML = '';
    }, 4500);
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      ensureAudioContext();
      playCelebrationHarp();
      spawnConfetti(90);
      launchFloatingBalloons();

      // Automatically start playing Hawayein Hindi romantic song on YES
      if (!isMelodyPlaying) {
        if (musicToggleBtn) {
          musicToggleBtn.classList.add('playing');
          musicToggleBtn.querySelector('.sound-label').textContent = 'Hawayein: On';
        }
        startHawayeinSong();
      }

      setTimeout(() => {
        transitionScreen('screen1', 'screen2', initializeScreen2);
      }, 2400);
    });
  }


  // Plays a snappy, cheerful balloon pop sound
  function playBalloonPopSound() {
    if (!audioContext) return;
    try {
      const t = audioContext.currentTime;
      // Quick pitch-drop pop burst
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(550, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(t);
      osc.stop(t + 0.08);

      // Followed by a cheerful bell chime
      setTimeout(() => {
        playMusicBoxNote(587.33, 0.8, 0.045);
      }, 50);
    } catch (e) {
      // Audio fails silently if blocked
    }
  }

  // =========================================================================
  // 7. SCREEN 02: Tap to Pop Balloons Logic ("Ha Baqo & Isku Keen")
  // =========================================================================
  const balloonPods = [
    document.getElementById('balloonPod0'),
    document.getElementById('balloonPod1'),
    document.getElementById('balloonPod2'),
    document.getElementById('balloonPod3')
  ];
  const balloonPopGrid = document.getElementById('balloonPopGrid');
  const popCounterPill = document.getElementById('popCounterPill');
  const unifiedMessageBlock = document.getElementById('unifiedMessageBlock');
  const btnContinueScreen2 = document.getElementById('btnContinueScreen2');

  let poppedCount = 0;

  function handleBalloonPop(pod, index) {
    if (!pod || pod.classList.contains('popped')) return;

    pod.classList.add('popped');
    poppedCount++;

    // Audio pop + sparkle chime
    ensureAudioContext();
    playBalloonPopSound();

    // Spawn confetti sparkles around the balloon
    spawnConfetti(35);

    // Update counter pill
    if (popCounterPill) {
      popCounterPill.textContent = `Balloons Popped: ${poppedCount} / 4`;
    }

    // Check if all 4 balloons have been popped
    if (poppedCount === 4) {
      setTimeout(() => {
        // Converge cards together into the center ("Isku keen")
        if (balloonPopGrid) {
          balloonPopGrid.classList.add('all-popped');
        }

        // Reveal the united message banner
        if (unifiedMessageBlock) {
          unifiedMessageBlock.classList.add('revealed');
        }

        spawnConfetti(80);
        playCelebrationHarp();
      }, 500);
    }
  }

  // Attach click & keyboard listeners to each balloon pod
  balloonPods.forEach((pod, index) => {
    if (pod) {
      pod.addEventListener('click', (e) => {
        e.preventDefault();
        handleBalloonPop(pod, index);
      });
      pod.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBalloonPop(pod, index);
        }
      });
    }
  });

  function initializeScreen2() {
    poppedCount = 0;
    if (popCounterPill) {
      popCounterPill.textContent = 'Balloons Popped: 0 / 4';
    }
    if (balloonPopGrid) {
      balloonPopGrid.classList.remove('all-popped');
    }
    if (unifiedMessageBlock) {
      unifiedMessageBlock.classList.remove('revealed');
    }
    balloonPods.forEach(p => p && p.classList.remove('popped'));
  }

  if (btnContinueScreen2) {
    btnContinueScreen2.addEventListener('click', () => {
      transitionScreen('screen2', 'screen3', initializeScreen3);
    });
  }


  // =========================================================================
  // 8. SCREEN 03: Cake and Flower Surprise Logic
  // =========================================================================
  const timedWishPrompt = document.getElementById('timedWishPrompt');
  const bloomingBouquetStage = document.getElementById('bloomingBouquetStage');
  const dedicatedCakeBox = document.getElementById('dedicatedCakeBox');
  const cakeFlame = document.getElementById('cakeFlame');
  const btnContinueScreen3 = document.getElementById('btnContinueScreen3');

  function initializeScreen3() {
    // Reset prior state
    if (timedWishPrompt) timedWishPrompt.classList.remove('revealed');
    if (bloomingBouquetStage) bloomingBouquetStage.classList.remove('bloomed');
    if (dedicatedCakeBox) dedicatedCakeBox.classList.remove('soften-down');
    if (btnContinueScreen3) btnContinueScreen3.classList.remove('ready');

    // 1. After 2 seconds, show: "Close your eyes and make a wish… ✨"
    setTimeout(() => {
      if (timedWishPrompt) {
        timedWishPrompt.classList.add('revealed');
        playMusicBoxNote(523.25, 1.4, 0.05);
      }
    }, 2000);

    // 2. Wait another 3 seconds (5s total), bloom the bouquet
    setTimeout(() => {
      if (dedicatedCakeBox) dedicatedCakeBox.classList.add('soften-down');
      if (cakeFlame) {
        cakeFlame.style.opacity = '0.35';
        cakeFlame.style.transform = 'scale(0.5)';
      }
      if (bloomingBouquetStage) {
        bloomingBouquetStage.classList.add('bloomed');
      }
      spawnConfetti(70);
      playCelebrationHarp();

      // Reveal continue button
      setTimeout(() => {
        if (btnContinueScreen3) {
          btnContinueScreen3.classList.add('ready');
        }
      }, 1000);
    }, 5000);
  }

  if (btnContinueScreen3) {
    btnContinueScreen3.addEventListener('click', () => {
      transitionScreen('screen3', 'screen4', initializeScreen4);
    });
  }


  // =========================================================================
  // 9. SCREEN 04: Birthday Celebration Gallery — Interactive Stack Deck ("Is Korsar")
  // =========================================================================
  const stackCards = [
    document.getElementById('galleryCard0'),
    document.getElementById('galleryCard1'),
    document.getElementById('galleryCard2')
  ];
  const stackCounter = document.getElementById('stackCounter');
  const stackDots = document.querySelectorAll('.stack-dot');
  const btnContinueScreen4 = document.getElementById('btnContinueScreen4');

  let currentTopIndex = 0;
  let isCardSwiping = false;
  let hasViewedAllCards = false;

  function updateStackPositions() {
    stackCards.forEach((card, idx) => {
      if (!card) return;
      card.classList.remove('pos-0', 'pos-1', 'pos-2', 'swiping-out-right', 'swiping-out-left');

      const relativePos = (idx - currentTopIndex + 3) % 3;
      if (relativePos === 0) {
        card.classList.add('pos-0');
      } else if (relativePos === 1) {
        card.classList.add('pos-1');
      } else {
        card.classList.add('pos-2');
      }
    });

    if (stackCounter) {
      stackCounter.textContent = `Memory ${currentTopIndex + 1} of 3`;
    }

    if (stackDots) {
      stackDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentTopIndex);
      });
    }
  }

  function advanceStackCard() {
    if (isCardSwiping) return;
    isCardSwiping = true;

    const activeCard = stackCards[currentTopIndex];
    if (activeCard) {
      // Alternate swipe direction for natural physical feel
      const swipeDirClass = (currentTopIndex % 2 === 0) ? 'swiping-out-right' : 'swiping-out-left';
      activeCard.classList.add(swipeDirClass);

      playMusicBoxNote(480 + currentTopIndex * 70, 0.9, 0.05);

      setTimeout(() => {
        currentTopIndex = (currentTopIndex + 1) % 3;
        updateStackPositions();
        isCardSwiping = false;

        if (currentTopIndex === 2) {
          hasViewedAllCards = true;
          spawnConfetti(40);
        }
      }, 340);
    } else {
      isCardSwiping = false;
    }
  }

  // Attach click & keyboard listeners to each card
  stackCards.forEach((card, idx) => {
    if (card) {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        // Only active top card can be tapped to advance
        if (card.classList.contains('pos-0')) {
          advanceStackCard();
        }
      });
      card.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && card.classList.contains('pos-0')) {
          e.preventDefault();
          advanceStackCard();
        }
      });
    }
  });

  // Allow clicking on pagination dots
  stackDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx) && targetIdx !== currentTopIndex && !isCardSwiping) {
        currentTopIndex = targetIdx;
        updateStackPositions();
        playMusicBoxNote(520, 0.8, 0.04);
      }
    });
  });

  function initializeScreen4() {
    currentTopIndex = 0;
    updateStackPositions();
    playMusicBoxNote(440, 1.0, 0.05);
  }

  if (btnContinueScreen4) {
    btnContinueScreen4.addEventListener('click', () => {
      transitionScreen('screen4', 'screen5');
    });
  }


  // =========================================================================
  // 10. SCREEN 05: The Secret Birthday Letter — Couture Envelope Logic
  // =========================================================================
  const luxuryEnvelope = document.getElementById('luxuryEnvelope');
  const heartSeal = document.getElementById('heartSeal');
  const btnContinueScreen5 = document.getElementById('btnContinueScreen5');
  let isEnvelopeOpened = false;

  function openLetter() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    ensureAudioContext();
    playMusicBoxNote(440.00, 1.1, 0.06);

    if (luxuryEnvelope) {
      luxuryEnvelope.classList.add('unfolded');
    }

    setTimeout(() => {
      spawnConfetti(55);
      playMusicBoxNote(659.25, 1.3, 0.05);
    }, 600);

    // Reveal continue button comfortably after unfolding
    setTimeout(() => {
      if (btnContinueScreen5) {
        btnContinueScreen5.classList.add('ready');
      }
    }, 1200);
  }

  if (luxuryEnvelope) {
    luxuryEnvelope.addEventListener('click', openLetter);
    luxuryEnvelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLetter();
      }
    });
  }

  if (heartSeal) {
    heartSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openLetter();
    });
  }

  if (btnContinueScreen5) {
    btnContinueScreen5.addEventListener('click', () => {
      transitionScreen('screen5', 'screen6');
    });
  }


  // =========================================================================
  // 11. SCREEN 06: The Final Gift Logic
  // =========================================================================
  const luxuryGiftBox = document.getElementById('luxuryGiftBox');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const giftTriggerArea = document.getElementById('giftTriggerArea');
  const finalCelebrationReveal = document.getElementById('finalCelebrationReveal');
  const btnReplay = document.getElementById('btnReplay');
  const btnExtraLove = document.getElementById('btnExtraLove');
  let isGiftOpened = false;

  function triggerGiftOpen() {
    if (isGiftOpened) return;
    isGiftOpened = true;

    ensureAudioContext();
    playCelebrationHarp();

    // Lid lifts and rotates back
    if (luxuryGiftBox) luxuryGiftBox.classList.add('opened');

    // Confetti blast and floating balloons
    spawnConfetti(120);
    launchFloatingBalloons();

    // Smoothly fade trigger button
    if (giftTriggerArea) {
      giftTriggerArea.style.opacity = '0';
      giftTriggerArea.style.pointerEvents = 'none';
      setTimeout(() => {
        giftTriggerArea.style.display = 'none';
      }, 300);
    }

    // Reveal final message
    setTimeout(() => {
      if (finalCelebrationReveal) {
        finalCelebrationReveal.classList.add('active');
      }
      spawnConfetti(80);
    }, 700);
  }

  if (btnOpenGift) {
    btnOpenGift.addEventListener('click', triggerGiftOpen);
  }
  if (luxuryGiftBox) {
    luxuryGiftBox.addEventListener('click', triggerGiftOpen);
    luxuryGiftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerGiftOpen();
      }
    });
  }

  if (btnExtraLove) {
    btnExtraLove.addEventListener('click', () => {
      spawnConfetti(80);
      launchFloatingBalloons();
      playCelebrationHarp();
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      // Reset interactive flags
      isEnvelopeOpened = false;
      isGiftOpened = false;
      currentTopIndex = 0;
      updateStackPositions();

      // Reset DOM state
      if (luxuryEnvelope) luxuryEnvelope.classList.remove('unfolded');
      if (btnContinueScreen5) btnContinueScreen5.classList.remove('ready');
      if (luxuryGiftBox) luxuryGiftBox.classList.remove('opened');
      if (finalCelebrationReveal) finalCelebrationReveal.classList.remove('active');
      if (giftTriggerArea) {
        giftTriggerArea.style.display = 'block';
        giftTriggerArea.style.opacity = '1';
        giftTriggerArea.style.pointerEvents = 'auto';
      }
      poppedCount = 0;
      if (popCounterPill) popCounterPill.textContent = 'Balloons Popped: 0 / 4';
      if (balloonPopGrid) balloonPopGrid.classList.remove('all-popped');
      balloonPods.forEach(p => p && p.classList.remove('popped'));
      if (unifiedMessageBlock) unifiedMessageBlock.classList.remove('revealed');
      if (btnNo) btnNo.style.transform = 'translate(0, 0)';
      if (playfulHint) playfulHint.textContent = '';

      transitionScreen('screen6', 'screen1');
    });
  }

});
