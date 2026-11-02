/**
 * OmniWall 3D - Three.js WebGL Interactive 3D Pegboard Viewer
 * High-performance 3D visualizer showing procedural modular tiles,
 * corner connector brackets, realistic lighting, and 3D tool models.
 */

class Viewer3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.tilesGroup = null;
    this.accessoriesGroup = null;
    this.bracketGroup = null;
    this.animationId = null;

    // Materials cache
    this.materials = {};

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1520);

    // 2. Camera
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, -30, 95);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 1.7;
      this.controls.minDistance = 20;
      this.controls.maxDistance = 200;
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Object Groups
    this.tilesGroup = new THREE.Group();
    this.accessoriesGroup = new THREE.Group();
    this.bracketGroup = new THREE.Group();
    this.scene.add(this.tilesGroup);
    this.scene.add(this.accessoriesGroup);
    this.scene.add(this.bracketGroup);

    // 7. Add studio wall backplate
    this.createStudioEnvironment();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());

    // 9. Start loop
    this.animate();
  }

  setupLighting() {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    // Key directional light (casting soft shadows like workshop overhead light)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.1);
    keyLight.position.set(25, 45, 60);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 180;
    keyLight.shadow.camera.left = -60;
    keyLight.shadow.camera.right = 60;
    keyLight.shadow.camera.top = 60;
    keyLight.shadow.camera.bottom = -60;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Cool fill light from left
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.45);
    fillLight.position.set(-40, 20, 30);
    this.scene.add(fillLight);

    // Warm rim light from bottom
    const rimLight = new THREE.PointLight(0xf97316, 0.6, 120);
    rimLight.position.set(0, -50, 20);
    this.scene.add(rimLight);
  }

  createStudioEnvironment() {
    // Subtle backdrop wall
    const wallGeo = new THREE.PlaneGeometry(300, 220);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x18202c,
      roughness: 0.95,
      metalness: 0.05
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 0, -3);
    wallMesh.receiveShadow = true;
    this.scene.add(wallMesh);
  }

  getPanelMaterial(colorHex, materialType) {
    let roughness = 0.72;
    let metalness = 0.08;

    if (materialType === 'cf_petg') {
      roughness = 0.88;
      metalness = 0.15;
    } else if (materialType === 'petg') {
      roughness = 0.55;
      metalness = 0.05;
    } else if (materialType === 'abs') {
      roughness = 0.65;
      metalness = 0.04;
    }

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: roughness,
      metalness: metalness,
    });
  }

  getAccessoryMaterial(colorHex, isMetal = false) {
    if (isMetal) {
      return new THREE.MeshStandardMaterial({
        color: 0xc8d0db,
        roughness: 0.28,
        metalness: 0.85
      });
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.68,
      metalness: 0.08
    });
  }

  updateBoard(state) {
    // Clear old geometry
    while (this.tilesGroup.children.length > 0) {
      this.tilesGroup.remove(this.tilesGroup.children[0]);
    }
    while (this.bracketGroup.children.length > 0) {
      this.bracketGroup.remove(this.bracketGroup.children[0]);
    }

    const { cols, rows, activeTiles, panelColor, accessoryColor, material } = state;
    const tileW = 16; // 3D units per modular tile
    const tileH = 16;
    const tileDepth = 1.2;

    const totalWidth = cols * tileW;
    const totalHeight = rows * tileH;
    const startX = -totalWidth / 2 + tileW / 2;
    const startY = totalHeight / 2 - tileH / 2;

    const tileMaterial = this.getPanelMaterial(panelColor, material);
    const bracketMaterial = new THREE.MeshStandardMaterial({
      color: 0x111620,
      roughness: 0.85,
      metalness: 0.2
    });
    const screwMaterial = this.getAccessoryMaterial('#ffffff', true);

    // Texture for pegboard pill slots
    const slotTexture = this.generateSlotTexture();
    const slottedTileMat = tileMaterial.clone();
    slottedTileMat.map = slotTexture;
    slottedTileMat.needsUpdate = true;

    // Create active tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r}_${c}`;
        if (activeTiles && activeTiles[key] === false) continue;

        const posX = startX + c * tileW;
        const posY = startY - r * tileH;

        // Tile body
        const tileGeo = new THREE.BoxGeometry(tileW - 0.2, tileH - 0.2, tileDepth);
        const tileMesh = new THREE.Mesh(tileGeo, slottedTileMat);
        tileMesh.position.set(posX, posY, 0);
        tileMesh.castShadow = true;
        tileMesh.receiveShadow = true;
        this.tilesGroup.add(tileMesh);

        // Tile bevel border
        const borderGeo = new THREE.BoxGeometry(tileW, tileH, 0.4);
        const borderMesh = new THREE.Mesh(borderGeo, bracketMaterial);
        borderMesh.position.set(posX, posY, -0.4);
        this.tilesGroup.add(borderMesh);
      }
    }

    // Add modular corner connectors & brackets (as in the real photo)
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const posX = startX + c * tileW - tileW / 2;
        const posY = startY - r * tileH + tileH / 2;

        // Check if at least one adjacent tile is active
        const hasAdjacent = [
          activeTiles?.[`${r-1}_${c-1}`] !== false && (r > 0 && c > 0),
          activeTiles?.[`${r-1}_${c}`] !== false && (r > 0 && c < cols),
          activeTiles?.[`${r}_${c-1}`] !== false && (r < rows && c > 0),
          activeTiles?.[`${r}_${c}`] !== false && (r < rows && c < cols),
        ].some(Boolean);

        if (!hasAdjacent) continue;

        // 3D printed cross/corner bracket
        const bracketGeo = new THREE.BoxGeometry(2.4, 2.4, 0.8);
        const bracket = new THREE.Mesh(bracketGeo, bracketMaterial);
        bracket.position.set(posX, posY, tileDepth / 2 + 0.3);
        bracket.castShadow = true;
        this.bracketGroup.add(bracket);

        // Simulated M4 hex mounting screw
        const screwGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 8);
        screwGeo.rotateX(Math.PI / 2);
        const screw = new THREE.Mesh(screwGeo, screwMaterial);
        screw.position.set(posX, posY, tileDepth / 2 + 0.7);
        this.bracketGroup.add(screw);
      }
    }

    // Update accessories
    this.updateAccessories(state);

    // Adjust camera to fit board nicely
    this.fitCamera(totalWidth, totalHeight);
  }

  generateSlotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Draw pill slots (6 columns x 5 rows per tile)
    ctx.fillStyle = '#10141a';
    const cols = 6;
    const rows = 5;
    const stepX = 512 / cols;
    const stepY = 512 / rows;
    const slotW = 12;
    const slotH = 48;
    const radius = 6;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cx = (i + 0.5) * stepX;
        const cy = (j + 0.5) * stepY;

        // Draw pill shape
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(cx - slotW / 2, cy - slotH / 2, slotW, slotH, radius);
          ctx.fill();
        } else {
          ctx.fillRect(cx - slotW / 2, cy - slotH / 2, slotW, slotH);
        }

        // Subtle bevel inner shadow
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  updateAccessories(state) {
    while (this.accessoriesGroup.children.length > 0) {
      this.accessoriesGroup.remove(this.accessoriesGroup.children[0]);
    }

    const { placedAccessories, accessoryColor, cols, rows } = state;
    if (!placedAccessories || placedAccessories.length === 0) return;

    const tileW = 16;
    const tileH = 16;
    const totalWidth = cols * tileW;
    const totalHeight = rows * tileH;
    const startX = -totalWidth / 2;
    const startY = totalHeight / 2;

    const plasticMat = this.getAccessoryMaterial(accessoryColor);
    const steelMat = this.getAccessoryMaterial('#ffffff', true);
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });

    placedAccessories.forEach(item => {
      // Calculate 3D position based on normalized coordinates (0 to 1)
      const posX = startX + item.relX * totalWidth;
      const posY = startY - item.relY * totalHeight;
      const posZ = 1.0;

      const accMesh = this.buildAccessoryModel(item.type, plasticMat, steelMat, rubberMat);
      accMesh.position.set(posX, posY, posZ);
      this.accessoriesGroup.add(accMesh);
    });
  }

  buildAccessoryModel(type, plasticMat, steelMat, rubberMat) {
    const group = new THREE.Group();

    switch (type) {
      case 'wrench_rack': {
        // Horizontal mounting rail
        const rail = new THREE.Mesh(new THREE.BoxGeometry(11, 2, 2.5), plasticMat);
        rail.castShadow = true;
        group.add(rail);

        // 5 wrenches of decreasing sizes
        for (let i = 0; i < 5; i++) {
          const wLen = 10 - i * 1.4;
          const wrench = new THREE.Mesh(new THREE.BoxGeometry(0.8, wLen, 0.4), steelMat);
          wrench.position.set(-4 + i * 2, -wLen / 2 + 0.5, 2);
          wrench.castShadow = true;
          group.add(wrench);

          // Wrench head loop
          const head = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.25, 6, 12), steelMat);
          head.position.set(-4 + i * 2, 0.5, 2);
          group.add(head);
        }
        break;
      }

      case 'drill_mount': {
        // Heavy duty hanging bracket
        const base = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 3), plasticMat);
        base.castShadow = true;
        group.add(base);

        // Cordless Drill 3D body
        const drillBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 9), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }));
        drillBody.position.set(0, -1, 4.5);
        drillBody.castShadow = true;
        group.add(drillBody);

        // Chuck & battery
        const chuck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 4, 12), steelMat);
        chuck.rotation.x = Math.PI / 2;
        chuck.position.set(0, 0.5, 10);
        group.add(chuck);

        const battery = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 5), rubberMat);
        battery.position.set(0, -3.5, 3);
        group.add(battery);
        break;
      }

      case 'screwdriver_rack': {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(12, 2.2, 2.8), plasticMat);
        bar.castShadow = true;
        group.add(bar);

        // 6 vertical screwdrivers
        for (let i = 0; i < 6; i++) {
          const sX = -4.5 + i * 1.8;
          // Shaft
          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8, 8), steelMat);
          shaft.position.set(sX, -4, 2);
          shaft.castShadow = true;
          group.add(shaft);

          // Handle (red/black)
          const handleMat = (i % 2 === 0) ? new THREE.MeshStandardMaterial({ color: 0xdc2626 }) : new THREE.MeshStandardMaterial({ color: 0xeab308 });
          const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 3.5, 8), handleMat);
          handle.position.set(sX, 1.5, 2);
          handle.castShadow = true;
          group.add(handle);
        }
        break;
      }

      case 'storage_bin': {
        // Modular parts bin with sloped front scoop
        const binBody = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 4.5), plasticMat);
        binBody.castShadow = true;
        binBody.position.set(0, 0, 2.25);
        group.add(binBody);

        // Rim
        const rim = new THREE.Mesh(new THREE.BoxGeometry(7.4, 5.4, 0.8), plasticMat);
        rim.position.set(0, 0, 4.2);
        group.add(rim);

        // Small simulated screws inside
        const nuts = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), steelMat);
        nuts.position.set(0.5, -0.5, 2.5);
        group.add(nuts);
        break;
      }

      case 'large_shelf': {
        // Wide tray shelf
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 7), plasticMat);
        shelf.castShadow = true;
        shelf.position.set(0, -1, 3.5);
        group.add(shelf);

        // Angle grinder on shelf
        const grinder = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8, 12), new THREE.MeshStandardMaterial({ color: 0x0f766e }));
        grinder.rotation.z = Math.PI / 2;
        grinder.position.set(0, 0.5, 4);
        group.add(grinder);

        // Disc blade
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.2, 16), steelMat);
        disc.position.set(-3.5, 0.5, 4);
        group.add(disc);
        break;
      }

      case 'spray_can_holder': {
        // Cylindrical twin holster
        const c1 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 4.5, 16, 1, true), plasticMat);
        c1.position.set(-2.5, 0, 3);
        group.add(c1);

        const c2 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 4.5, 16, 1, true), plasticMat);
        c2.position.set(2.5, 0, 3);
        group.add(c2);

        // Spray cans inside (red & blue)
        const can1 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 8, 16), new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.5 }));
        can1.position.set(-2.5, 1.5, 3);
        can1.castShadow = true;
        group.add(can1);

        const can2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 8, 16), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.5 }));
        can2.position.set(2.5, 1.5, 3);
        can2.castShadow = true;
        group.add(can2);
        break;
      }

      case 'hammer_mount': {
        // Dual hooks
        const hook = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 3), plasticMat);
        hook.castShadow = true;
        group.add(hook);

        // Hammer shaft & head
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 12, 10), new THREE.MeshStandardMaterial({ color: 0xca8a04 }));
        shaft.position.set(0, -4, 2.5);
        shaft.castShadow = true;
        group.add(shaft);

        const head = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 1.8), steelMat);
        head.position.set(0, 1.5, 2.5);
        head.castShadow = true;
        group.add(head);
        break;
      }

      case 'pliers_holder': {
        const cradle = new THREE.Mesh(new THREE.BoxGeometry(6, 2.5, 2.5), plasticMat);
        cradle.castShadow = true;
        group.add(cradle);

        // Pair of pliers
        const plierHandleL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        plierHandleL.rotation.z = -0.25;
        plierHandleL.position.set(-1.2, -3, 2);
        group.add(plierHandleL);

        const plierHandleR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        plierHandleR.rotation.z = 0.25;
        plierHandleR.position.set(1.2, -3, 2);
        group.add(plierHandleR);

        const plierJaws = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.5, 0.8), steelMat);
        plierJaws.position.set(0, 1, 2);
        group.add(plierJaws);
        break;
      }

      case 'tape_holder': {
        const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 12), plasticMat);
        spindle.rotation.x = Math.PI / 2;
        spindle.position.set(0, 0, 2);
        group.add(spindle);

        // Tape roll
        const tape = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.9, 10, 24), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 }));
        tape.position.set(0, 0, 2.2);
        tape.castShadow = true;
        group.add(tape);
        break;
      }

      case 'bottom_drawer': {
        // Large bottom tray / drawer
        const drawer = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 8), plasticMat);
        drawer.castShadow = true;
        drawer.position.set(0, 0, 4);
        group.add(drawer);

        // Front handle bar
        const handle = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 1), steelMat);
        handle.position.set(0, -1.8, 8.2);
        group.add(handle);
        break;
      }

      default: {
        // Generic utility peg hook
        const peg = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3, 3.5), plasticMat);
        peg.castShadow = true;
        group.add(peg);
      }
    }

    return group;
  }

  fitCamera(width, height) {
    if (!this.camera || !this.controls) return;
    const maxDim = Math.max(width, height);
    const targetZ = maxDim * 1.5 + 30;
    this.camera.position.set(0, -maxDim * 0.15, targetZ);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.controls) {
      this.controls.update();
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

window.Viewer3D = Viewer3D;
