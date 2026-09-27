/**
 * =====================================================================
 * THE CITADEL DRAGONFIRE & REALM ATMOSPHERE ENGINE (Canvas 2D)
 * =====================================================================
 * Generates:
 * - Multi-layered procedural Dragon Fire tongues (রোরিং ড্রাগন আগুন)
 * - Swirling thermal embers with white-hot cores & smoke dissipation
 * - Audio-reactive flame bursts synchronized with war drums & cellos
 * - Scroll-driven inferno intensification across sections
 * - Interactive cursor dragon-breath spark trails
 * - Seamless adaptation to the 4 Great Houses (Targaryen, Stark, Lannister, Night's Watch)
 */

class RealmAtmosphereEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparkBursts = [];
    this.mouseTrails = [];
    this.particleCount = 110;
    this.currentTheme = 'targaryen';
    this.mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, radius: 150 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    // 4 Great Houses Thematic Profiles
    this.themeColors = {
      targaryen: {
        primary: 'rgba(255, 90, 15, ',
        secondary: 'rgba(255, 30, 0, ',
        core: '#fff5cc',
        glow: '#ff4400',
        flameGrad1: 'rgba(255, 60, 0, 0.45)',
        flameGrad2: 'rgba(255, 140, 0, 0.25)',
        flameGrad3: 'rgba(255, 200, 0, 0.1)',
        direction: -1, // Rising upward like dragonfire
        type: 'ember'
      },
      stark: {
        primary: 'rgba(160, 220, 255, ',
        secondary: 'rgba(255, 255, 255, ',
        core: '#ffffff',
        glow: '#64b5f6',
        flameGrad1: 'rgba(100, 180, 255, 0.35)',
        flameGrad2: 'rgba(180, 225, 255, 0.18)',
        flameGrad3: 'rgba(240, 250, 255, 0.05)',
        direction: 1, // Falling downward like Winterfell blizzard
        type: 'snow'
      },
      lannister: {
        primary: 'rgba(255, 215, 0, ',
        secondary: 'rgba(218, 165, 32, ',
        core: '#fffbe6',
        glow: '#ffd700',
        flameGrad1: 'rgba(218, 165, 32, 0.4)',
        flameGrad2: 'rgba(255, 215, 0, 0.2)',
        flameGrad3: 'rgba(255, 245, 180, 0.08)',
        direction: -0.6,
        type: 'goldDust'
      },
      nightswatch: {
        primary: 'rgba(0, 255, 170, ',
        secondary: 'rgba(0, 200, 120, ',
        core: '#d4ffe8',
        glow: '#00e676',
        flameGrad1: 'rgba(0, 230, 118, 0.45)',
        flameGrad2: 'rgba(0, 255, 180, 0.25)',
        flameGrad3: 'rgba(180, 255, 220, 0.1)',
        direction: -0.9,
        type: 'wildfire'
      }
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Spawn interactive cursor fire sparks
      if (Math.hypot(this.mouse.x - this.mouse.lastX, this.mouse.y - this.mouse.lastY) > 8) {
        this.spawnCursorSpark(this.mouse.x, this.mouse.y);
      }
    });

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.targetScrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    }, { passive: true });

    this.createParticles();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setTheme(themeName) {
    if (this.themeColors[themeName]) {
      this.currentTheme = themeName;
      this.particles.forEach(p => this.resetParticle(p));
    }
  }

  resetParticle(p) {
    const theme = this.themeColors[this.currentTheme];
    p.x = Math.random() * this.canvas.width;
    p.y = theme.direction < 0 ? this.canvas.height + Math.random() * 30 : -20;
    p.size = Math.random() * 3.4 + 1.0;
    p.speedY = (Math.random() * 2.2 + 0.8) * theme.direction;
    p.speedX = (Math.random() - 0.5) * 1.2;
    p.opacity = Math.random() * 0.7 + 0.3;
    p.fadeSpeed = Math.random() * 0.006 + 0.002;
    p.flickerSpeed = Math.random() * 0.08 + 0.02;
    p.colorBase = Math.random() > 0.4 ? theme.primary : theme.secondary;
    p.sway = Math.random() * Math.PI * 2;
    p.swaySpeed = Math.random() * 0.025 + 0.01;
    p.isHotCore = Math.random() > 0.65;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const p = {};
      this.resetParticle(p);
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }
  }

  spawnCursorSpark(x, y) {
    const theme = this.themeColors[this.currentTheme];
    for (let i = 0; i < 2; i++) {
      this.mouseTrails.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.8) * 3.0,
        size: Math.random() * 2.5 + 1.2,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.02,
        color: theme.primary
      });
    }
    if (this.mouseTrails.length > 60) this.mouseTrails.shift();
  }

  triggerDragonRoarBlast(originX, originY) {
    const theme = this.themeColors[this.currentTheme];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 7.5 + 3.0;
      this.sparkBursts.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.2 + 1.5,
        life: 1.0,
        decay: Math.random() * 0.025 + 0.015,
        color: theme.primary
      });
    }
  }

  renderDragonFlames(audio, now) {
    const theme = this.themeColors[this.currentTheme];
    // Flames are active for Targaryen, Wildfire, and Lannister
    if (theme.type === 'snow') return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Base flame height increases with scroll progress (up to 45% of screen height)
    const scrollFlameBoost = this.scrollProgress * (h * 0.32);
    const audioFlameBoost = audio.active ? (audio.bass * 120) : (Math.sin(now * 3) * 15);
    const baseFlameHeight = 35 + scrollFlameBoost + audioFlameBoost;

    // 1. Bottom Glow Heat Gradient
    const heatGrad = ctx.createLinearGradient(0, h, 0, h - baseFlameHeight * 1.5);
    heatGrad.addColorStop(0, theme.flameGrad1);
    heatGrad.addColorStop(0.5, theme.flameGrad2);
    heatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.fillStyle = heatGrad;
    ctx.fillRect(0, h - baseFlameHeight * 1.5, w, baseFlameHeight * 1.5);
    ctx.restore();

    // 2. Procedural Sinusoidal Flame Tongues (Layered)
    const flameLayers = [
      { tongues: 14, speed: 2.8, heightMult: 1.25, alpha: 0.35, color: theme.secondary },
      { tongues: 20, speed: 4.2, heightMult: 1.0, alpha: 0.55, color: theme.primary },
      { tongues: 26, speed: 6.0, heightMult: 0.65, alpha: 0.85, color: 'rgba(255, 230, 120, ' }
    ];

    flameLayers.forEach((layer) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h);

      const step = w / layer.tongues;
      for (let i = 0; i <= layer.tongues; i++) {
        const x = i * step;
        const wave1 = Math.sin(now * layer.speed + i * 1.2) * 25;
        const wave2 = Math.cos(now * (layer.speed * 0.7) + i * 0.8) * 18;
        const tongueH = baseFlameHeight * layer.heightMult + wave1 + wave2;
        const y = h - Math.max(10, tongueH);

        const cpX = x - step / 2;
        const cpY = y - (wave1 * 0.5);
        ctx.quadraticCurveTo(cpX, cpY, x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      const layerGrad = ctx.createLinearGradient(0, h, 0, h - baseFlameHeight * layer.heightMult);
      layerGrad.addColorStop(0, layer.color + (layer.alpha * (0.6 + this.scrollProgress * 0.4)) + ')');
      layerGrad.addColorStop(0.7, layer.color + (layer.alpha * 0.3) + ')');
      layerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = layerGrad;
      ctx.fill();
      ctx.restore();
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const now = performance.now() * 0.001;
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Fetch Audio Metrics
    const audio = window.realmAudio ? window.realmAudio.getAudioMetrics() : { active: false, bass: 0, level: 0, isBeat: false };

    // Trigger explosive spark blast on audio beat drop!
    if (audio.isBeat) {
      const originX = this.canvas.width / 2;
      const originY = this.canvas.height / 2;
      this.triggerDragonRoarBlast(originX, originY);
    }

    // 1. Render Roaring Dragon Fire at bottom of screen
    this.renderDragonFlames(audio, now);

    const theme = this.themeColors[this.currentTheme];

    // 2. Render Main Embers / Atmospheric Dust
    const activeParticleCount = Math.floor(this.particleCount * (1.0 + this.scrollProgress * 0.6));

    for (let i = 0; i < Math.min(this.particles.length, activeParticleCount); i++) {
      const p = this.particles[i];

      // Thermal Updraft acceleration based on scroll & audio
      const updraft = 1.0 + (this.scrollProgress * 1.5) + (audio.active ? audio.bass * 2.0 : 0);

      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * (0.6 + this.scrollProgress * 0.4);
      p.y += p.speedY * updraft;

      // Mouse interactive push/deflection
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 2.5;
        p.x -= (dx / dist) * force * 3;
        p.y -= (dy / dist) * force * 3;
      }

      // Dynamic opacity flicker
      const currentOpacity = Math.max(0.15, p.opacity + Math.sin(now * 8 * p.flickerSpeed) * 0.25);

      // Draw Glowing Ember
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      // Multi-stop radial heat gradient
      const glowRadius = p.size * (2.8 + (audio.active ? audio.bass * 2.0 : 0));
      const glowGrad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);

      if (p.isHotCore) {
        glowGrad.addColorStop(0, '#ffffff');
        glowGrad.addColorStop(0.25, theme.core);
        glowGrad.addColorStop(0.6, p.colorBase + currentOpacity + ')');
        glowGrad.addColorStop(1, p.colorBase + '0)');
      } else {
        glowGrad.addColorStop(0, p.colorBase + currentOpacity + ')');
        glowGrad.addColorStop(0.5, p.colorBase + (currentOpacity * 0.5) + ')');
        glowGrad.addColorStop(1, p.colorBase + '0)');
      }

      this.ctx.fillStyle = glowGrad;
      this.ctx.shadowColor = theme.glow;
      this.ctx.shadowBlur = p.size * (3.5 + this.scrollProgress * 3.0);
      this.ctx.fill();
      this.ctx.restore();

      // Reset when out of bounds
      if (theme.direction < 0 && p.y < -30) {
        this.resetParticle(p);
      } else if (theme.direction > 0 && p.y > this.canvas.height + 30) {
        this.resetParticle(p);
      } else if (p.x < -30 || p.x > this.canvas.width + 30) {
        this.resetParticle(p);
      }
    }

    // 3. Render Cursor Dragon-Breath Trails
    for (let i = this.mouseTrails.length - 1; i >= 0; i--) {
      const sp = this.mouseTrails[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= sp.decay;

      if (sp.life <= 0) {
        this.mouseTrails.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      this.ctx.fillStyle = sp.color + sp.life + ')';
      this.ctx.shadowColor = theme.glow;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Render Beat Burst Sparks (Dragon Roar Blast)
    for (let i = this.sparkBursts.length - 1; i >= 0; i--) {
      const sp = this.sparkBursts[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.94; // friction
      sp.vy *= 0.94;
      sp.life -= sp.decay;

      if (sp.life <= 0) {
        this.sparkBursts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      this.ctx.fillStyle = sp.color + sp.life + ')';
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = 14;
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

window.RealmAtmosphereEngine = RealmAtmosphereEngine;
