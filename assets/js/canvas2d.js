/**
 * OmniWall 3D - 2D Interactive Pegboard Studio Canvas
 * Handles dynamic grid rendering, snapping to slots, realistic accessory rendering,
 * interactive drag-and-drop, selection, rotation, and deletion.
 */

// Canvas roundRect polyfill for maximum browser compatibility
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    const r = radii[0] || 0;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

class Canvas2DStudio {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.state = null;
    this.onStateChange = options.onStateChange || (() => {});

    // Interactive state
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.draggedItem = null;
    this.selectedItemIndex = -1;
    this.hoveredItemIndex = -1;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.mousePos = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    // Mouse & Touch events
    this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handlePointerMove(e));
    window.addEventListener('mouseup', (e) => this.handlePointerUp(e));

    // Touch events for mobile/tablet customers
    this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, 'down'), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, 'move'), { passive: false });
    window.addEventListener('touchend', (e) => this.handleTouch(e, 'up'));

    // HTML5 Drag and Drop from library
    this.setupDropZone();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.scale(dpr, dpr);
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;
  }

  setupDropZone() {
    const parent = this.canvas.parentElement;
    parent.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    parent.addEventListener('drop', (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('text/plain');
      if (type && this.state) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        this.addAccessoryAtScreenPos(type, clientX, clientY);
      }
    });
  }

  handleTouch(e, action) {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const fakeEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      };
      if (action === 'down') this.handlePointerDown(fakeEvent);
      if (action === 'move') this.handlePointerMove(fakeEvent);
    } else if (action === 'up') {
      this.handlePointerUp(e);
    }
  }

  setState(newState) {
    this.state = newState;
    this.render();
  }

  getBoardLayout() {
    if (!this.state) return { width: 0, height: 0, x: 0, y: 0, tilePx: 120 };

    const { cols, rows } = this.state;
    const padding = 60;
    const maxW = this.cssWidth - padding * 2;
    const maxH = this.cssHeight - padding * 2;

    const tilePx = Math.min(maxW / cols, maxH / rows, 140);
    const totalW = cols * tilePx;
    const totalH = rows * tilePx;
    const startX = (this.cssWidth - totalW) / 2;
    const startY = (this.cssHeight - totalH) / 2;

    return {
      x: startX,
      y: startY,
      width: totalW,
      height: totalH,
      cols,
      rows,
      tilePx
    };
  }

  render() {
    if (!this.state) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    const board = this.getBoardLayout();

    // 1. Draw subtle shadow underneath whole board
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = 'rgba(15, 20, 28, 0.5)';
    ctx.fillRect(board.x, board.y, board.width, board.height);
    ctx.restore();

    // 2. Draw modular tiles
    this.renderTiles(board);

    // 3. Draw corner connecting clips & screws
    this.renderBracketsAndMounts(board);

    // 4. Draw placed accessories
    this.renderAccessories(board);

    // 5. Draw selection overlay and action buttons
    if (this.selectedItemIndex >= 0 && this.selectedItemIndex < this.state.placedAccessories.length) {
      this.renderSelectionControls(board, this.state.placedAccessories[this.selectedItemIndex]);
    }
  }

  renderTiles(board) {
    const ctx = this.ctx;
    const { cols, rows, tilePx, x: startX, y: startY } = board;
    const { activeTiles, panelColor, material } = this.state;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r}_${c}`;
        if (activeTiles && activeTiles[key] === false) continue;

        const tileX = startX + c * tilePx;
        const tileY = startY + r * tilePx;
        const pad = 2;
        const size = tilePx - pad * 2;

        // Tile body base with 3D bevel effect
        ctx.save();
        ctx.fillStyle = panelColor || '#2d3748';
        ctx.beginPath();
        ctx.roundRect(tileX + pad, tileY + pad, size, size, 8);
        ctx.fill();

        // Subtle textured 3D print layer line sheen
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner shadow on top & left
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tileX + pad + 8, tileY + pad + 1);
        ctx.lineTo(tileX + pad + size - 8, tileY + pad + 1);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.moveTo(tileX + pad + 8, tileY + pad + size - 1);
        ctx.lineTo(tileX + pad + size - 8, tileY + pad + size - 1);
        ctx.stroke();

        // Draw signature pill slots (6 cols x 5 rows per tile)
        this.renderTileSlots(tileX + pad, tileY + pad, size);

        ctx.restore();
      }
    }
  }

  renderTileSlots(tileX, tileY, size) {
    const ctx = this.ctx;
    const slotCols = 6;
    const slotRows = 5;
    const stepX = size / slotCols;
    const stepY = size / slotRows;
    const slotW = Math.max(size * 0.045, 4);
    const slotH = Math.max(size * 0.12, 11);

    ctx.fillStyle = '#0b0f15'; // Dark slot recess

    for (let i = 0; i < slotCols; i++) {
      for (let j = 0; j < slotRows; j++) {
        const cx = tileX + (i + 0.5) * stepX;
        const cy = tileY + (j + 0.5) * stepY;

        ctx.beginPath();
        ctx.roundRect(cx - slotW / 2, cy - slotH / 2, slotW, slotH, slotW / 2);
        ctx.fill();

        // Slot bevel highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  renderBracketsAndMounts(board) {
    const ctx = this.ctx;
    const { cols, rows, tilePx, x: startX, y: startY } = board;
    const { activeTiles } = this.state;
    const bracketSize = Math.max(tilePx * 0.16, 14);

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const posX = startX + c * tilePx;
        const posY = startY + r * tilePx;

        // Check neighboring tiles
        const neighbors = [
          activeTiles?.[`${r-1}_${c-1}`] !== false && (r > 0 && c > 0),
          activeTiles?.[`${r-1}_${c}`] !== false && (r > 0 && c < cols),
          activeTiles?.[`${r}_${c-1}`] !== false && (r < rows && c > 0),
          activeTiles?.[`${r}_${c}`] !== false && (r < rows && c < cols),
        ];

        const activeNeighborsCount = neighbors.filter(Boolean).length;
        if (activeNeighborsCount === 0) continue;

        ctx.save();
        // 3D-Printed Joint Bracket plate
        ctx.fillStyle = '#141a24';
        ctx.strokeStyle = '#273549';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.roundRect(posX - bracketSize / 2, posY - bracketSize / 2, bracketSize, bracketSize, 4);
        ctx.fill();
        ctx.stroke();

        // M4 Hex Screw Cap center
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(posX, posY, bracketSize * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Hex socket center
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(posX, posY, bracketSize * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }

  renderAccessories(board) {
    const { placedAccessories, accessoryColor } = this.state;
    if (!placedAccessories) return;

    placedAccessories.forEach((item, index) => {
      const isSelected = (index === this.selectedItemIndex);
      const isHovered = (index === this.hoveredItemIndex);
      this.drawAccessoryItem(board, item, isSelected, isHovered, accessoryColor);
    });
  }

  drawAccessoryItem(board, item, isSelected, isHovered, defaultColor) {
    const ctx = this.ctx;
    const x = board.x + item.relX * board.width;
    const y = board.y + item.relY * board.height;
    const scale = board.tilePx / 120; // Normalizing factor

    ctx.save();
    ctx.translate(x, y);

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    const accentColor = item.customColor || defaultColor || '#f97316';

    switch (item.type) {
      case 'wrench_rack':
        this.drawWrenchRack(ctx, scale, accentColor);
        break;
      case 'drill_mount':
        this.drawDrillMount(ctx, scale, accentColor);
        break;
      case 'screwdriver_rack':
        this.drawScrewdriverRack(ctx, scale, accentColor);
        break;
      case 'storage_bin':
        this.drawStorageBin(ctx, scale, accentColor);
        break;
      case 'large_shelf':
        this.drawLargeShelf(ctx, scale, accentColor);
        break;
      case 'spray_can_holder':
        this.drawSprayCanHolder(ctx, scale, accentColor);
        break;
      case 'hammer_mount':
        this.drawHammerMount(ctx, scale, accentColor);
        break;
      case 'pliers_holder':
        this.drawPliersHolder(ctx, scale, accentColor);
        break;
      case 'tape_holder':
        this.drawTapeHolder(ctx, scale, accentColor);
        break;
      case 'bottom_drawer':
        this.drawBottomDrawer(ctx, scale, accentColor);
        break;
      case 'pen_cup':
        this.drawPenCup(ctx, scale, accentColor);
        break;
      case 't_handle_rack':
        this.drawTHandleRack(ctx, scale, accentColor);
        break;
      default:
        this.drawGenericHook(ctx, scale, accentColor);
    }

    ctx.restore();
  }

  // --- Visuals of accessories from the actual photo ---

  drawWrenchRack(ctx, scale, color) {
    // Horizontal mounting bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-50 * scale, -10 * scale, 100 * scale, 22 * scale, 4);
    ctx.fill();

    // 5 Combination Wrenches hanging down
    const counts = [
      { len: 80, w: 9 },
      { len: 70, w: 8 },
      { len: 60, w: 7 },
      { len: 52, w: 6.5 },
      { len: 44, w: 6 }
    ];

    counts.forEach((c, idx) => {
      const wx = (-38 + idx * 19) * scale;
      // Chrome wrench shaft
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.fillRect(wx - (c.w * scale) / 2, 8 * scale, c.w * scale, c.len * scale);
      ctx.strokeRect(wx - (c.w * scale) / 2, 8 * scale, c.w * scale, c.len * scale);

      // Ring head
      ctx.beginPath();
      ctx.arc(wx, (8 + c.len) * scale, (c.w * 0.9) * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(wx, (8 + c.len) * scale, (c.w * 0.45) * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
    });
  }

  drawDrillMount(ctx, scale, color) {
    // 3D printed wall bracket
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-24 * scale, -24 * scale, 48 * scale, 48 * scale, 6);
    ctx.fill();

    // Cordless Drill (Teal body like Makita in photo)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-18 * scale, -14 * scale, 46 * scale, 28 * scale, 6);
    ctx.fill();

    // Chuck & bit
    ctx.fillStyle = '#64748b';
    ctx.fillRect(26 * scale, -6 * scale, 16 * scale, 12 * scale);
    ctx.fillStyle = '#334155';
    ctx.fillRect(40 * scale, -2 * scale, 12 * scale, 4 * scale);

    // Battery pack
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-28 * scale, 6 * scale, 26 * scale, 18 * scale, 3);
    ctx.fill();

    // Belt clip
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-8 * scale, 2 * scale, 4 * scale, 10 * scale);
  }

  drawScrewdriverRack(ctx, scale, color) {
    // Horizontal tool bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-54 * scale, -12 * scale, 108 * scale, 24 * scale, 5);
    ctx.fill();

    // 6 vertical screwdrivers
    for (let i = 0; i < 6; i++) {
      const sx = (-42 + i * 17) * scale;
      // Handle
      ctx.fillStyle = (i % 2 === 0) ? '#dc2626' : '#16a34a';
      ctx.beginPath();
      ctx.roundRect(sx - 4.5 * scale, -24 * scale, 9 * scale, 26 * scale, 3);
      ctx.fill();

      // Shaft
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(sx - 1.5 * scale, 10 * scale, 3 * scale, (36 + (i % 3) * 12) * scale);
    }
  }

  drawStorageBin(ctx, scale, color) {
    // Modular stackable bin
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-34 * scale, -22 * scale, 68 * scale, 44 * scale, 6);
    ctx.fill();

    // Front scooped opening
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.roundRect(-28 * scale, -12 * scale, 56 * scale, 30 * scale, 4);
    ctx.fill();

    // Hardware inside (silver nuts and bolts)
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < 6; i++) {
      const bx = (-18 + (i % 3) * 14) * scale;
      const by = (2 + Math.floor(i / 3) * 8) * scale;
      ctx.beginPath();
      ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLargeShelf(ctx, scale, color) {
    // Wide shelf tray
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-65 * scale, -16 * scale, 130 * scale, 32 * scale, 6);
    ctx.fill();

    // Inner tray rim
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-60 * scale, -12 * scale, 120 * scale, 24 * scale, 4);
    ctx.fill();

    // Angle grinder silhouette resting on shelf
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.roundRect(-42 * scale, -8 * scale, 65 * scale, 16 * scale, 5);
    ctx.fill();

    // Grinder disc
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(28 * scale, 0, 14 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  drawSprayCanHolder(ctx, scale, color) {
    // Twin can holder
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-30 * scale, -26 * scale, 60 * scale, 52 * scale, 8);
    ctx.fill();

    // Can 1 (Red aerosol)
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(-14 * scale, -4 * scale, 11 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-14 * scale, -4 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Can 2 (Blue degreaser)
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(14 * scale, -4 * scale, 11 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(14 * scale, -4 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHammerMount(ctx, scale, color) {
    // Bracket
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-22 * scale, -16 * scale, 44 * scale, 32 * scale, 5);
    ctx.fill();

    // Hammer head
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-18 * scale, -10 * scale, 36 * scale, 14 * scale);

    // Hammer wooden shaft
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-5 * scale, 4 * scale, 10 * scale, 65 * scale);
  }

  drawPliersHolder(ctx, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-24 * scale, -14 * scale, 48 * scale, 28 * scale, 5);
    ctx.fill();

    // Plier jaws
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-6 * scale, -18 * scale, 12 * scale, 14 * scale);

    // Plier handles (orange/red dipped rubber)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(-10 * scale, 24 * scale, 4 * scale, 22 * scale, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(10 * scale, 24 * scale, 4 * scale, 22 * scale, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTapeHolder(ctx, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 16 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Masking tape roll
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, 24 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Inner spool
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 11 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBottomDrawer(ctx, scale, color) {
    // Large wide bottom tray
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-75 * scale, -24 * scale, 150 * scale, 48 * scale, 6);
    ctx.fill();

    // Silver drawer handle
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(-45 * scale, 14 * scale, 90 * scale, 6 * scale, 3);
    ctx.fill();

    // Internal dividers
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25 * scale, -20 * scale);
    ctx.lineTo(-25 * scale, 10 * scale);
    ctx.moveTo(25 * scale, -20 * scale);
    ctx.lineTo(25 * scale, 10 * scale);
    ctx.stroke();
  }

  drawPenCup(ctx, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-20 * scale, -15 * scale, 40 * scale, 50 * scale, 6);
    ctx.fill();

    // Pens and zip-ties sticking out
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ffffff'];
    colors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect((-14 + idx * 6) * scale, -32 * scale, 3 * scale, 22 * scale);
    });
  }

  drawTHandleRack(ctx, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-30 * scale, -8 * scale, 60 * scale, 16 * scale, 4);
    ctx.fill();

    // 2 T-Handle wrenches
    [-14, 14].forEach(tx => {
      // T-bar top
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect((tx - 12) * scale, -16 * scale, 24 * scale, 5 * scale);
      // Shaft down
      ctx.fillRect((tx - 2) * scale, -11 * scale, 4 * scale, 65 * scale);
    });
  }

  drawGenericHook(ctx, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-12 * scale, -12 * scale, 24 * scale, 24 * scale, 4);
    ctx.fill();

    // Steel peg
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-3 * scale, 4 * scale, 6 * scale, 18 * scale);
  }

  renderSelectionControls(board, item) {
    const ctx = this.ctx;
    const x = board.x + item.relX * board.width;
    const y = board.y + item.relY * board.height;
    const size = 55 * (board.tilePx / 120);

    ctx.save();
    // Bounding selection box with glowing dashed stroke
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x - size, y - size, size * 2, size * 2);

    // Delete Button (top right)
    const btnSize = 18;
    const delX = x + size;
    const delY = y - size;

    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(delX, delY, btnSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // 'X' icon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(delX - 4, delY - 4);
    ctx.lineTo(delX + 4, delY + 4);
    ctx.moveTo(delX + 4, delY - 4);
    ctx.lineTo(delX - 4, delY + 4);
    ctx.stroke();

    ctx.restore();
  }

  // --- Interaction handling ---

  getScreenCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  handlePointerDown(e) {
    const pos = this.getScreenCoords(e);
    const board = this.getBoardLayout();

    // Check if clicked the delete button on selected item
    if (this.selectedItemIndex >= 0 && this.state.placedAccessories[this.selectedItemIndex]) {
      const item = this.state.placedAccessories[this.selectedItemIndex];
      const ix = board.x + item.relX * board.width;
      const iy = board.y + item.relY * board.height;
      const size = 55 * (board.tilePx / 120);
      const delX = ix + size;
      const delY = iy - size;
      const dist = Math.hypot(pos.x - delX, pos.y - delY);

      if (dist <= 14) {
        this.removeAccessory(this.selectedItemIndex);
        return;
      }
    }

    // Check hit test for placed accessories (search in reverse order so top-most is selected)
    let hitIndex = -1;
    for (let i = this.state.placedAccessories.length - 1; i >= 0; i--) {
      const item = this.state.placedAccessories[i];
      const ix = board.x + item.relX * board.width;
      const iy = board.y + item.relY * board.height;
      const hitRadius = 45 * (board.tilePx / 120);

      if (Math.hypot(pos.x - ix, pos.y - iy) <= hitRadius) {
        hitIndex = i;
        break;
      }
    }

    if (hitIndex >= 0) {
      this.selectedItemIndex = hitIndex;
      this.isDragging = true;
      this.dragStart = { ...pos };
      this.draggedItem = this.state.placedAccessories[hitIndex];
      this.render();
    } else {
      // Clicked empty area -> deselect
      this.selectedItemIndex = -1;
      this.render();
    }
  }

  handlePointerMove(e) {
    const pos = this.getScreenCoords(e);
    const board = this.getBoardLayout();

    if (this.isDragging && this.selectedItemIndex >= 0) {
      // Update item position relative to board
      const rawRelX = (pos.x - board.x) / board.width;
      const rawRelY = (pos.y - board.y) / board.height;

      // Snap to grid slots (e.g. 24 slot columns x 15 slot rows)
      const snapCols = board.cols * 6;
      const snapRows = board.rows * 5;
      const snappedX = Math.round(rawRelX * snapCols) / snapCols;
      const snappedY = Math.round(rawRelY * snapRows) / snapRows;

      // Clamp within board bounds (with 5% margin)
      const clampedX = Math.max(0.04, Math.min(0.96, snappedX));
      const clampedY = Math.max(0.06, Math.min(0.94, snappedY));

      this.state.placedAccessories[this.selectedItemIndex].relX = clampedX;
      this.state.placedAccessories[this.selectedItemIndex].relY = clampedY;

      this.render();
      this.onStateChange(this.state);
    } else {
      // Hover detection
      let hovered = -1;
      for (let i = this.state.placedAccessories.length - 1; i >= 0; i--) {
        const item = this.state.placedAccessories[i];
        const ix = board.x + item.relX * board.width;
        const iy = board.y + item.relY * board.height;
        const hitRadius = 40 * (board.tilePx / 120);
        if (Math.hypot(pos.x - ix, pos.y - iy) <= hitRadius) {
          hovered = i;
          break;
        }
      }
      if (this.hoveredItemIndex !== hovered) {
        this.hoveredItemIndex = hovered;
        this.canvas.style.cursor = hovered >= 0 ? 'grab' : 'default';
        this.render();
      }
    }
  }

  handlePointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.canvas.style.cursor = 'default';
      this.onStateChange(this.state);
    }
  }

  addAccessoryAtScreenPos(type, clientX, clientY) {
    const board = this.getBoardLayout();
    let relX = (clientX - board.x) / board.width;
    let relY = (clientY - board.y) / board.height;

    // Default to center if dropped outside
    if (relX < 0 || relX > 1 || relY < 0 || relY > 1) {
      relX = 0.5;
      relY = 0.5;
    }

    const newItem = {
      id: 'acc_' + Date.now(),
      type: type,
      relX: Math.max(0.05, Math.min(0.95, relX)),
      relY: Math.max(0.08, Math.min(0.92, relY))
    };

    this.state.placedAccessories.push(newItem);
    this.selectedItemIndex = this.state.placedAccessories.length - 1;
    this.render();
    this.onStateChange(this.state);
  }

  addAccessory(type) {
    // Add to center or next available open slot
    const offset = (this.state.placedAccessories.length * 0.08) % 0.5;
    const newItem = {
      id: 'acc_' + Date.now(),
      type: type,
      relX: 0.25 + offset,
      relY: 0.25 + offset
    };
    this.state.placedAccessories.push(newItem);
    this.selectedItemIndex = this.state.placedAccessories.length - 1;
    this.render();
    this.onStateChange(this.state);
  }

  removeAccessory(index) {
    if (index >= 0 && index < this.state.placedAccessories.length) {
      this.state.placedAccessories.splice(index, 1);
      this.selectedItemIndex = -1;
      this.render();
      this.onStateChange(this.state);
    }
  }

  clearAllAccessories() {
    this.state.placedAccessories = [];
    this.selectedItemIndex = -1;
    this.render();
    this.onStateChange(this.state);
  }

  exportImage() {
    return this.canvas.toDataURL('image/png');
  }
}

window.Canvas2DStudio = Canvas2DStudio;
