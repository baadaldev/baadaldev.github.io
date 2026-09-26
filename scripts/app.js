/**
 * =====================================================================
 * THE CITADEL MAIN APPLICATION CONTROLLER
 * =====================================================================
 * Orchestrates 3D astrolabe, audio orchestra, atmospheric particles,
 * dynamic realm configuration, Great House switcher, and modal dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load saved custom config from localStorage if available
  let realmData = window.REALM_CONFIG;
  const savedData = localStorage.getItem('CITADEL_REALM_DATA');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      realmData = Object.assign({}, window.REALM_CONFIG, parsed);
    } catch (e) {
      console.warn("Failed to load saved realm data:", e);
    }
  }

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

  // 3. Render all Dynamic Sections from Realm Data
  renderHero(realmData.lord);
  renderHousesOfTech(realmData.housesOfTech);
  renderCampaigns(realmData.campaigns);
  renderAnnals(realmData.annals);
  renderEndorsements(realmData.endorsements);

  // 4. Setup Audio Controller
  setupAudioWidget();

  // 5. Setup House Theme Switcher
  setupHouseSwitcher(realmData.defaultHouse || 'targaryen', atmosphere);

  // 6. Setup Cinematic Intro Curtain
  setupCinematicIntro(astrolabe3D);

  // 7. Setup Raven Dispatch Form
  setupRavenContact();

  // 8. Setup Citadel Scribe (In-place profile editor)
  setupCitadelScribe(realmData);

  // 9. Setup Global SFX on buttons
  setupSoundEffects();
});

// ==========================================
// RENDER HERO SECTION
// ==========================================
function renderHero(lord) {
  const nameEl = document.getElementById('hero-lord-name');
  const titleEl = document.getElementById('hero-lord-title');
  const creedEl = document.getElementById('hero-lord-creed');
  const avatarEl = document.getElementById('hero-avatar');
  const statsContainer = document.getElementById('realm-stats-bar');

  if (nameEl) nameEl.textContent = lord.name;
  if (titleEl) titleEl.textContent = lord.title;
  if (creedEl) creedEl.textContent = lord.bio;
  if (avatarEl && lord.avatar) avatarEl.src = lord.avatar;

  if (statsContainer && lord.stats) {
    statsContainer.innerHTML = lord.stats.map(s => `
      <div class="stat-box">
        <div class="stat-number">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }
}

// ==========================================
// RENDER HOUSES OF TECH (SKILLS)
// ==========================================
function renderHousesOfTech(houses) {
  const container = document.getElementById('houses-grid');
  if (!container || !houses) return;

  container.innerHTML = houses.map(house => `
    <div class="house-tech-card" data-house-id="${house.id}">
      <div class="house-card-header">
        <div class="house-card-sigil">${getHouseEmoji(house.sigilIcon)}</div>
        <div>
          <h3 class="house-card-name">${house.houseName}</h3>
          <div class="house-card-motto">“${house.motto}”</div>
        </div>
      </div>
      <p class="house-card-desc">${house.description}</p>
      <div class="skills-list">
        ${house.skills.map(s => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name"><span>${s.rune}</span> ${s.name}</span>
              <span class="skill-role">${s.mastery}%</span>
            </div>
            <div class="skill-blade-track">
              <div class="skill-blade-fill" style="width: ${s.mastery}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function getHouseEmoji(sigil) {
  switch (sigil) {
    case 'crown': return '👑';
    case 'sword': return '⚔️';
    case 'scroll': return '📜';
    case 'shield': return '🛡️';
    default: return '🏰';
  }
}

// ==========================================
// RENDER CHRONICLES OF CONQUEST (PROJECTS)
// ==========================================
function renderCampaigns(campaigns) {
  const container = document.getElementById('campaigns-grid');
  if (!container || !campaigns) return;

  container.innerHTML = campaigns.map(c => `
    <div class="campaign-card">
      <div class="campaign-image-box">
        <img class="campaign-img" src="${c.image}" alt="${c.title}" />
        <img class="campaign-wax-seal" src="assets/wax-seal.svg" alt="Royal Seal" />
        <div class="campaign-house-badge">
          <span>${c.sigil}</span> ${c.house}
        </div>
      </div>
      <div class="campaign-body">
        <h3 class="campaign-title">${c.title}</h3>
        <p class="campaign-summary">${c.summary}</p>
        <div class="campaign-tech-runes">
          ${c.techStack.map(t => `<span class="tech-rune">${t}</span>`).join('')}
        </div>
        <div class="campaign-actions">
          <button class="btn-campaign-modal" onclick="openBattleLoreModal('${c.id}')">
            <span>📜</span> View Battle Lore
          </button>
          <a class="btn-campaign-link" href="${c.githubUrl}" target="_blank" title="Inspect Repository">
            <span>⚔️</span>
          </a>
          <a class="btn-campaign-link" href="${c.liveUrl}" target="_blank" title="Enter Live Realm">
            <span>🏰</span>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// RENDER ANNALS (TIMELINE)
// ==========================================
function renderAnnals(annals) {
  const container = document.getElementById('annals-timeline');
  if (!container || !annals) return;

  container.innerHTML = annals.map(a => `
    <div class="annal-item">
      <div class="annal-gear-node">⚙️</div>
      <div class="annal-card">
        <div class="annal-era">${a.era}</div>
        <h3 class="annal-role">${a.role}</h3>
        <div class="annal-citadel">${a.citadel}</div>
        <p class="annal-desc">${a.description}</p>
      </div>
    </div>
  `).join('');
}

// ==========================================
// RENDER ENDORSEMENTS (TESTIMONIALS)
// ==========================================
function renderEndorsements(endorsements) {
  const container = document.getElementById('endorsements-grid');
  if (!container || !endorsements) return;

  container.innerHTML = endorsements.map(e => `
    <div class="endorsement-scroll-card">
      <div class="scroll-quote">${e.quote}</div>
      <div class="scroll-lord-info">
        <div class="lord-sigil">${e.sigil}</div>
        <div>
          <h4 class="lord-name">${e.lord}</h4>
          <div class="lord-title">${e.title}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// CINEMATIC INTRO CURTAIN
// ==========================================
function setupCinematicIntro(astrolabe3D) {
  const curtain = document.getElementById('intro-curtain');
  const btnEnter = document.getElementById('btn-enter-realm');

  if (!btnEnter || !curtain) return;

  btnEnter.addEventListener('click', () => {
    // Start Audio Orchestra & SFX
    if (window.realmAudio) {
      window.realmAudio.playSwordClang();
      window.realmAudio.startTheme();
      updateAudioWidgetUI(true);
    }

    // Trigger 3D Camera Dive
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

  // Visualizer bar animation loop
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

    // Play House signature sound effect
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

  // Apply default house
  setHouse(defaultHouse);
}

// ==========================================
// RAVEN DISPATCH CONTACT
// ==========================================
function setupRavenContact() {
  const form = document.getElementById('citadel-contact-form');
  const btnDispatch = document.getElementById('btn-dispatch-raven');
  const decreeConfirmed = document.getElementById('raven-decree-confirmed');

  if (!form || !btnDispatch) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Trigger Flying Raven Animation
    if (window.ravenFlightEngine) {
      window.ravenFlightEngine.dispatchRaven(btnDispatch, () => {
        if (decreeConfirmed) {
          decreeConfirmed.style.display = 'block';
          decreeConfirmed.scrollIntoView({ behavior: 'smooth' });
        }
        form.reset();
      });
    }
  });
}

// ==========================================
// BATTLE LORE MODAL
// ==========================================
window.openBattleLoreModal = function(campaignId) {
  const campaigns = window.REALM_CONFIG.campaigns;
  const project = campaigns.find(c => c.id === campaignId);
  if (!project) return;

  const modal = document.getElementById('battle-lore-modal');
  const title = document.getElementById('lore-modal-title');
  const subtitle = document.getElementById('lore-modal-subtitle');
  const body = document.getElementById('lore-modal-body');
  const stats = document.getElementById('lore-modal-stats');

  if (title) title.textContent = project.title;
  if (subtitle) subtitle.textContent = `${project.sigil} ${project.house} Campaign`;
  if (body) body.textContent = project.battleReport;

  if (stats && project.stats) {
    stats.innerHTML = Object.entries(project.stats).map(([k, v]) => `
      <div class="modal-stat-pill">
        <div class="modal-stat-val">${v}</div>
        <div class="modal-stat-key">${k}</div>
      </div>
    `).join('');
  }

  if (window.realmAudio) window.realmAudio.playParchmentRustle();
  if (modal) modal.classList.add('active');
};

window.closeBattleLoreModal = function() {
  const modal = document.getElementById('battle-lore-modal');
  if (modal) modal.classList.remove('active');
};

// ==========================================
// CITADEL SCRIBE (IN-PLACE EDITOR)
// ==========================================
function setupCitadelScribe(realmData) {
  const btnOpen = document.getElementById('btn-open-scribe');
  const modal = document.getElementById('citadel-scribe-modal');
  const form = document.getElementById('scribe-edit-form');

  if (!btnOpen || !modal || !form) return;

  btnOpen.addEventListener('click', () => {
    // Populate form with current data
    document.getElementById('scribe-name').value = realmData.lord.name || '';
    document.getElementById('scribe-title').value = realmData.lord.title || '';
    document.getElementById('scribe-creed').value = realmData.lord.bio || '';
    document.getElementById('scribe-email').value = realmData.lord.socials.email || '';
    document.getElementById('scribe-github').value = realmData.lord.socials.github || '';

    if (window.realmAudio) window.realmAudio.playParchmentRustle();
    modal.classList.add('active');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    realmData.lord.name = document.getElementById('scribe-name').value;
    realmData.lord.title = document.getElementById('scribe-title').value;
    realmData.lord.bio = document.getElementById('scribe-creed').value;
    realmData.lord.socials.email = document.getElementById('scribe-email').value;
    realmData.lord.socials.github = document.getElementById('scribe-github').value;

    // Save to localStorage
    localStorage.setItem('CITADEL_REALM_DATA', JSON.stringify(realmData));

    // Re-render Hero
    renderHero(realmData.lord);

    if (window.realmAudio) window.realmAudio.playWaxSealStamp();
    modal.classList.remove('active');
  });
}

window.closeScribeModal = function() {
  const modal = document.getElementById('citadel-scribe-modal');
  if (modal) modal.classList.remove('active');
};

// ==========================================
// SOUND EFFECTS ON HOVER & CLICKS
// ==========================================
function setupSoundEffects() {
  const interactiveButtons = document.querySelectorAll('.btn-primary-realm, .btn-campaign-modal, .btn-dispatch-raven, .btn-scribe-nav');
  interactiveButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (window.realmAudio && window.realmAudio.isPlaying) {
        window.realmAudio.playCogTick(window.realmAudio.ctx.currentTime);
      }
    });
  });
}
