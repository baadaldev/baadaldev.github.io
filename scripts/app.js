/**
 * =====================================================================
 * THE CITADEL MAIN APPLICATION CONTROLLER
 * =====================================================================
 * Integrates:
 * - 3D Astrolabe WebGL Viewport & Atmosphere Particles
 * - Real Game of Thrones Audio Engine (got-theme.mp3 + Web Audio Synth)
 * - 4 Great Houses Theme Switcher
 * - Live Dhaka Time Clock (UTC+6)
 * - Interactive DevTrack Focus Mini-Timer (25:00 countdown with audio chime)
 * - Interactive Developer Terminal (CLI) with full command execution
 * - Project Filter Tabs (All, Full Stack, Systems, DSA)
 * - Technical Case Studies Modal & Interactive Resume Modal
 * - Early Memories Image Lightbox
 * - Flying Raven Contact Dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Astrolabe
  let astrolabe3D = null;
  if (window.RealmAstrolabe3D) {
    astrolabe3D = new window.RealmAstrolabe3D('canvas-viewport');
  }

  // 2. Initialize Atmosphere Particles
  let atmosphere = null;
  if (window.RealmAtmosphereEngine) {
    atmosphere = new window.RealmAtmosphereEngine('particles-canvas');
  }

  // 3. Audio & Theme Controls
  setupAudioWidget();
  setupHouseSwitcher('targaryen', atmosphere);
  setupCinematicIntro(astrolabe3D);

  // 4. Interactive Live Widgets
  initDhakaClock();
  initMiniFocusTimer();
  initDevTerminal();
  initProjectFilters();
  initContactForm();
});

// ==========================================
// CINEMATIC INTRO CURTAIN
// ==========================================
function setupCinematicIntro(astrolabe3D) {
  const curtain = document.getElementById('intro-curtain');
  const btnEnter = document.getElementById('btn-enter-realm');

  if (!btnEnter || !curtain) return;

  btnEnter.addEventListener('click', () => {
    if (window.realmAudio) {
      window.realmAudio.playSwordClang();
      window.realmAudio.startTheme();
      updateAudioWidgetUI(true);
    }

    if (astrolabe3D && astrolabe3D.triggerCinematicIntro) {
      astrolabe3D.triggerCinematicIntro(() => {
        curtain.classList.add('realm-entered');
      });
    } else {
      curtain.classList.add('realm-entered');
    }
  });
}

// ==========================================
// AUDIO WIDGET & VISUALIZER
// ==========================================
function setupAudioWidget() {
  const widget = document.getElementById('realm-audio-widget');
  const playBtn = document.getElementById('audio-play-btn');
  const volSlider = document.getElementById('audio-vol-slider');

  if (!widget || !playBtn) return;

  playBtn.addEventListener('click', () => {
    if (window.realmAudio) {
      const isPlaying = window.realmAudio.toggleTheme();
      updateAudioWidgetUI(isPlaying);
    }
  });

  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      if (window.realmAudio) {
        window.realmAudio.setVolume(parseFloat(e.target.value));
      }
    });
  }

  // Visualizer frequency loop
  setInterval(() => {
    if (window.realmAudio && window.realmAudio.isPlaying && window.realmAudio.analyser) {
      const data = new Uint8Array(window.realmAudio.analyser.frequencyBinCount);
      window.realmAudio.analyser.getByteFrequencyData(data);
      const bars = document.querySelectorAll('.vis-bar');
      bars.forEach((bar, idx) => {
        const val = data[idx * 3] || 10;
        const h = Math.max(3, (val / 255) * 18);
        bar.style.height = `${h}px`;
      });
    }
  }, 60);
}

function updateAudioWidgetUI(isPlaying) {
  const widget = document.getElementById('realm-audio-widget');
  const playBtn = document.getElementById('audio-play-btn');
  if (playBtn) playBtn.textContent = isPlaying ? '⏸' : '▶';
  if (widget) {
    if (isPlaying) widget.classList.add('playing');
    else widget.classList.remove('playing');
  }
}

// ==========================================
// HOUSE THEME SWITCHER
// ==========================================
function setupHouseSwitcher(defaultHouse, atmosphere) {
  const buttons = document.querySelectorAll('.house-btn');

  const setHouse = (houseName) => {
    document.body.className = `house-${houseName}`;
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.house === houseName);
    });

    if (atmosphere) {
      atmosphere.setTheme(houseName);
    }

    if (window.realmAudio) {
      if (houseName === 'targaryen') window.realmAudio.playDragonFire();
      else if (houseName === 'stark') window.realmAudio.playWinterWind();
      else if (houseName === 'lannister') window.realmAudio.playSwordClang();
      else if (houseName === 'nightswatch') window.realmAudio.playRavenCaw();
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setHouse(btn.dataset.house);
    });
  });

  setHouse(defaultHouse);
}

// ==========================================
// 1. LIVE DHAKA TIME CLOCK (UTC+6)
// ==========================================
function initDhakaClock() {
  const clockEl = document.getElementById("live-dhaka-clock");
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    // Dhaka is UTC+6
    const dhakaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));

    let hours = dhakaTime.getHours();
    const minutes = String(dhakaTime.getMinutes()).padStart(2, "0");
    const seconds = String(dhakaTime.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");

    clockEl.textContent = `${strHours}:${minutes}:${seconds} ${ampm}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

// ==========================================
// 2. INTERACTIVE DEVTRACK FOCUS MINI-TIMER
// ==========================================
function initMiniFocusTimer() {
  const display = document.getElementById("mini-timer-time");
  const toggleBtn = document.getElementById("mini-timer-toggle");
  const resetBtn = document.getElementById("mini-timer-reset");

  if (!display || !toggleBtn || !resetBtn) return;

  let totalSeconds = 25 * 60; // 25:00 pomodoro
  let isRunning = false;
  let interval = null;

  function renderTimer() {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    display.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  toggleBtn.addEventListener("click", () => {
    if (window.realmAudio && window.realmAudio.isPlaying) {
      window.realmAudio.playCogTick(window.realmAudio.ctx.currentTime);
    }

    if (isRunning) {
      clearInterval(interval);
      isRunning = false;
      toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
      toggleBtn.classList.remove("active");
    } else {
      isRunning = true;
      toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
      toggleBtn.classList.add("active");
      interval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          renderTimer();
        } else {
          clearInterval(interval);
          isRunning = false;
          toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
          if (window.realmAudio) window.realmAudio.playSwordClang();
          alert("Focus session complete! Take a well-deserved break.");
        }
      }, 1000);
    }
  });

  resetBtn.addEventListener("click", () => {
    if (window.realmAudio && window.realmAudio.isPlaying) {
      window.realmAudio.playCogTick(window.realmAudio.ctx.currentTime);
    }
    clearInterval(interval);
    isRunning = false;
    totalSeconds = 25 * 60;
    renderTimer();
    toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
    toggleBtn.classList.remove("active");
  });

  renderTimer();
}

// ==========================================
// 3. INTERACTIVE DEVELOPER TERMINAL (CLI)
// ==========================================
function initDevTerminal() {
  const input = document.getElementById("terminal-input");
  const body = document.getElementById("terminal-body");
  const clearBtn = document.getElementById("term-clear-btn");
  const chips = document.querySelectorAll(".term-chip");

  if (!input || !body) return;

  const COMMANDS = {
    help: `
Available commands:
  <span class="term-code">bio</span>          - Overview of Rakibul Islam (Baadal)
  <span class="term-code">skills</span>       - Key technical stack & tools
  <span class="term-code">projects</span>     - Production software & systems
  <span class="term-code">stats</span>        - Problem solving & academic metrics
  <span class="term-code">sudo hire</span>    - Request software engineering collaboration
  <span class="term-code">contact</span>      - Email, GitHub, and social channels
  <span class="term-code">clear</span>        - Clear terminal window output
    `,
    bio: `
<strong>Md Rakibul Islam (Baadal)</strong>
Undergraduate CSE student at Daffodil International University (DIU).
Started programming in Feb 2019 on SoloLearn on a smartphone screen.
Focuses on C++ algorithms, full-stack web applications (Next.js, Node.js, Express), and scalable system design.
    `,
    skills: `
<strong>Technical Arsenal:</strong>
  - Languages: C / C++20, JavaScript (ES6+), Python, SQL, HTML5/CSS3
  - Web & Frameworks: React 19, Next.js 16, Node.js, Express, Tailwind CSS, REST APIs
  - Databases: MySQL, MongoDB / Mongoose, Redis, Cloudinary CDN
  - CS Fundamentals: Data Structures, Algorithms, OOP, Discrete Math
    `,
    projects: `
<strong>Featured Software Systems:</strong>
  1. NEXUS: Mathematical Future Trajectory Simulator (Next.js 16, React 19)
  2. DevTrack PRO: Engineering Study OS (Picture-in-Picture API, Canvas Stream, Web Audio)
  3. Discipline Tracker: Cognitive Habit Engine (TypeScript, 365-day Heatmap)
  4. WanderLust: Vacation Marketplace (Node.js, Express, MongoDB, Mapbox SDK)
  5. Smart Meal Management System (MySQL, JavaScript, Relational Schema)
  6. C++ Algorithms & LeetCode Hub (C++20, STL, 50+ Solved Challenges)
    `,
    stats: `
<strong>Engineering Track Record:</strong>
  - 50+ Algorithmic challenges solved on LeetCode & Beecrowd
  - 4th Semester Standing in B.Sc. in CSE at Daffodil International University
  - 5+ Production software applications deployed
  - 7+ Years of coding since mobile SoloLearn beginnings in Feb 2019
    `,
    "sudo hire": `
<span style="color: #22c55e;">[ACCESS GRANTED]</span> Open for Software Engineering Internships and high-impact web development roles.
Reach out at: <a href="mailto:badolrakib1@gmail.com" style="color: #38bdf8;">badolrakib1@gmail.com</a>
    `,
    "sudo hire-baadal": `
<span style="color: #22c55e;">[ACCESS GRANTED]</span> Open for Software Engineering Internships and high-impact web development roles.
Reach out at: <a href="mailto:badolrakib1@gmail.com" style="color: #38bdf8;">badolrakib1@gmail.com</a>
    `,
    contact: `
Email:   <a href="mailto:badolrakib1@gmail.com" style="color: #38bdf8;">badolrakib1@gmail.com</a>
GitHub:  <a href="https://github.com/baadaldev" target="_blank" style="color: #38bdf8;">github.com/baadaldev</a>
Location: Dhaka, Bangladesh • Daffodil International University
    `
  };

  function executeCmd(cmdText) {
    const raw = cmdText.trim();
    const cmd = raw.toLowerCase();

    if (!cmd) return;

    // Echo command
    const cmdLine = document.createElement("div");
    cmdLine.className = "term-line";
    cmdLine.innerHTML = `<span style="color: #38bdf8;">┌──(</span><span style="color: #22c55e;">baadal@diu-cse</span><span style="color: #38bdf8;">)-[</span><span style="color: #f59e0b;">~</span><span style="color: #38bdf8;">]</span><br /><span style="color: #38bdf8;">└─$</span> <span class="term-highlight">${escapeHTML(raw)}</span>`;
    body.appendChild(cmdLine);

    if (cmd === "clear") {
      body.innerHTML = "";
      return;
    }

    const resLine = document.createElement("div");
    resLine.className = "term-line";

    if (COMMANDS[cmd]) {
      resLine.innerHTML = COMMANDS[cmd].trim();
    } else {
      resLine.innerHTML = `zsh: command not found: <span class="term-highlight">${escapeHTML(cmd)}</span>. Type <span class="term-code">help</span> for available commands.`;
    }

    body.appendChild(resLine);
    body.scrollTop = body.scrollHeight;

    if (window.realmAudio && window.realmAudio.isPlaying) {
      window.realmAudio.playCogTick(window.realmAudio.ctx.currentTime);
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      executeCmd(input.value);
      input.value = "";
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      body.innerHTML = "";
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const c = chip.getAttribute("data-cmd");
      if (c) executeCmd(c);
    });
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// ==========================================
// 4. PROJECT FILTER TABS
// ==========================================
function initProjectFilters() {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".project-card-premium");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      cards.forEach(card => {
        const categories = card.getAttribute("data-category") || "";
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });

      if (window.realmAudio && window.realmAudio.isPlaying) {
        window.realmAudio.playCogTick(window.realmAudio.ctx.currentTime);
      }
    });
  });
}

// ==========================================
// 5. TECHNICAL CASE STUDIES DATA & MODALS
// ==========================================
const caseStudiesData = {
  nexus: {
    title: "NEXUS: Mathematical Future Trajectory Simulator",
    content: `
      <h4>Overview &amp; Problem Statement</h4>
      <p>Traditional habit and goal applications only record past completions without modeling the long-term mathematical consequences of daily compounding efforts or neglect.</p>
      <br />
      <h4>System Architecture</h4>
      <ul>
        <li><strong>Next.js 16 &amp; React 19 Core:</strong> Engineered with cutting-edge server components, zero layout shifts, and sub-10ms reactive client-side state recomputations.</li>
        <li><strong>Stochastic Compounding Engine:</strong> Mathematical models that project 5-year and 10-year skill, financial, and health curves based on daily variance and habit decay rates.</li>
        <li><strong>Tailwind CSS &amp; Hardware Acceleration:</strong> High-performance UI with fluid animations, zero CPU throttling, and responsive mobile/desktop layouts.</li>
      </ul>
      <br />
      <h4>Key Metrics</h4>
      <p>100% Client-side state persistence without DB latency, instant scenario branch comparisons, and zero bundle bloat.</p>
    `
  },
  discipline: {
    title: "Discipline Tracker: Cognitive Habit Engine",
    content: `
      <h4>Overview</h4>
      <p>A high-performance behavioral engineering system designed to systematically reinforce positive feedback loops and eliminate friction in algorithmic study routines.</p>
      <br />
      <h4>Technical Highlights</h4>
      <ul>
        <li><strong>State Partitioning:</strong> Isolated local storage databases with automatic schema migrations and encrypted data backup options.</li>
        <li><strong>Micro-Reward Feedback:</strong> Synthesized auditory and visual particle rewards upon milestone completions.</li>
        <li><strong>Continuous Streak Analytics:</strong> Rolling 30-day and 365-day heatmaps inspired by GitHub's contribution graph.</li>
      </ul>
    `
  },
  devtrack: {
    title: "DevTrack PRO: Technical Architecture & System Design",
    content: `
      <h4>Overview</h4>
      <p>DevTrack PRO was engineered to solve developer distraction and study fragmentation. The core challenge was keeping focus timers and lecture trackers visible while actively working in VS Code and LeetCode on a single monitor setup.</p>
      <br />
      <h4>Key Technical Innovations</h4>
      <ul>
        <li><strong>Native Windows Always-on-Top PiP:</strong> Utilizes the Picture-in-Picture API coupled with a dynamic 60fps HTML5 Canvas Stream to render an OS-level floating HUD that remains pinned over all desktop applications.</li>
        <li><strong>Web Audio Procedural Sound Engine:</strong> Zero-dependency acoustic notifications synthesized using pure JavaScript AudioContext oscillators.</li>
        <li><strong>Multi-Profile Local Database:</strong> Isolated user workspace profiles with real-time JSON export/import and automated crash recovery.</li>
      </ul>
    `
  },
  wanderlust: {
    title: "WanderLust: Full-Stack Vacation Marketplace",
    content: `
      <h4>Overview</h4>
      <p>A production-ready vacation rental platform following the MVC architectural pattern, handling dynamic accommodation listings, geolocation services, and secure user reservations.</p>
      <br />
      <h4>Technical Stack &amp; Architecture</h4>
      <ul>
        <li><strong>Backend Engine:</strong> Node.js and Express.js RESTful APIs with Joi schema validations and centralized asynchronous error handling middlewares.</li>
        <li><strong>Database:</strong> MongoDB Atlas with Mongoose ODM schemas for nested reviews and relational user listings.</li>
        <li><strong>Third-Party Integrations:</strong> Mapbox SDK for forward geocoding coordinate lookups, and Cloudinary CDN for optimized image storage.</li>
      </ul>
    `
  },
  smartmeal: {
    title: "Smart Meal Management: Architecture & System Design",
    content: `
      <h4>Overview &amp; Domain Problem</h4>
      <p>Managing mess and hostel dining accounts manually causes transparency issues, lost receipts, and calculation disputes. This platform automates the entire daily ledger computation.</p>
      <br />
      <h4>Database &amp; Schema Design</h4>
      <ul>
        <li><strong>Relational SQL Integrity:</strong> Structured schema enforcing foreign keys between Members, Daily Meals, Deposit Balances, and Grocery Expense Ledgers.</li>
        <li><strong>Automated Calculation Triggers:</strong> Dynamic meal rate algorithms that automatically balance member debit/credit accounts at the end of every monthly cycle.</li>
      </ul>
    `
  },
  student: {
    title: "DIU Student Management System: Architecture",
    content: `
      <h4>Overview</h4>
      <p>An enterprise university portal streamlining departmental records, student course enrollments, attendance logs, and GPA calculations.</p>
      <br />
      <h4>Key Features</h4>
      <ul>
        <li><strong>Role-Based Administrative Access:</strong> Separated control views for Faculty, Department Heads, and Students.</li>
        <li><strong>Query Optimization:</strong> Indexing relational tables for fast sub-50ms student transcript and attendance queries.</li>
      </ul>
    `
  },
  dsa: {
    title: "C++ Algorithms & LeetCode Practice Repository",
    content: `
      <h4>Overview</h4>
      <p>A curated repository reflecting rigorous study in asymptotic computational complexity, memory pointers, and classic algorithmic paradigms.</p>
      <br />
      <h4>Covered Paradigms</h4>
      <ul>
        <li><strong>Two Pointers &amp; Sliding Window:</strong> Optimal O(n) array and substring solutions.</li>
        <li><strong>Trees &amp; Graphs:</strong> DFS, BFS, Binary Search Tree traversals, and topological sorting.</li>
        <li><strong>Dynamic Programming:</strong> Memoization and Tabulation for 1D and 2D subproblem states.</li>
      </ul>
    `
  }
};

window.openCaseStudy = function(caseKey) {
  const data = caseStudiesData[caseKey];
  if (!data) return;

  const titleEl = document.getElementById("modal-title");
  const bodyEl = document.getElementById("modal-body");
  const backdrop = document.getElementById("general-modal-backdrop");

  if (titleEl && bodyEl && backdrop) {
    titleEl.textContent = data.title;
    bodyEl.innerHTML = data.content;
    backdrop.classList.add("open");
    if (window.realmAudio) window.realmAudio.playParchmentRustle();
  }
};

window.openResumeModal = function() {
  const titleEl = document.getElementById("modal-title");
  const bodyEl = document.getElementById("modal-body");
  const backdrop = document.getElementById("general-modal-backdrop");

  if (titleEl && bodyEl && backdrop) {
    titleEl.textContent = "Md Rakibul Islam (Baadal) — Interactive Resume";
    bodyEl.innerHTML = `
      <h4>Education</h4>
      <p><strong>B.Sc. in Computer Science &amp; Engineering</strong><br />
      Daffodil International University (DIU), Dhaka &bull; 4th Semester</p>
      <br />
      <h4>Core Technical Skills</h4>
      <p><strong>Languages:</strong> C, C++20, JavaScript (ES6+), Python, SQL, HTML5/CSS3<br />
      <strong>Web &amp; Frameworks:</strong> React 19, Next.js, Node.js, Express.js, Tailwind CSS<br />
      <strong>Databases:</strong> MySQL, MongoDB, Redis<br />
      <strong>Tools:</strong> Git, GitHub, Linux, VS Code, Postman</p>
      <br />
      <h4>Key Projects</h4>
      <ul>
        <li><strong>DevTrack PRO:</strong> Study OS with Picture-in-Picture floating mini-timer.</li>
        <li><strong>NEXUS:</strong> Mathematical 10-year compounding trajectory simulator.</li>
        <li><strong>WanderLust:</strong> MERN-stack vacation marketplace with Mapbox SDK.</li>
        <li><strong>Smart Meal Management:</strong> Hostel dining automation with MySQL.</li>
      </ul>
      <br />
      <h4>Contact &amp; Profiles</h4>
      <p>Email: <a href="mailto:badolrakib1@gmail.com" style="color: #38bdf8;">badolrakib1@gmail.com</a><br />
      GitHub: <a href="https://github.com/baadaldev" target="_blank" style="color: #38bdf8;">github.com/baadaldev</a><br />
      LinkedIn: <a href="https://linkedin.com/in/baadaldev" target="_blank" style="color: #38bdf8;">linkedin.com/in/baadaldev</a></p>
    `;
    backdrop.classList.add("open");
    if (window.realmAudio) window.realmAudio.playParchmentRustle();
  }
};

window.closeModal = function() {
  const backdrop = document.getElementById("general-modal-backdrop");
  if (backdrop) backdrop.classList.remove("open");
};

// ==========================================
// 6. IMAGE LIGHTBOX (MEMORIES)
// ==========================================
window.openLightbox = function(src, caption) {
  const lightbox = document.getElementById("lightbox-modal-backdrop");
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-caption");

  if (lightbox && img) {
    img.src = src;
    if (cap) cap.textContent = caption || "";
    lightbox.classList.add("open");
    if (window.realmAudio) window.realmAudio.playParchmentRustle();
  }
};

window.closeLightbox = function() {
  const lightbox = document.getElementById("lightbox-modal-backdrop");
  if (lightbox) lightbox.classList.remove("open");
};

// ==========================================
// 7. CONTACT FORM & FLYING RAVEN DISPATCH
// ==========================================
function initContactForm() {
  const form = document.getElementById("citadel-contact-form");
  const btn = document.getElementById("btn-dispatch-raven");
  const confirmed = document.getElementById("raven-decree-confirmed");

  if (!form || !btn) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (window.ravenFlightEngine) {
      window.ravenFlightEngine.dispatchRaven(btn, () => {
        if (confirmed) {
          confirmed.style.display = "block";
          confirmed.scrollIntoView({ behavior: "smooth" });
        }
        form.reset();
      });
    }
  });
}
