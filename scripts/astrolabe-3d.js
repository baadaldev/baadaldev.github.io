/**
 * =====================================================================
 * THE CITADEL 3D ASTROLABE & MECHANICAL KINGDOM (Three.js WebGL)
 * =====================================================================
 * Recreates the legendary Game of Thrones opening sequence:
 * - Multi-axis concentric golden astrolabe rings with carved gear teeth
 * - Central blazing sun sphere with coronal lens flares
 * - Rising mechanical citadel towers with rotating cogwheels
 * - Cinematic fly-through camera transition on "Enter Realm"
 * - Interactive mouse tilt & scroll parallax
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
    this.citadelGroup = null;
    this.sun = null;
    this.sunLight = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.isCinematicIntroRunning = false;
    this.hasEnteredRealm = false;

    // Camera initial & target states
    this.camPos = { x: 0, y: 0, z: 28 };
    this.targetCamPos = { x: 0, y: 0, z: 28 };
    this.camRot = { x: 0, y: 0, z: 0 };

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

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0a0c10, 0.022);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
      this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;
      this.container.appendChild(this.renderer.domElement);

      // 4. Lights
      this.setupLighting();

      // 5. Build 3D Game of Thrones Astrolabe
      this.buildAstrolabe();

      // 6. Build Mechanical Unfolding Citadel
      this.buildMechanicalCitadel();

      // 7. Event Listeners
      this.bindEvents();

      // 8. Animation Loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    } catch (e) {
      console.error("WebGL initialization failed, falling back to 2D:", e);
      this.init2DFallback();
    }
  }

  setupLighting() {
    // Ambient torchlight glow
    const ambientLight = new THREE.AmbientLight(0x3d3020, 0.8);
    this.scene.add(ambientLight);

    // Warm directional light (Sun rays)
    const dirLight1 = new THREE.DirectionalLight(0xffe8a0, 1.8);
    dirLight1.position.set(15, 20, 15);
    this.scene.add(dirLight1);

    // Cool rim light (Valyrian steel moonlight)
    const dirLight2 = new THREE.DirectionalLight(0x7090b0, 1.0);
    dirLight2.position.set(-20, -10, -10);
    this.scene.add(dirLight2);

    // Point Light at Central Sun Core
    this.sunLight = new THREE.PointLight(0xff9900, 3.5, 45, 1.2);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);
  }

  buildAstrolabe() {
    this.astrolabeGroup = new THREE.Group();
    this.scene.add(this.astrolabeGroup);

    // Materials: Weathered 24k Gold & Ancient Bronze
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb448,
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x442c05,
      emissiveIntensity: 0.15
    });

    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0x9b6b2e,
      metalness: 0.82,
      roughness: 0.35
    });

    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a97a8,
      metalness: 0.92,
      roughness: 0.22
    });

    // 1. Central Burning Sun Core
    const sunGeom = new THREE.SphereGeometry(1.4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd24d });
    this.sun = new THREE.Mesh(sunGeom, sunMat);
    this.astrolabeGroup.add(this.sun);

    // Sun Coronal Ring
    const coronaGeom = new THREE.RingGeometry(1.6, 2.3, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff8c00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    this.corona = new THREE.Mesh(coronaGeom, coronaMat);
    this.astrolabeGroup.add(this.corona);

    // 2. Concentric Astrolabe Bands (Outer, Middle, Inner)
    const ringConfigs = [
      { radius: 12.0, tube: 0.38, teethCount: 48, mat: goldMaterial, axis: 'x', speed: 0.0035 },
      { radius: 9.2, tube: 0.32, teethCount: 36, mat: bronzeMaterial, axis: 'y', speed: -0.0048 },
      { radius: 6.6, tube: 0.26, teethCount: 28, mat: steelMaterial, axis: 'z', speed: 0.0062 },
      { radius: 4.2, tube: 0.22, teethCount: 20, mat: goldMaterial, axis: 'xy', speed: -0.0075 }
    ];

    ringConfigs.forEach((cfg, index) => {
      const ringGroup = new THREE.Group();

      // Main Torus Ring
      const torusGeom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 80);
      const ringMesh = new THREE.Mesh(torusGeom, cfg.mat);
      ringGroup.add(ringMesh);

      // Engraved Gear Teeth along the edge
      const toothGeom = new THREE.BoxGeometry(0.35, 0.55, 0.45);
      for (let i = 0; i < cfg.teethCount; i++) {
        const angle = (i / cfg.teethCount) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeom, cfg.mat);
        tooth.position.set(
          Math.cos(angle) * (cfg.radius + cfg.tube * 0.9),
          Math.sin(angle) * (cfg.radius + cfg.tube * 0.9),
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
    // Position below the main astrolabe
    this.citadelGroup.position.set(0, -9.5, 0);
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

    // 1. Great Mechanical Base Platform (Rotating Gear Platform)
    const platformGeom = new THREE.CylinderGeometry(8, 8.5, 1.2, 32);
    const platform = new THREE.Mesh(platformGeom, stoneMat);
    this.citadelGroup.add(platform);

    // Platform gear teeth
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const cogTooth = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.6), bronzeMat);
      cogTooth.position.set(Math.cos(angle) * 8.4, 0, Math.sin(angle) * 8.4);
      cogTooth.rotation.y = -angle;
      this.citadelGroup.add(cogTooth);
    }

    // 2. Rising Citadel Towers (King's Landing / Winterfell Keeps)
    this.towers = [];
    const towerPositions = [
      { x: 0, z: 0, height: 6.5, radius: 1.4, roofHeight: 2.5 },      // Central High Citadel Keep
      { x: -3.8, z: -2.0, height: 4.8, radius: 1.0, roofHeight: 1.8 }, // West Bastion
      { x: 3.8, z: -1.8, height: 5.2, radius: 1.1, roofHeight: 2.0 },  // East Watchtower
      { x: -2.5, z: 2.8, height: 3.8, radius: 0.9, roofHeight: 1.5 },  // South-West Gatehouse
      { x: 2.8, z: 2.6, height: 4.2, radius: 0.9, roofHeight: 1.6 }   // South-East Rampart
    ];

    towerPositions.forEach((pos, idx) => {
      const towerGroup = new THREE.Group();
      towerGroup.position.set(pos.x, 0.6, pos.z);

      // Tower Cylinder
      const towerGeom = new THREE.CylinderGeometry(pos.radius * 0.85, pos.radius, pos.height, 16);
      towerGeom.translate(0, pos.height / 2, 0);
      const towerMesh = new THREE.Mesh(towerGeom, stoneMat);
      towerGroup.add(towerMesh);

      // Conical Roof
      const roofGeom = new THREE.ConeGeometry(pos.radius * 1.15, pos.roofHeight, 16);
      roofGeom.translate(0, pos.height + pos.roofHeight / 2, 0);
      const roofMesh = new THREE.Mesh(roofGeom, bronzeMat);
      towerGroup.add(roofMesh);

      // Battlement teeth
      const battlementCount = 8;
      for (let b = 0; b < battlementCount; b++) {
        const bAngle = (b / battlementCount) * Math.PI * 2;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.25), stoneMat);
        tooth.position.set(
          Math.cos(bAngle) * (pos.radius * 0.95),
          pos.height + 0.2,
          Math.sin(bAngle) * (pos.radius * 0.95)
        );
        towerGroup.add(tooth);
      }

      this.citadelGroup.add(towerGroup);
      this.towers.push({ group: towerGroup, targetScaleY: 1, baseHeight: pos.height });
    });

    // 3. Small Interlocking Cogs
    const cogConfigs = [
      { x: -4.5, y: 0.6, z: 3.5, r: 1.4, speed: 0.015 },
      { x: 4.8, y: 0.6, z: -3.5, r: 1.6, speed: -0.012 },
      { x: 0, y: 0.6, z: -4.8, r: 1.8, speed: 0.01 }
    ];

    cogConfigs.forEach(cfg => {
      const cogGroup = new THREE.Group();
      cogGroup.position.set(cfg.x, cfg.y, cfg.z);

      const cogDisc = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r, cfg.r, 0.25, 24), bronzeMat);
      cogGroup.add(cogDisc);

      const teeth = 12;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.35), bronzeMat);
        tooth.position.set(Math.cos(a) * (cfg.r + 0.15), 0, Math.sin(a) * (cfg.r + 0.15));
        tooth.rotation.y = -a;
        cogGroup.add(tooth);
      }

      this.citadelGroup.add(cogGroup);
      this.cogs.push({ group: cogGroup, speed: cfg.speed });
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    // Mouse movement for 3D parallax tilt
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll tracking
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    });
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Cinematic Fly-Through on Intro Click
  triggerCinematicIntro(onComplete) {
    if (this.isCinematicIntroRunning) return;
    this.isCinematicIntroRunning = true;

    // Start wide, plunge through rings, settle on hero citadel position
    const startTime = performance.now();
    const duration = 2800; // 2.8 seconds dramatic dive

    const initialZ = 34;
    const targetZ = 19;
    const initialY = 5;
    const targetY = 1.2;

    const animateDive = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth cinematic easeInOutCubic curve
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camPos.z = initialZ - (initialZ - targetZ) * ease;
      this.camPos.y = initialY - (initialY - targetY) * ease;

      // Sun flare swells during dive
      if (this.sunLight) {
        this.sunLight.intensity = 3.5 + Math.sin(progress * Math.PI) * 4.0;
      }

      // Astrolabe spins faster during plunge
      if (this.astrolabeGroup) {
        this.astrolabeGroup.rotation.y += 0.015 * (1 - ease);
        this.astrolabeGroup.rotation.z += 0.008 * (1 - ease);
      }

      if (progress < 1) {
        requestAnimationFrame(animateDive);
      } else {
        this.isCinematicIntroRunning = false;
        this.hasEnteredRealm = true;
        if (typeof onComplete === 'function') onComplete();
      }
    };

    requestAnimationFrame(animateDive);
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Rotate concentric astrolabe rings
    this.rings.forEach(ring => {
      const cfg = ring.config;
      if (cfg.axis === 'x') ring.group.rotation.x += cfg.speed;
      else if (cfg.axis === 'y') ring.group.rotation.y += cfg.speed;
      else if (cfg.axis === 'z') ring.group.rotation.z += cfg.speed;
      else if (cfg.axis === 'xy') {
        ring.group.rotation.x += cfg.speed;
        ring.group.rotation.y += cfg.speed * 0.8;
      }
    });

    // Sun pulsing light
    const time = performance.now() * 0.002;
    if (this.sun && this.corona) {
      const scale = 1 + Math.sin(time * 3) * 0.06;
      this.sun.scale.set(scale, scale, scale);
      this.corona.rotation.z += 0.008;
    }

    // Rotate mechanical cogs
    this.cogs.forEach(cog => {
      cog.group.rotation.y += cog.speed;
    });

    if (this.citadelGroup) {
      this.citadelGroup.rotation.y += 0.0015;
    }

    // Camera positioning with mouse tilt & scroll parallax
    if (!this.isCinematicIntroRunning) {
      const scrollOffset = this.scrollProgress * 15;
      const targetX = this.mouse.x * 2.2;
      const targetY = (this.hasEnteredRealm ? 1.2 : 0) + this.mouse.y * 1.8 - scrollOffset * 0.5;
      const targetZ = (this.hasEnteredRealm ? 21 : 28) + scrollOffset * 0.6;

      this.camPos.x += (targetX - this.camPos.x) * 0.04;
      this.camPos.y += (targetY - this.camPos.y) * 0.04;
      this.camPos.z += (targetZ - this.camPos.z) * 0.04;

      this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
      this.camera.lookAt(0, (this.hasEnteredRealm ? -1.5 : 0) - scrollOffset * 0.4, 0);
    } else {
      this.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z);
      this.camera.lookAt(0, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Fallback 2D Canvas Astrolabe in case WebGL is unavailable
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

      // Draw Rings
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

        // Gear notches
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

      drawRing(180, angle1, '#d4af37', [12, 6]);
      drawRing(130, angle2, '#b8860b', null);
      drawRing(85, angle3, '#ffd700', [6, 4]);

      // Sun
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.fillStyle = '#ffaa00';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 40;
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
