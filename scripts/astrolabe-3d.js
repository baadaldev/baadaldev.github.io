/**
 * =====================================================================
 * THE CITADEL 3D ASTROLABE & MECHANICAL KINGDOM (Three.js WebGL)
 * =====================================================================
 * Recreates the legendary Game of Thrones opening sequence:
 * - Multi-axis concentric golden astrolabe rings with carved gear teeth
 * - Central blazing sun sphere with coronal lens flares & audio-reactive pulses
 * - Rising mechanical citadel towers with rotating cogwheels
 * - Scroll-driven cinematic camera choreography & dragon fire heat transitions
 * - Dynamic orbiting dragon flame lights and Valyrian energy particles
 * - Audio-reactive synchronization with Web Audio API (war drums & cello beats)
 * - Automatic 2D canvas fallback for maximum compatibility
 */

class RealmAstrolabe3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rings = [];
    this.cogs = [];
    this.towers = [];
    this.citadelGroup = null;
    this.astrolabeGroup = null;
    this.sun = null;
    this.corona = null;
    this.coronaOuter = null;
    this.sunLight = null;
    this.dragonLight1 = null;
    this.dragonLight2 = null;
    this.materials = [];
    this.orbitParticles = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.isCinematicIntroRunning = false;
    this.hasEnteredRealm = true;

    // Camera initial & target states
    this.camPos = { x: 0, y: 1.2, z: 22 };
    this.camTargetLook = { x: 0, y: 0, z: 0 };

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn("Three.js not found, falling back to 2D Astrolabe Canvas.");
      this.init2DFallback();
      return;
    }

    try {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      // 1. Scene & Atmospheric Fog
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x08090d, 0.022);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
      this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.35;
      this.container.appendChild(this.renderer.domElement);

      // 4. Lights
      this.setupLighting();

      // 5. Build 3D Game of Thrones Astrolabe
      this.buildAstrolabe();

      // 6. Build Mechanical Unfolding Citadel
      this.buildMechanicalCitadel();

      // 7. Stellar / Dragonfire Orbit Dust
      this.buildOrbitalStellarDust();

      // 8. Event Listeners
      this.bindEvents();

      // 9. Animation Loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    } catch (e) {
      console.error("WebGL initialization failed, falling back to 2D:", e);
      this.init2DFallback();
    }
  }

  setupLighting() {
    // Ambient torchlight glow
    const ambientLight = new THREE.AmbientLight(0x403220, 0.9);
    this.scene.add(ambientLight);

    // Warm directional light (Sun rays)
    const dirLight1 = new THREE.DirectionalLight(0xffea9f, 2.0);
    dirLight1.position.set(16, 22, 16);
    this.scene.add(dirLight1);

    // Cool rim light (Valyrian steel moonlight)
    const dirLight2 = new THREE.DirectionalLight(0x6085a8, 1.2);
    dirLight2.position.set(-20, -12, -10);
    this.scene.add(dirLight2);

    // Central Sun Point Light
    this.sunLight = new THREE.PointLight(0xff8c00, 4.0, 50, 1.2);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    // Orbiting Dragon Fire Light 1 (Blazing Orange)
    this.dragonLight1 = new THREE.PointLight(0xff4500, 3.0, 35, 1.5);
    this.scene.add(this.dragonLight1);

    // Orbiting Dragon Fire Light 2 (Deep Gold / Crimson)
    this.dragonLight2 = new THREE.PointLight(0xffa500, 2.5, 30, 1.5);
    this.scene.add(this.dragonLight2);
  }

  buildAstrolabe() {
    this.astrolabeGroup = new THREE.Group();
    this.scene.add(this.astrolabeGroup);

    // Materials: Weathered 24k Gold & Ancient Bronze & Molten Core
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb448,
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x442c05,
      emissiveIntensity: 0.2
    });
    this.materials.push(goldMaterial);

    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0x9b6b2e,
      metalness: 0.82,
      roughness: 0.35,
      emissive: 0x331802,
      emissiveIntensity: 0.15
    });
    this.materials.push(bronzeMaterial);

    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a97a8,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x112233,
      emissiveIntensity: 0.1
    });
    this.materials.push(steelMaterial);

    const outerGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0c655,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x553505,
      emissiveIntensity: 0.25
    });
    this.materials.push(outerGoldMaterial);

    // 1. Central Burning Sun Core
    const sunGeom = new THREE.SphereGeometry(1.45, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd24d });
    this.sun = new THREE.Mesh(sunGeom, sunMat);
    this.astrolabeGroup.add(this.sun);

    // Sun Inner Coronal Ring
    const coronaGeom = new THREE.RingGeometry(1.65, 2.45, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    this.corona = new THREE.Mesh(coronaGeom, coronaMat);
    this.astrolabeGroup.add(this.corona);

    // Sun Outer Coronal Flare Ring
    const coronaOuterGeom = new THREE.RingGeometry(2.45, 3.4, 32);
    const coronaOuterMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    this.coronaOuter = new THREE.Mesh(coronaOuterGeom, coronaOuterMat);
    this.astrolabeGroup.add(this.coronaOuter);

    // 2. Concentric Astrolabe Gyro Bands (Outer to Inner)
    const ringConfigs = [
      { radius: 14.0, tube: 0.42, teethCount: 56, mat: outerGoldMaterial, axis: 'x', speed: 0.003 },
      { radius: 11.2, tube: 0.36, teethCount: 44, mat: goldMaterial, axis: 'y', speed: -0.0045 },
      { radius: 8.4, tube: 0.30, teethCount: 34, mat: bronzeMaterial, axis: 'z', speed: 0.0058 },
      { radius: 5.8, tube: 0.25, teethCount: 26, mat: steelMaterial, axis: 'xy', speed: -0.0072 },
      { radius: 3.8, tube: 0.20, teethCount: 18, mat: goldMaterial, axis: 'y', speed: 0.009 }
    ];

    ringConfigs.forEach((cfg, index) => {
      const ringGroup = new THREE.Group();

      // Main Torus Ring
      const torusGeom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 90);
      const ringMesh = new THREE.Mesh(torusGeom, cfg.mat);
      ringGroup.add(ringMesh);

      // Engraved Gear Teeth along the perimeter
      const toothGeom = new THREE.BoxGeometry(0.38, 0.6, 0.45);
      for (let i = 0; i < cfg.teethCount; i++) {
        const angle = (i / cfg.teethCount) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeom, cfg.mat);
        tooth.position.set(
          Math.cos(angle) * (cfg.radius + cfg.tube * 0.92),
          Math.sin(angle) * (cfg.radius + cfg.tube * 0.92),
          0
        );
        tooth.rotation.z = angle;
        ringGroup.add(tooth);
      }

      // Astrolabe Cross Bars / Dial Spiders
      if (index % 2 === 0) {
        const barGeom = new THREE.CylinderGeometry(0.08, 0.08, cfg.radius * 2, 8);
        const bar1 = new THREE.Mesh(barGeom, cfg.mat);
        const bar2 = new THREE.Mesh(barGeom, cfg.mat);
        bar2.rotation.z = Math.PI / 2;
        ringGroup.add(bar1);
        ringGroup.add(bar2);
      }

      this.astrolabeGroup.add(ringGroup);
      this.rings.push({ group: ringGroup, config: cfg });
    });
  }

  buildMechanicalCitadel() {
    this.citadelGroup = new THREE.Group();
    this.citadelGroup.position.set(0, -9.8, 0);
    this.scene.add(this.citadelGroup);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x242832,
      roughness: 0.7,
      metalness: 0.2
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb58934,
      roughness: 0.35,
      metalness: 0.8
    });

    // 1. Rotating Great Gear Platform
    const platformGeom = new THREE.CylinderGeometry(8.5, 9.0, 1.2, 32);
    const platform = new THREE.Mesh(platformGeom, stoneMat);
    this.citadelGroup.add(platform);

    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const cogTooth = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.2, 0.65), bronzeMat);
      cogTooth.position.set(Math.cos(angle) * 8.9, 0, Math.sin(angle) * 8.9);
      cogTooth.rotation.y = -angle;
      this.citadelGroup.add(cogTooth);
    }

    // 2. Rising Citadel Towers (King's Landing / Winterfell Keeps)
    this.towers = [];
    const towerPositions = [
      { x: 0, z: 0, height: 6.8, radius: 1.45, roofHeight: 2.6 },       // Central High Citadel Keep
      { x: -4.0, z: -2.2, height: 5.0, radius: 1.05, roofHeight: 1.9 }, // West Bastion
      { x: 4.0, z: -2.0, height: 5.4, radius: 1.15, roofHeight: 2.1 },  // East Watchtower
      { x: -2.8, z: 3.0, height: 4.0, radius: 0.95, roofHeight: 1.6 },  // South-West Gatehouse
      { x: 3.0, z: 2.8, height: 4.4, radius: 0.95, roofHeight: 1.7 }    // South-East Rampart
    ];

    towerPositions.forEach((pos) => {
      const towerGroup = new THREE.Group();
      towerGroup.position.set(pos.x, 0.6, pos.z);

      const towerGeom = new THREE.CylinderGeometry(pos.radius * 0.85, pos.radius, pos.height, 16);
      towerGeom.translate(0, pos.height / 2, 0);
      const towerMesh = new THREE.Mesh(towerGeom, stoneMat);
      towerGroup.add(towerMesh);

      const roofGeom = new THREE.ConeGeometry(pos.radius * 1.15, pos.roofHeight, 16);
      roofGeom.translate(0, pos.height + pos.roofHeight / 2, 0);
      const roofMesh = new THREE.Mesh(roofGeom, bronzeMat);
      towerGroup.add(roofMesh);

      this.citadelGroup.add(towerGroup);
      this.towers.push({ group: towerGroup, baseHeight: pos.height });
    });
  }

  buildOrbitalStellarDust() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 11.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.6;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      // Gold to fiery orange colors
      const isGold = Math.random() > 0.4;
      colors[i * 3] = isGold ? 1.0 : 1.0;     // R
      colors[i * 3 + 1] = isGold ? 0.78 : 0.35; // G
      colors[i * 3 + 2] = isGold ? 0.2 : 0.05;  // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.orbitParticles = new THREE.Points(geometry, material);
    this.astrolabeGroup.add(this.orbitParticles);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.renderer || !this.camera || !this.container) return;
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Smooth Scroll tracking
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.targetScrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    }, { passive: true });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const now = performance.now() * 0.001;

    // Smooth mouse & scroll interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Fetch Audio Metrics (if music playing)
    const audio = window.realmAudio ? window.realmAudio.getAudioMetrics() : { active: false, bass: 0, level: 0, isBeat: false };

    // 1. Rotate Concentric Astrolabe Rings
    // Speed increases with scroll and audio beat
    const speedMultiplier = 1.0 + this.scrollProgress * 2.2 + (audio.active ? audio.bass * 2.5 : 0);
    const beatKick = audio.isBeat ? 0.012 : 0;

    this.rings.forEach(ring => {
      const cfg = ring.config;
      const spd = (cfg.speed * speedMultiplier) + (cfg.speed > 0 ? beatKick : -beatKick);

      if (cfg.axis === 'x') ring.group.rotation.x += spd;
      else if (cfg.axis === 'y') ring.group.rotation.y += spd;
      else if (cfg.axis === 'z') ring.group.rotation.z += spd;
      else if (cfg.axis === 'xy') {
        ring.group.rotation.x += spd;
        ring.group.rotation.y += spd * 0.85;
      }
    });

    // 2. Rotate Orbital Stellar Dust
    if (this.orbitParticles) {
      this.orbitParticles.rotation.y += 0.002 * speedMultiplier;
      this.orbitParticles.rotation.z += 0.001 * speedMultiplier;
    }

    // 3. Central Sun & Coronal Flares (Audio & Scroll Reactive)
    if (this.sun && this.corona && this.coronaOuter) {
      const basePulse = Math.sin(now * 3.5) * 0.06;
      const audioPulse = audio.active ? audio.bass * 0.45 : 0;
      const scrollExpand = this.scrollProgress * 0.25;
      const currentScale = 1.0 + basePulse + audioPulse + scrollExpand;

      this.sun.scale.set(currentScale, currentScale, currentScale);
      this.corona.rotation.z += 0.007 * speedMultiplier;
      this.coronaOuter.rotation.z -= 0.005 * speedMultiplier;

      // Color shift when hot
      if (audio.active && audio.bass > 0.4) {
        this.corona.material.opacity = 0.85;
        this.coronaOuter.material.opacity = 0.55;
      } else {
        this.corona.material.opacity = 0.5 + this.scrollProgress * 0.3;
        this.coronaOuter.material.opacity = 0.25 + this.scrollProgress * 0.25;
      }
    }

    // 4. Dynamic Orbiting Dragon Flame Lights
    if (this.dragonLight1 && this.dragonLight2) {
      const orbitRadius1 = 12.5;
      const orbitRadius2 = 9.5;
      const lightSpeed = now * (0.8 + this.scrollProgress * 0.8 + (audio.active ? audio.level : 0));

      this.dragonLight1.position.set(
        Math.cos(lightSpeed) * orbitRadius1,
        Math.sin(lightSpeed * 1.5) * 4.5,
        Math.sin(lightSpeed) * orbitRadius1
      );

      this.dragonLight2.position.set(
        Math.cos(-lightSpeed * 1.2 + Math.PI) * orbitRadius2,
        Math.sin(-lightSpeed) * 3.5,
        Math.sin(-lightSpeed * 1.2 + Math.PI) * orbitRadius2
      );

      // Light Intensity Reactivity
      const lightAudioBoost = audio.active ? audio.bass * 3.5 : 0;
      this.dragonLight1.intensity = 2.8 + lightAudioBoost + this.scrollProgress * 2.0;
      this.dragonLight2.intensity = 2.2 + lightAudioBoost + this.scrollProgress * 1.5;
    }

    // Sun Core Light Intensity
    if (this.sunLight) {
      const sunAudioBoost = audio.active ? audio.bass * 6.0 : (Math.sin(now * 2) * 0.8);
      this.sunLight.intensity = 3.8 + sunAudioBoost + (this.scrollProgress * 3.5);
    }

    // 5. Materials Heat Transition (Dragonfire Incandescence)
    const heatGlow = 0.18 + (this.scrollProgress * 0.5) + (audio.active ? audio.bass * 0.45 : 0);
    this.materials.forEach(mat => {
      mat.emissiveIntensity = heatGlow;
      if (this.scrollProgress > 0.4 || (audio.active && audio.bass > 0.5)) {
        mat.emissive.setHex(0xff3c00); // Molten dragonfire red-orange
      } else {
        mat.emissive.setHex(0x442c05); // Antique golden glow
      }
    });

    // 6. Unfolding Citadel Towers & Rotating Platform
    if (this.citadelGroup) {
      this.citadelGroup.rotation.y += 0.0018 * speedMultiplier;
      
      // Towers rise smoothly as user scrolls down
      const towerRise = 0.85 + (this.scrollProgress * 0.35);
      this.towers.forEach(t => {
        t.group.scale.y = towerRise;
      });
    }

    // 7. Cinematic Camera Choreography Across Scroll Sections
    if (!this.isCinematicIntroRunning) {
      // Dynamic camera path based on scroll progression:
      // 0% - 25% (Hero): Regal front view
      // 25% - 55% (Projects): Dramatic low angle, looking up into rotating rings & citadel
      // 55% - 80% (About & Skills): Majestic 3D isometric angle
      // 80% - 100% (Roadmap & Citadel): Panoramic aerial looking through celestial rings
      let targetCamX = this.mouse.x * 2.2;
      let targetCamY = 1.2 + this.mouse.y * 1.8;
      let targetCamZ = 22;
      let targetLookY = 0;

      if (this.scrollProgress < 0.3) {
        const p = this.scrollProgress / 0.3;
        targetCamY = 1.2 - p * 3.0 + this.mouse.y * 1.8;
        targetCamZ = 22 - p * 4.0;
        targetLookY = -p * 2.0;
      } else if (this.scrollProgress < 0.7) {
        const p = (this.scrollProgress - 0.3) / 0.4;
        targetCamX = (this.mouse.x * 2.2) + p * 5.5;
        targetCamY = -1.8 + p * 4.0 + this.mouse.y * 1.8;
        targetCamZ = 18 - p * 1.5;
        targetLookY = -2.0 + p * 1.5;
      } else {
        const p = (this.scrollProgress - 0.7) / 0.3;
        targetCamX = 5.5 - p * 5.5 + this.mouse.x * 2.2;
        targetCamY = 2.2 + p * 3.5 + this.mouse.y * 1.8;
        targetCamZ = 16.5 + p * 5.0;
        targetLookY = -0.5 - p * 3.0;
      }

      this.camPos.x += (targetCamX - this.camPos.x) * 0.05;
      this.camPos.y += (targetCamY - this.camPos.y) * 0.05;
      this.camPos.z += (targetCamZ - this.camPos.z) * 0.05;
      this.camTargetLook.y += (targetLookY - this.camTargetLook.y) * 0.05;

      this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
      this.camera.lookAt(0, this.camTargetLook.y, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Fallback 2D Canvas Astrolabe
  init2DFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    this.container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let angle1 = 0, angle2 = 0, angle3 = 0;

    const render2D = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const drawRing = (r, angle, color, dash) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        if (dash) ctx.setLineDash(dash);
        ctx.stroke();

        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (r - 6), Math.sin(a) * (r - 6));
          ctx.lineTo(Math.cos(a) * (r + 6), Math.sin(a) * (r + 6));
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      };

      drawRing(190, angle1, '#dfb448', [14, 6]);
      drawRing(140, angle2, '#9b6b2e', null);
      drawRing(95, angle3, '#ffd700', [8, 4]);

      // Sun
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#ffaa00';
      ctx.shadowColor = '#ff5500';
      ctx.shadowBlur = 45;
      ctx.fill();

      angle1 += 0.005;
      angle2 -= 0.007;
      angle3 += 0.009;

      requestAnimationFrame(render2D);
    };

    render2D();
  }
}

window.RealmAstrolabe3D = RealmAstrolabe3D;
