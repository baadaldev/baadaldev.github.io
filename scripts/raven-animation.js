/**
 * =====================================================================
 * THE CITADEL RAVEN MESSENGER DISPATCH ANIMATION
 * =====================================================================
 * Animates a majestic silhouette raven swooping across the starry sky
 * with dynamic wing flapping cycles and ink trail when dispatching scrolls.
 */

class RavenFlightEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isFlying = false;
    this.raven = null;
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'raven-flight-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  dispatchRaven(startEl, onComplete) {
    if (this.isFlying) return;
    this.isFlying = true;

    // Calculate start position from button or form
    let startX = window.innerWidth * 0.5;
    let startY = window.innerHeight * 0.7;

    if (startEl) {
      const rect = startEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    // Play Raven sound
    if (window.realmAudio) {
      window.realmAudio.playRavenCaw();
    }

    this.raven = {
      x: startX,
      y: startY,
      targetX: window.innerWidth + 200,
      targetY: -150,
      scale: 0.45,
      flapSpeed: 0.22,
      flapPhase: 0,
      trail: []
    };

    const startTime = performance.now();
    const flightDuration = 2400; // 2.4 seconds flight

    const animateFlight = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / flightDuration);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Bezier curve swoop: lifts up, sweeps diagonally across screen
      const p = progress;
      const cpX = startX - 80;
      const cpY = startY - 200;
      const endX = window.innerWidth + 200;
      const endY = -120;

      // Quadratic curve
      this.raven.x = (1 - p) * (1 - p) * startX + 2 * (1 - p) * p * cpX + p * p * endX;
      this.raven.y = (1 - p) * (1 - p) * startY + 2 * (1 - p) * p * cpY + p * p * endY;
      this.raven.scale = 0.45 + p * 0.45; // Raven gets closer then flies away
      this.raven.flapPhase += this.raven.flapSpeed;

      // Draw ink feather particles
      if (Math.random() > 0.4) {
        this.raven.trail.push({
          x: this.raven.x + (Math.random() - 0.5) * 20,
          y: this.raven.y + (Math.random() - 0.5) * 20,
          opacity: 0.7,
          size: Math.random() * 3 + 2
        });
      }

      // Draw & update feather trail
      this.raven.trail.forEach((dot, idx) => {
        dot.opacity -= 0.02;
        dot.y += 0.8;
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(18, 22, 30, ${Math.max(0, dot.opacity)})`;
        this.ctx.fill();
      });
      this.raven.trail = this.raven.trail.filter(d => d.opacity > 0);

      // Draw Silhouette Raven
      this.drawRavenFigure(this.raven.x, this.raven.y, this.raven.scale, this.raven.flapPhase);

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isFlying = false;
        if (typeof onComplete === 'function') onComplete();
      }
    };

    requestAnimationFrame(animateFlight);
  }

  drawRavenFigure(x, y, scale, flap) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);
    this.ctx.rotate(0.35); // Flying forward angle

    // Wing flap oscillation (-1 to 1)
    const wingY = Math.sin(flap) * 35;

    this.ctx.fillStyle = '#0a0d12';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowBlur = 12;

    // Body
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Head and Beak
    this.ctx.beginPath();
    this.ctx.arc(18, -4, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(23, -6);
    this.ctx.lineTo(34, -2);
    this.ctx.lineTo(23, 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Left Wing (Main)
    this.ctx.beginPath();
    this.ctx.moveTo(2, -4);
    this.ctx.quadraticCurveTo(-15, -45 + wingY, -35, -20 + wingY);
    this.ctx.quadraticCurveTo(-10, -5, 8, -4);
    this.ctx.fill();

    // Right Wing (Behind)
    this.ctx.beginPath();
    this.ctx.moveTo(-6, 2);
    this.ctx.quadraticCurveTo(-22, 40 - wingY, -42, 18 - wingY);
    this.ctx.quadraticCurveTo(-18, 5, 0, 2);
    this.ctx.fill();

    // Tail Feathers
    this.ctx.beginPath();
    this.ctx.moveTo(-20, -3);
    this.ctx.lineTo(-42, -8);
    this.ctx.lineTo(-38, 0);
    this.ctx.lineTo(-42, 8);
    this.ctx.lineTo(-20, 3);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }
}

window.ravenFlightEngine = new RavenFlightEngine();
