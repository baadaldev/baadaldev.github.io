/**
 * =====================================================================
 * THE CITADEL REALM PARTICLES & ATMOSPHERE (Canvas Particle Engine)
 * =====================================================================
 * Generates floating dragon embers, drifting ash, winter snowflakes,
 * and royal gold dust that dynamically adapt to the active Great House!
 */

class RealmAtmosphereEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 75;
    this.currentTheme = 'targaryen';
    this.mouse = { x: -1000, y: -1000, radius: 140 };

    this.themeColors = {
      targaryen: {
        primary: 'rgba(255, 120, 20, ',
        secondary: 'rgba(255, 60, 20, ',
        glow: '#ff5500',
        direction: -1, // Rising up like dragon fire embers
        type: 'ember'
      },
      stark: {
        primary: 'rgba(160, 215, 255, ',
        secondary: 'rgba(255, 255, 255, ',
        glow: '#64b5f6',
        direction: 1, // Falling down like Winterfell snow
        type: 'snow'
      },
      lannister: {
        primary: 'rgba(255, 215, 0, ',
        secondary: 'rgba(218, 165, 32, ',
        glow: '#ffd700',
        direction: -0.5,
        type: 'goldDust'
      },
      nightswatch: {
        primary: 'rgba(0, 255, 180, ', // Wildfire emerald
        secondary: 'rgba(50, 200, 150, ',
        glow: '#00e676',
        direction: -0.8,
        type: 'wildfire'
      }
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

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
      // Re-seed particle colors
      this.particles.forEach(p => this.resetParticle(p));
    }
  }

  resetParticle(p) {
    const theme = this.themeColors[this.currentTheme];
    p.x = Math.random() * this.canvas.width;
    p.y = theme.direction < 0 ? this.canvas.height + Math.random() * 20 : -10;
    p.size = Math.random() * 3.2 + 0.8;
    p.speedY = (Math.random() * 1.5 + 0.5) * theme.direction;
    p.speedX = (Math.random() - 0.5) * 0.8;
    p.opacity = Math.random() * 0.7 + 0.3;
    p.fadeSpeed = Math.random() * 0.008 + 0.003;
    p.flickerSpeed = Math.random() * 0.08 + 0.02;
    p.colorBase = Math.random() > 0.4 ? theme.primary : theme.secondary;
    p.sway = Math.random() * Math.PI * 2;
    p.swaySpeed = Math.random() * 0.02 + 0.01;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const p = {};
      this.resetParticle(p);
      // Stagger initial Y across screen
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const theme = this.themeColors[this.currentTheme];

    this.particles.forEach(p => {
      // Sway & movement
      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * 0.4;
      p.y += p.speedY;

      // Mouse interactive push
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 2;
        p.x -= (dx / dist) * force * 3;
        p.y -= (dy / dist) * force * 3;
      }

      // Flicker effect
      const currentOpacity = Math.max(0.1, p.opacity + Math.sin(Date.now() * p.flickerSpeed) * 0.2);

      // Draw Ember
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      // Radial glow gradient for realistic glowing heat
      const glowGrad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
      glowGrad.addColorStop(0, p.colorBase + currentOpacity + ')');
      glowGrad.addColorStop(0.4, p.colorBase + (currentOpacity * 0.5) + ')');
      glowGrad.addColorStop(1, p.colorBase + '0)');

      this.ctx.fillStyle = glowGrad;
      this.ctx.shadowColor = theme.glow;
      this.ctx.shadowBlur = p.size * 4;
      this.ctx.fill();
      this.ctx.restore();

      // Reset when out of screen bounds
      if (theme.direction < 0 && p.y < -20) {
        this.resetParticle(p);
      } else if (theme.direction > 0 && p.y > this.canvas.height + 20) {
        this.resetParticle(p);
      } else if (p.x < -20 || p.x > this.canvas.width + 20) {
        this.resetParticle(p);
      }
    });
  }
}

window.RealmAtmosphereEngine = RealmAtmosphereEngine;
