// Đêm Hội Trung Thu 3D - Three.js Application
(function() {
  'use strict';

  // --- Quotes Collection ---
  const WISH_QUOTES = [
    "Trăng tròng trọc trăng soi bóng nước, chúc cậu bình an và sớm thuộc về tớ!",
    "Trung Thu này trăng tròn hay khuyết không quan trọng, quan trọng là khi nào mình thành một đôi?",
    "Hằng Nga chỉ ước có Cuội, còn ước nguyện đêm nay của tớ chỉ là có được câu trả lời từ cậu.",
    "Trung Thu ai cũng thèm phá cỗ, còn tớ thì chỉ thèm đổ vào lòng cậu.",
    "Bánh dẻo bánh nướng bánh bao, còn tớ thì chỉ muốn làm 'bánh cuốn' của cậu thôi.",
    "Đèn lồng thắp sáng trời thu, còn nụ cười của cậu thắp sáng cả bầu trời trong tim tớ.",
    "Trăng dưới nước là trăng trên trời, người trước mặt là người trong tim.",
    "Trung Thu năm nay thật đẹp vì có vầng trăng sáng và có cậu trong tâm trí tớ.",
    "Chúc cậu một mùa Trung Thu ngọt ngào như bánh dẻo, ấm áp như ánh đèn lồng.",
    "Ước nguyện gửi theo cánh đèn trời: Mong cậu luôn hạnh phúc, bình yên và rạng rỡ mỗi ngày."
  ];

  // --- Sound Effects using Web Audio API ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChimeSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [659.25, 783.99, 987.77, 1046.50, 1318.51];
      const note = notes[Math.floor(Math.random() * notes.length)];
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(note * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // --- Canvas Texture Generators ---
  function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 245, 180, 1)');
    grad.addColorStop(0.25, 'rgba(255, 190, 60, 0.7)');
    grad.addColorStop(0.55, 'rgba(255, 130, 20, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  function createPetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 210, 225, 0.85)');
    grad.addColorStop(0.8, 'rgba(255, 180, 200, 0.35)');
    grad.addColorStop(1, 'rgba(255, 180, 200, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  function createSparkleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 230, 150, 0.9)';
    ctx.beginPath();
    ctx.arc(32, 32, 10, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  // --- Three.js Setup ---
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0714, 0.016);

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4.2, 23);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 + 0.12;
  controls.minDistance = 6;
  controls.maxDistance = 42;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;
  controls.target.set(0, 1.8, 0);

  // Auto-rotate timeout management
  let idleTimer = null;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    if (idleTimer) clearTimeout(idleTimer);
  });
  controls.addEventListener('end', () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      controls.autoRotate = true;
    }, 2800);
  });

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0x35224d, 1.5);
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight(0xfff0d6, 0.8);
  moonLight.position.set(12, 24, 16);
  scene.add(moonLight);

  const treeCoreLight = new THREE.PointLight(0xffa533, 2.4, 24, 1.4);
  treeCoreLight.position.set(0, 3.5, 0);
  scene.add(treeCoreLight);

  // --- Shared Textures ---
  const glowTexture = createGlowTexture();
  const petalTexture = createPetalTexture();
  const sparkleTexture = createSparkleTexture();

  // --- Starfield Background ---
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1800;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const r = 90 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);

    const shade = 0.7 + Math.random() * 0.3;
    const tint = Math.random();
    if (tint > 0.8) {
      starColors[i * 3] = shade;
      starColors[i * 3 + 1] = shade * 0.9;
      starColors[i * 3 + 2] = shade * 0.7; // warm
    } else if (tint > 0.6) {
      starColors[i * 3] = shade * 0.8;
      starColors[i * 3 + 1] = shade * 0.9;
      starColors[i * 3 + 2] = shade; // cool cyan
    } else {
      starColors[i * 3] = shade;
      starColors[i * 3 + 1] = shade;
      starColors[i * 3 + 2] = shade; // white
    }
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // --- Floating Island ---
  const islandGroup = new THREE.Group();
  scene.add(islandGroup);

  // 1. Top Flat Plateau
  const topGeo = new THREE.CylinderGeometry(7.0, 6.7, 0.7, 32);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x1f192b,
    roughness: 0.85,
    metalness: 0.1,
    flatShading: true
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = 0;
  islandGroup.add(topMesh);

  // 2. Rocky Craggy Underside (Inverted Cone with Noise)
  const underGeo = new THREE.ConeGeometry(6.8, 8.5, 24, 8);
  underGeo.rotateX(Math.PI);
  const uPos = underGeo.attributes.position;
  for (let i = 0; i < uPos.count; i++) {
    const y = uPos.getY(i);
    if (y < 3.8) {
      uPos.setX(i, uPos.getX(i) + (Math.sin(i * 1.8) * 0.45));
      uPos.setZ(i, uPos.getZ(i) + (Math.cos(i * 2.2) * 0.45));
    }
  }
  underGeo.computeVertexNormals();

  const underMat = new THREE.MeshStandardMaterial({
    color: 0x171222,
    roughness: 0.95,
    metalness: 0.1,
    flatShading: true
  });
  const underMesh = new THREE.Mesh(underGeo, underMat);
  underMesh.position.y = -4.25;
  islandGroup.add(underMesh);

  // 3. Decorative Rocks on Island Edge
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x272036,
    roughness: 0.85,
    flatShading: true
  });
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const rad = 4.8 + Math.random() * 1.8;
    const rockGeo = new THREE.DodecahedronGeometry(0.28 + Math.random() * 0.35, 0);
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(Math.cos(angle) * rad, 0.42, Math.sin(angle) * rad);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    islandGroup.add(rock);
  }

  // --- Glowing Blossom Tree ---
  const treeGroup = new THREE.Group();
  islandGroup.add(treeGroup);

  // Trunk Materials
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x3d231e,
    roughness: 0.85,
    flatShading: true
  });

  // Main Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.48, 0.72, 3.2, 10);
  const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
  trunkMesh.position.set(0, 1.8, 0);
  trunkMesh.rotation.z = -0.06;
  treeGroup.add(trunkMesh);

  // Spreading Branches
  const branchDefs = [
    { start: [0, 2.6, 0], end: [-1.6, 4.0, 0.8], r: 0.28 },
    { start: [0, 2.7, 0], end: [1.7, 4.1, -0.6], r: 0.28 },
    { start: [0, 2.8, 0], end: [0.9, 4.3, 1.5], r: 0.26 },
    { start: [0, 2.9, 0], end: [-1.0, 4.2, -1.3], r: 0.25 },
    { start: [0, 3.1, 0], end: [0.1, 4.7, 0.1], r: 0.25 }
  ];

  branchDefs.forEach(b => {
    const p1 = new THREE.Vector3(...b.start);
    const p2 = new THREE.Vector3(...b.end);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const branchGeo = new THREE.CylinderGeometry(b.r * 0.55, b.r, len, 8);
    const branch = new THREE.Mesh(branchGeo, trunkMat);
    branch.position.copy(p1).add(dir.clone().multiplyScalar(0.5));
    branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    treeGroup.add(branch);
  });

  // Tree Blossom Canopy (Particles)
  const blossomCount = 8000;
  const blossomPositions = new Float32Array(blossomCount * 3);
  const blossomColors = new Float32Array(blossomCount * 3);
  const blossomOrigPos = [];

  const centerCanopy = new THREE.Vector3(0, 4.6, 0);
  const rx = 4.8, ry = 2.6, rz = 4.8;

  for (let i = 0; i < blossomCount; i++) {
    // Generate within ellipsoid with clustered density
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random());

    const px = centerCanopy.x + rx * r * Math.sin(phi) * Math.cos(theta);
    const py = centerCanopy.y + ry * r * Math.sin(phi) * Math.sin(theta) * 0.85;
    const pz = centerCanopy.z + rz * r * Math.cos(phi);

    blossomPositions[i * 3] = px;
    blossomPositions[i * 3 + 1] = py;
    blossomPositions[i * 3 + 2] = pz;

    blossomOrigPos.push({ x: px, y: py, z: pz });

    // Blossom palette (pink, rosy, peach, warm white)
    const colorChoice = Math.random();
    let rCol, gCol, bCol;
    if (colorChoice < 0.45) {
      // Soft blossom pink
      rCol = 1.0; gCol = 0.72; bCol = 0.82;
    } else if (colorChoice < 0.75) {
      // Vibrant cherry pink
      rCol = 1.0; gCol = 0.60; bCol = 0.75;
    } else if (colorChoice < 0.90) {
      // Warm white
      rCol = 1.0; gCol = 0.94; bCol = 0.96;
    } else {
      // Warm peach blush
      rCol = 1.0; gCol = 0.82; bCol = 0.75;
    }

    blossomColors[i * 3] = rCol;
    blossomColors[i * 3 + 1] = gCol;
    blossomColors[i * 3 + 2] = bCol;
  }

  const blossomGeo = new THREE.BufferGeometry();
  blossomGeo.setAttribute('position', new THREE.BufferAttribute(blossomPositions, 3));
  blossomGeo.setAttribute('color', new THREE.BufferAttribute(blossomColors, 3));

  const blossomMat = new THREE.PointsMaterial({
    size: 0.22,
    map: petalTexture,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.9
  });

  const blossomPoints = new THREE.Points(blossomGeo, blossomMat);
  treeGroup.add(blossomPoints);

  // Falling Petals
  const fallingCount = 140;
  const fallingGeo = new THREE.BufferGeometry();
  const fallingPos = new Float32Array(fallingCount * 3);
  const fallingData = [];

  for (let i = 0; i < fallingCount; i++) {
    const px = (Math.random() - 0.5) * 8.5;
    const py = 1.0 + Math.random() * 5.0;
    const pz = (Math.random() - 0.5) * 8.5;
    fallingPos[i * 3] = px;
    fallingPos[i * 3 + 1] = py;
    fallingPos[i * 3 + 2] = pz;
    fallingData.push({
      speedY: 0.01 + Math.random() * 0.015,
      swaySeed: Math.random() * 10,
      swaySpeed: 1.2 + Math.random() * 1.5
    });
  }
  fallingGeo.setAttribute('position', new THREE.BufferAttribute(fallingPos, 3));
  const fallingMat = new THREE.PointsMaterial({
    size: 0.16,
    map: petalTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xffadc4,
    opacity: 0.85
  });
  const fallingPoints = new THREE.Points(fallingGeo, fallingMat);
  islandGroup.add(fallingPoints);

  // --- Moon Rabbits (Thỏ Ngọc) ---
  const bunnyList = [];

  function createCuteBunny(colorHex, innerEarColorHex = 0xffa4b5) {
    const bunny = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.7,
      metalness: 0.05,
      flatShading: true
    });

    const innerMat = new THREE.MeshStandardMaterial({
      color: innerEarColorHex,
      roughness: 0.8,
      flatShading: true
    });

    // Body (egg shape)
    const bodyGeo = new THREE.SphereGeometry(0.36, 14, 14);
    bodyGeo.scale(1.0, 1.2, 0.95);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.38;
    bunny.add(bodyMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.position.set(0, 0.72, 0.12);
    bunny.add(headMesh);

    // Ears
    const earGroup = new THREE.Group();
    earGroup.position.set(0, 0.88, 0.08);

    const earGeo = new THREE.ConeGeometry(0.075, 0.42, 8);
    const earL = new THREE.Mesh(earGeo, bodyMat);
    earL.position.set(-0.11, 0.18, 0);
    earL.rotation.z = 0.18;
    earL.rotation.x = -0.15;
    earGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, bodyMat);
    earR.position.set(0.11, 0.18, 0);
    earR.rotation.z = -0.18;
    earR.rotation.x = -0.15;
    earGroup.add(earR);

    bunny.add(earGroup);

    // Tiny Tail
    const tailGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const tailMesh = new THREE.Mesh(tailGeo, bodyMat);
    tailMesh.position.set(0, 0.32, -0.34);
    bunny.add(tailMesh);

    // Tiny Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1b1424 });
    const eyeGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.09, 0.75, 0.32);
    bunny.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.09, 0.75, 0.32);
    bunny.add(eyeR);

    bunny.earGroup = earGroup;
    bunny.initialY = 0.36;
    bunny.hopTimer = Math.random() * 5;
    bunny.isHopping = false;

    return bunny;
  }

  // Add 3 Bunnies matching the video
  const b1 = createCuteBunny(0xf2e8ff); // White-lilac
  b1.position.set(1.4, 0.36, 1.8);
  b1.rotation.y = -Math.PI * 0.75;
  islandGroup.add(b1);
  bunnyList.push(b1);

  const b2 = createCuteBunny(0xb58de6); // Lilac purple
  b2.position.set(-1.6, 0.36, 1.5);
  b2.rotation.y = Math.PI * 0.45;
  islandGroup.add(b2);
  bunnyList.push(b2);

  const b3 = createCuteBunny(0xd2b3f3); // Soft violet
  b3.position.set(-0.5, 0.36, 2.5);
  b3.rotation.y = 0.1;
  islandGroup.add(b3);
  bunnyList.push(b3);

  // --- Floating Sky Lanterns (Lồng Đèn Trời) ---
  const lanterns = [];
  const lanternMeshes = [];
  const lanternGroup = new THREE.Group();
  scene.add(lanternGroup);

  const lanternPaperMat = new THREE.MeshStandardMaterial({
    color: 0xffd24d,
    emissive: 0xff9900,
    emissiveIntensity: 1.4,
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.94
  });

  const trimMat = new THREE.MeshBasicMaterial({ color: 0xba2d2d });

  function createSkyLantern(wishText = null, recipient = "Gửi cậu") {
    const lantern = new THREE.Group();

    // 1. Tapered Cylinder Paper Shade
    const bodyGeo = new THREE.CylinderGeometry(0.56, 0.42, 1.15, 18, 1, false);
    const bodyMesh = new THREE.Mesh(bodyGeo, lanternPaperMat.clone());
    lantern.add(bodyMesh);

    // 2. Base Ring
    const baseGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.08, 18);
    const baseMesh = new THREE.Mesh(baseGeo, trimMat);
    baseMesh.position.y = -0.58;
    lantern.add(baseMesh);

    // 3. Hanging Red Tassel
    const cordGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
    const cordMesh = new THREE.Mesh(cordGeo, trimMat);
    cordMesh.position.y = -0.86;
    lantern.add(cordMesh);

    const tasselGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.32, 8);
    const tasselMesh = new THREE.Mesh(tasselGeo, trimMat);
    tasselMesh.position.y = -1.18;
    lantern.add(tasselMesh);

    // 4. Glowing Halo Sprite
    const haloMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffab19,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(3.4, 3.4, 1.0);
    lantern.add(halo);

    // User metadata
    lantern.bodyMesh = bodyMesh;
    lantern.halo = halo;
    lantern.customWish = wishText;
    lantern.recipient = recipient;
    lantern.quoteIndex = Math.floor(Math.random() * WISH_QUOTES.length);

    // Movement attributes
    lantern.speedY = 0.016 + Math.random() * 0.022;
    lantern.seed = Math.random() * 100;
    lantern.swayRadius = 0.01 + Math.random() * 0.012;
    lantern.swaySpeed = 0.8 + Math.random() * 0.6;
    lantern.targetScale = 1.0;
    lantern.currentScale = 1.0;

    // Hit test target
    bodyMesh.parentLantern = lantern;
    lanternMeshes.push(bodyMesh);

    return lantern;
  }

  // Populate initial 24 lanterns
  const LANTERN_COUNT = 24;
  for (let i = 0; i < LANTERN_COUNT; i++) {
    const l = createSkyLantern();
    const rad = 5.2 + Math.random() * 15.0;
    const angle = (i / LANTERN_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const y = -14.0 + (i / LANTERN_COUNT) * 36.0;

    l.position.set(Math.cos(angle) * rad, y, Math.sin(angle) * rad);
    l.initialRadius = rad;
    l.initialAngle = angle;
    lanternGroup.add(l);
    lanterns.push(l);
  }

  // --- Particle Bursts (Sparkles on Click) ---
  const burstParticles = [];
  function createSparkleBurst(pos) {
    const count = 35;
    const geo = new THREE.BufferGeometry();
    const pArr = new Float32Array(count * 3);
    const velArr = [];

    for (let i = 0; i < count; i++) {
      pArr[i * 3] = pos.x;
      pArr[i * 3 + 1] = pos.y;
      pArr[i * 3 + 2] = pos.z;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.12;
      velArr.push({
        vx: Math.cos(angle) * speed,
        vy: (Math.random() - 0.2) * speed * 1.5,
        vz: Math.sin(angle) * speed,
        alpha: 1.0
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.35,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffe27a,
      opacity: 1.0
    });

    const pSystem = new THREE.Points(geo, mat);
    scene.add(pSystem);
    burstParticles.push({ system: pSystem, vels: velArr, geo, mat, life: 1.0 });
  }

  // --- Raycasting for Lantern Hover & Click ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-100, -100);
  let hoveredLantern = null;
  let isDragging = false;
  let pointerDownPos = { x: 0, y: 0 };

  window.addEventListener('pointerdown', (e) => {
    isDragging = false;
    pointerDownPos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('pointermove', (e) => {
    const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    if (dist > 6) isDragging = true;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('pointerup', (e) => {
    // Attempt audio playback on first interaction
    tryPlayAudio();

    if (isDragging) return;
    if (e.target.closest('.modal-backdrop') || e.target.closest('.top-controls') || e.target.closest('.make-wish-btn')) {
      return;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(lanternMeshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const clickedLantern = clickedMesh.parentLantern;
      if (clickedLantern) {
        onLanternClicked(clickedLantern);
      }
    }
  });

  // Lantern Click Handler
  function onLanternClicked(lantern) {
    playChimeSound();
    createSparkleBurst(lantern.position);

    // Pulse animation on lantern
    lantern.currentScale = 1.35;

    // Get wish quote
    const quoteText = lantern.customWish || WISH_QUOTES[lantern.quoteIndex % WISH_QUOTES.length];
    const recipient = lantern.recipient || "Gửi cậu";

    openWishModal(recipient, quoteText);
  }

  // --- Modal Logic ---
  const wishModal = document.getElementById('wish-modal');
  const modalRecipient = document.getElementById('modal-recipient');
  const modalQuote = document.getElementById('modal-quote');
  const closeWishModalBtn = document.getElementById('close-wish-modal');

  const customWishModal = document.getElementById('custom-wish-modal');
  const openCustomModalBtn = document.getElementById('open-custom-modal');
  const closeCustomModalBtn = document.getElementById('close-custom-modal');
  const customWishForm = document.getElementById('custom-wish-form');
  const customNameInput = document.getElementById('custom-name');
  const customTextInput = document.getElementById('custom-text');

  function openWishModal(recipient, quote) {
    modalRecipient.textContent = recipient;
    modalQuote.textContent = `"${quote}"`;
    wishModal.classList.add('show');
  }

  function closeWishModal() {
    wishModal.classList.remove('show');
  }

  closeWishModalBtn.addEventListener('click', closeWishModal);
  wishModal.addEventListener('click', (e) => {
    if (e.target === wishModal) closeWishModal();
  });

  // Custom Wish Modal
  openCustomModalBtn.addEventListener('click', () => {
    tryPlayAudio();
    customWishModal.classList.add('show');
  });

  function closeCustomModal() {
    customWishModal.classList.remove('show');
  }

  closeCustomModalBtn.addEventListener('click', closeCustomModal);
  customWishModal.addEventListener('click', (e) => {
    if (e.target === customWishModal) closeCustomModal();
  });

  customWishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const recipient = customNameInput.value.trim() || "Gửi cậu";
    const wish = customTextInput.value.trim() || "Chúc cậu mùa Trung Thu ấm áp, ngập tràn niềm vui!";

    // Spawn personalized lantern right in front of camera
    const userLantern = createSkyLantern(wish, recipient);
    
    // Position 12 units in front of camera
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const spawnPos = camera.position.clone().add(fwd.multiplyScalar(9.0));
    spawnPos.y -= 1.5;

    userLantern.position.copy(spawnPos);
    userLantern.speedY = 0.028;
    lanternGroup.add(userLantern);
    lanterns.push(userLantern);

    playChimeSound();
    createSparkleBurst(spawnPos);

    closeCustomModal();
    customWishForm.reset();

    // Show popup immediately for preview
    setTimeout(() => {
      openWishModal(recipient, wish);
    }, 400);
  });

  // --- Audio Control ---
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  let isMusicPlaying = false;

  function toggleMusic() {
    getAudioContext();
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicBtn.classList.add('active');
      }).catch(err => {
        console.warn("Audio autoplay prevented:", err);
      });
    } else {
      bgMusic.pause();
      isMusicPlaying = false;
      musicBtn.classList.remove('active');
    }
  }

  function tryPlayAudio() {
    getAudioContext();
    if (bgMusic.paused && !isMusicPlaying) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicBtn.classList.add('active');
      }).catch(() => {
        // Ignored if user hasn't engaged yet
      });
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  // --- Fullscreen Control ---
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  fullscreenBtn.addEventListener('click', () => {
    tryPlayAudio();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen error:", err);
      });
      fullscreenBtn.classList.add('active');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        fullscreenBtn.classList.remove('active');
      }
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenBtn.classList.add('active');
    } else {
      fullscreenBtn.classList.remove('active');
    }
  });

  // --- Window Resize ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // --- Main Animation Loop ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const delta = clock.getDelta();

    // 1. Controls update
    controls.update();

    // 2. Island gentle idle bobbing
    islandGroup.position.y = Math.sin(elapsedTime * 0.75) * 0.28;
    islandGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.015;

    // 3. Blossom tree subtle canopy wave
    const bPos = blossomGeo.attributes.position;
    for (let i = 0; i < blossomCount; i += 4) {
      const orig = blossomOrigPos[i];
      const wave = Math.sin(elapsedTime * 1.5 + orig.x * 0.8) * 0.035;
      bPos.setY(i, orig.y + wave);
    }
    blossomGeo.attributes.position.needsUpdate = true;

    // 4. Falling petals
    const fPos = fallingGeo.attributes.position;
    for (let i = 0; i < fallingCount; i++) {
      let py = fPos.getY(i) - fallingData[i].speedY;
      let px = fPos.getX(i) + Math.sin(elapsedTime * fallingData[i].swaySpeed + fallingData[i].swaySeed) * 0.006;
      if (py < -3.5) {
        py = 5.2 + Math.random() * 2.0;
        px = (Math.random() - 0.5) * 8.0;
        fPos.setZ(i, (Math.random() - 0.5) * 8.0);
      }
      fPos.setY(i, py);
      fPos.setX(i, px);
    }
    fallingGeo.attributes.position.needsUpdate = true;

    // 5. Cute Bunnies Animation
    bunnyList.forEach((bunny, idx) => {
      // Gentle breathing
      const breath = 1.0 + Math.sin(elapsedTime * 2.8 + idx * 1.5) * 0.025;
      bunny.scale.set(breath, breath, breath);

      // Ear twitches
      if (bunny.earGroup) {
        bunny.earGroup.rotation.z = Math.sin(elapsedTime * 3.5 + idx) * 0.06;
      }

      // Little hops
      bunny.hopTimer -= 0.016;
      if (bunny.hopTimer <= 0) {
        bunny.isHopping = true;
        bunny.hopProgress = 0;
        bunny.hopTimer = 3.5 + Math.random() * 4.5;
      }
      if (bunny.isHopping) {
        bunny.hopProgress += 0.06;
        const hopY = Math.sin(bunny.hopProgress * Math.PI) * 0.28;
        bunny.position.y = bunny.initialY + Math.max(0, hopY);
        if (bunny.hopProgress >= 1.0) {
          bunny.isHopping = false;
          bunny.position.y = bunny.initialY;
        }
      }
    });

    // 6. Sky Lanterns Floating & Physics
    lanterns.forEach(l => {
      l.position.y += l.speedY;
      l.position.x += Math.sin(elapsedTime * l.swaySpeed + l.seed) * l.swayRadius;
      l.position.z += Math.cos(elapsedTime * l.swaySpeed + l.seed) * l.swayRadius;
      l.rotation.z = Math.sin(elapsedTime * 0.9 + l.seed) * 0.06;
      l.rotation.x = Math.cos(elapsedTime * 0.9 + l.seed) * 0.05;

      // Recycle lantern when floating too high
      if (l.position.y > 22.0) {
        l.position.y = -16.0;
        const rad = 5.0 + Math.random() * 15.0;
        const ang = Math.random() * Math.PI * 2;
        l.position.x = Math.cos(ang) * rad;
        l.position.z = Math.sin(ang) * rad;
      }

      // Smooth scale interpolation for hover/click
      l.currentScale += (l.targetScale - l.currentScale) * 0.1;
      l.scale.set(l.currentScale, l.currentScale, l.currentScale);
    });

    // 7. Raycast Hover Check
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(lanternMeshes);

    if (intersects.length > 0) {
      const hitLantern = intersects[0].object.parentLantern;
      if (hoveredLantern !== hitLantern) {
        if (hoveredLantern) {
          hoveredLantern.targetScale = 1.0;
          hoveredLantern.halo.material.opacity = 0.85;
        }
        hoveredLantern = hitLantern;
        if (hoveredLantern) {
          hoveredLantern.targetScale = 1.22;
          hoveredLantern.halo.material.opacity = 1.0;
        }
      }
      document.body.style.cursor = 'pointer';
    } else {
      if (hoveredLantern) {
        hoveredLantern.targetScale = 1.0;
        hoveredLantern.halo.material.opacity = 0.85;
        hoveredLantern = null;
      }
      document.body.style.cursor = 'default';
    }

    // 8. Sparkle Particles Update
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const b = burstParticles[i];
      b.life -= 0.024;
      const posAttr = b.geo.attributes.position;
      for (let j = 0; j < b.vels.length; j++) {
        const v = b.vels[j];
        posAttr.setX(j, posAttr.getX(j) + v.vx);
        posAttr.setY(j, posAttr.getY(j) + v.vy);
        posAttr.setZ(j, posAttr.getZ(j) + v.vz);
        v.vy -= 0.0018; // gravity
      }
      posAttr.needsUpdate = true;
      b.mat.opacity = Math.max(0, b.life);

      if (b.life <= 0) {
        scene.remove(b.system);
        b.geo.dispose();
        b.mat.dispose();
        burstParticles.splice(i, 1);
      }
    }

    // 9. Slow Starfield rotation
    starField.rotation.y = elapsedTime * 0.012;

    renderer.render(scene, camera);
  }

  animate();

})();
