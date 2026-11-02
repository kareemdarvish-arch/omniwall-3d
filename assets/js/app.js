/**
 * OmniWall 3D - Main Application Controller
 * University Graduation Project: 3D-Printed Modular Workshop Wall Configurator
 */

const ACCESSORY_CATALOG = [
  {
    id: 'wrench_rack',
    name: 'Wrench & Spanner Rail',
    category: 'hand',
    badge: 'Holds 5 Wrenches',
    desc: 'Precision stepped slot rail holding metric/imperial combination wrenches vertically.',
    weightGrams: 75,
    printHours: 2.2,
    basePriceUSD: 5.50,
    icon: 'wrench'
  },
  {
    id: 'drill_mount',
    name: 'Heavy-Duty Cordless Drill Mount',
    category: 'power',
    badge: 'Heavy Duty',
    desc: 'Engineered cradle for cordless drills & impact drivers with battery clearance.',
    weightGrams: 90,
    printHours: 2.8,
    basePriceUSD: 7.00,
    icon: 'zap'
  },
  {
    id: 'screwdriver_rack',
    name: '6-Slot Screwdriver Array',
    category: 'hand',
    badge: 'Popular',
    desc: 'Vertical quick-access holster for 6 flathead and Phillips screwdrivers.',
    weightGrams: 60,
    printHours: 1.8,
    basePriceUSD: 4.50,
    icon: 'sliders'
  },
  {
    id: 'storage_bin',
    name: 'Small Parts Hardware Bin',
    category: 'storage',
    badge: 'Stackable',
    desc: 'Open-front scoop bin for M3-M8 screws, nuts, bolts, washers, and small drill bits.',
    weightGrams: 45,
    printHours: 1.5,
    basePriceUSD: 3.50,
    icon: 'box'
  },
  {
    id: 'large_shelf',
    name: 'Tool & Grinder Shelf Tray',
    category: 'storage',
    badge: 'Load: 5kg',
    desc: 'Reinforced ribbed tray shelf for angle grinders, tape measures, and battery chargers.',
    weightGrams: 110,
    printHours: 3.2,
    basePriceUSD: 8.50,
    icon: 'layers'
  },
  {
    id: 'spray_can_holder',
    name: 'Dual Spray Can Holster',
    category: 'storage',
    badge: 'Aerosol/Lubricant',
    desc: 'Cylindrical vented double cup for WD-40, brake cleaner, and spray paint cans.',
    weightGrams: 70,
    printHours: 2.0,
    basePriceUSD: 5.00,
    icon: 'package'
  },
  {
    id: 'hammer_mount',
    name: 'Hammer & Mallet Dual Hook',
    category: 'hand',
    badge: 'Reinforced',
    desc: 'Dual-prong mount designed for claw hammers, deadblow mallets, and rubber hammers.',
    weightGrams: 55,
    printHours: 1.6,
    basePriceUSD: 4.00,
    icon: 'hammer'
  },
  {
    id: 'pliers_holder',
    name: 'Pliers & Cutters Cradle',
    category: 'hand',
    badge: 'Dual Tool',
    desc: 'Angled slots for needle-nose pliers, wire strippers, and linesman pliers.',
    weightGrams: 50,
    printHours: 1.5,
    basePriceUSD: 3.80,
    icon: 'scissors'
  },
  {
    id: 'tape_holder',
    name: 'Tape Roll Spindle Hook',
    category: 'utility',
    badge: 'Quick-Draw',
    desc: 'Quick-load spindle holder for masking tape, duct tape, and Teflon rolls.',
    weightGrams: 35,
    printHours: 1.0,
    basePriceUSD: 2.50,
    icon: 'disc'
  },
  {
    id: 'bottom_drawer',
    name: 'Heavy Hardware Drawer Tray',
    category: 'storage',
    badge: 'High Capacity',
    desc: 'Wide lower tray with front grip handle for heavy sockets, bearings, and bulk hardware.',
    weightGrams: 180,
    printHours: 5.0,
    basePriceUSD: 14.00,
    icon: 'inbox'
  },
  {
    id: 'pen_cup',
    name: 'Marker & Cable Tie Organizer',
    category: 'utility',
    badge: 'Multi-Purpose',
    desc: 'Vertical canister for sharpies, grease pencils, calipers, and cable zip-ties.',
    weightGrams: 40,
    printHours: 1.2,
    basePriceUSD: 3.00,
    icon: 'edit-3'
  },
  {
    id: 't_handle_rack',
    name: 'T-Handle Socket Key Rack',
    category: 'hand',
    badge: 'Precision',
    desc: 'Vertical dual slots for T-handle hex keys and socket drivers.',
    weightGrams: 48,
    printHours: 1.4,
    basePriceUSD: 3.80,
    icon: 'anchor'
  }
];

const MATERIALS = {
  petg: {
    name: 'PETG Pro (Recommended)',
    badge: 'Workshop Grade',
    desc: 'High impact resistance, heat deflection up to 75°C, chemical & oil resistant. Ideal for rugged garage conditions.',
    costMultiplier: 1.1,
    weightMultiplier: 1.02,
    density: '1.27 g/cm³',
    temp: '75°C (167°F)',
    infill: '25% Gyroid (High Shear)'
  },
  pla_plus: {
    name: 'PLA+ Tough Bio-Polymer',
    badge: 'Rigid & Crisp',
    desc: 'Ultra-rigid, excellent surface finish, eco-friendly biopolymer. Best for indoor hobby benches and clean display walls.',
    costMultiplier: 1.0,
    weightMultiplier: 1.0,
    density: '1.24 g/cm³',
    temp: '55°C (131°F)',
    infill: '20% Grid'
  },
  abs: {
    name: 'ABS / ASA Industrial',
    badge: 'High Heat & UV',
    desc: 'Withstands up to 95°C and intense sunlight without warping. Recommended for outdoor sheds and hot industrial workshops.',
    costMultiplier: 1.25,
    weightMultiplier: 0.95,
    density: '1.05 g/cm³',
    temp: '95°C (203°F)',
    infill: '30% Triangular'
  },
  cf_petg: {
    name: 'Carbon Fiber Reinforced PETG',
    badge: 'Aerospace Grade',
    desc: '15% chopped carbon fibers for ultimate stiffness, zero flex, and a gorgeous matte textured surface finish.',
    costMultiplier: 1.65,
    weightMultiplier: 1.05,
    density: '1.30 g/cm³',
    temp: '85°C (185°F)',
    infill: '30% Honeycomb'
  }
};

const COLOR_PRESETS = [
  { name: 'Matte Slate Gray', hex: '#334155' },
  { name: 'Stealth Black', hex: '#181e26' },
  { name: 'Industrial Orange', hex: '#ea580c' },
  { name: 'Arctic White', hex: '#e2e8f0' },
  { name: 'Military Olive', hex: '#365314' },
  { name: 'Navy Cobalt', hex: '#1e3a8a' }
];

const ACCENT_PRESETS = [
  { name: 'Hazard Orange', hex: '#f97316' },
  { name: 'Ferrari Red', hex: '#ef4444' },
  { name: 'Cyber Yellow', hex: '#eab308' },
  { name: 'Electric Cyan', hex: '#06b6d4' },
  { name: 'Charcoal Grey', hex: '#475569' },
  { name: 'Matching Base', hex: 'inherit' }
];

const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0 },
  EGP: { symbol: 'EGP ', rate: 50.0 },
  EUR: { symbol: '€', rate: 0.92 }
};

class OmniWallApp {
  constructor() {
    this.state = {
      cols: 4,
      rows: 3,
      tileDimCm: 20, // 20cm x 20cm modular tile (standard 3D printer bed 220x220mm)
      material: 'petg',
      panelColor: '#2b3648',
      accessoryColor: '#f97316',
      currency: 'USD',
      currentView: '2d', // '2d' or '3d'
      activeTiles: {}, // map of "r_c" -> boolean
      placedAccessories: []
    };

    this.canvas2d = null;
    this.viewer3d = null;

    this.init();
  }

  init() {
    // 1. Load initial photo prototype preset
    this.loadPrototypePreset();

    // 2. Initialize 2D Canvas Studio
    this.canvas2d = new Canvas2DStudio('studio-canvas', {
      onStateChange: (updatedState) => {
        this.state = updatedState;
        this.updateCostAndStats();
        if (this.viewer3d && this.state.currentView === '3d') {
          this.viewer3d.updateBoard(this.state);
        }
      }
    });

    // 3. Initialize 3D Viewer
    this.viewer3d = new Viewer3D('threejs-canvas-wrapper');

    // 4. Render UI components
    this.renderAccessoriesLibrary();
    this.setupEventListeners();

    // 5. Initial sync
    this.canvas2d.setState(this.state);
    this.viewer3d.updateBoard(this.state);
    this.updateCostAndStats();

    // 6. Check URL hash for shared design
    this.loadFromUrlHash();
  }

  loadPrototypePreset() {
    // Exactly recreates the uploaded graduation project board in the photo: 4 cols x 3 rows!
    this.state.cols = 4;
    this.state.rows = 3;
    this.state.panelColor = '#303947';
    this.state.accessoryColor = '#475569';
    this.state.activeTiles = {};

    this.state.placedAccessories = [
      // Top row
      { id: 'acc_1', type: 'spray_can_holder', relX: 0.12, relY: 0.15 },
      { id: 'acc_2', type: 'wrench_rack', relX: 0.22, relY: 0.15 },
      { id: 'acc_3', type: 'wrench_rack', relX: 0.35, relY: 0.15 },
      { id: 'acc_4', type: 'pliers_holder', relX: 0.44, relY: 0.16 },
      { id: 'acc_5', type: 'hammer_mount', relX: 0.53, relY: 0.16 },
      { id: 'acc_6', type: 'screwdriver_rack', relX: 0.62, relY: 0.16 },
      { id: 'acc_7', type: 'tape_holder', relX: 0.70, relY: 0.23 },
      { id: 'acc_8', type: 'drill_mount', relX: 0.79, relY: 0.16 },
      { id: 'acc_9', type: 'pen_cup', relX: 0.89, relY: 0.15 },
      { id: 'acc_10', type: 'pen_cup', relX: 0.95, relY: 0.15 },

      // Middle row
      { id: 'acc_11', type: 'wrench_rack', relX: 0.16, relY: 0.50 },
      { id: 'acc_12', type: 'screwdriver_rack', relX: 0.35, relY: 0.42 },
      { id: 'acc_13', type: 't_handle_rack', relX: 0.55, relY: 0.46 },
      { id: 'acc_14', type: 'large_shelf', relX: 0.76, relY: 0.48 },
      { id: 'acc_15', type: 'storage_bin', relX: 0.89, relY: 0.38 },
      { id: 'acc_16', type: 'storage_bin', relX: 0.89, relY: 0.52 },

      // Bottom row
      { id: 'acc_17', type: 'bottom_drawer', relX: 0.18, relY: 0.84 },
      { id: 'acc_18', type: 'bottom_drawer', relX: 0.42, relY: 0.84 },
      { id: 'acc_19', type: 't_handle_rack', relX: 0.56, relY: 0.72 },
      { id: 'acc_20', type: 'large_shelf', relX: 0.76, relY: 0.72 },
      { id: 'acc_21', type: 'storage_bin', relX: 0.89, relY: 0.67 },
      { id: 'acc_22', type: 'storage_bin', relX: 0.89, relY: 0.81 }
    ];
  }

  renderAccessoriesLibrary() {
    const container = document.getElementById('accessories-list');
    if (!container) return;

    container.innerHTML = '';
    const activeCategory = document.querySelector('.category-pill.active')?.dataset.category || 'all';

    ACCESSORY_CATALOG.forEach(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return;

      const card = document.createElement('div');
      card.className = 'interactive-card glass-panel rounded-xl p-3 border border-slate-700/60 hover:border-orange-500/50 cursor-pointer flex flex-col justify-between transition-all';
      card.setAttribute('draggable', 'true');

      // Drag start transfer
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
      });

      card.innerHTML = `
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-100 leading-tight">${item.name}</h4>
              <span class="text-[10px] text-orange-400 font-mono font-medium">${item.badge}</span>
            </div>
          </div>
        </div>
        <p class="text-xs text-slate-400 line-clamp-2 mb-2">${item.desc}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-mono">
          <span>~${item.weightGrams}g &bull; ${item.printHours}h</span>
          <span class="text-slate-100 font-bold">${this.formatPrice(item.basePriceUSD)}</span>
        </div>
        <button class="add-acc-btn mt-2 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
          <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
          <span>Add to Board</span>
        </button>
      `;

      card.querySelector('.add-acc-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.canvas2d.addAccessory(item.id);
        if (this.viewer3d) this.viewer3d.updateAccessories(this.state);
      });

      container.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupEventListeners() {
    // 1. Grid Size sliders
    const colSlider = document.getElementById('grid-cols');
    const rowSlider = document.getElementById('grid-rows');
    const colVal = document.getElementById('col-val');
    const rowVal = document.getElementById('row-val');

    if (colSlider && rowSlider) {
      colSlider.value = this.state.cols;
      rowSlider.value = this.state.rows;
      if (colVal) colVal.innerText = `${this.state.cols} cols`;
      if (rowVal) rowVal.innerText = `${this.state.rows} rows`;

      colSlider.addEventListener('input', (e) => {
        this.state.cols = parseInt(e.target.value);
        if (colVal) colVal.innerText = `${this.state.cols} cols`;
        this.syncBoard();
      });

      rowSlider.addEventListener('input', (e) => {
        this.state.rows = parseInt(e.target.value);
        if (rowVal) rowVal.innerText = `${this.state.rows} rows`;
        this.syncBoard();
      });
    }

    // 2. Preset Layout Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = btn.dataset.preset;
        this.applyPreset(preset);
      });
    });

    // 3. Material Selection Cards
    document.querySelectorAll('.material-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('border-orange-500', 'bg-orange-500/10'));
        card.classList.add('border-orange-500', 'bg-orange-500/10');
        this.state.material = card.dataset.material;
        this.syncBoard();
      });
    });

    // 4. Panel Color Presets
    const panelColorContainer = document.getElementById('panel-colors');
    if (panelColorContainer) {
      COLOR_PRESETS.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'w-7 h-7 rounded-full border-2 border-slate-700 hover:scale-110 transition-transform relative';
        btn.style.backgroundColor = color.hex;
        btn.setAttribute('title', color.name);
        btn.addEventListener('click', () => {
          this.state.panelColor = color.hex;
          this.syncBoard();
        });
        panelColorContainer.appendChild(btn);
      });
    }

    // Custom Panel Color Input
    const customPanelColor = document.getElementById('custom-panel-color');
    if (customPanelColor) {
      customPanelColor.addEventListener('input', (e) => {
        this.state.panelColor = e.target.value;
        this.syncBoard();
      });
    }

    // 5. Accessory Accent Color Presets
    const accentColorContainer = document.getElementById('accent-colors');
    if (accentColorContainer) {
      ACCENT_PRESETS.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'w-7 h-7 rounded-full border-2 border-slate-700 hover:scale-110 transition-transform relative';
        btn.style.backgroundColor = color.hex === 'inherit' ? this.state.panelColor : color.hex;
        btn.setAttribute('title', color.name);
        btn.addEventListener('click', () => {
          this.state.accessoryColor = color.hex === 'inherit' ? this.state.panelColor : color.hex;
          this.syncBoard();
        });
        accentColorContainer.appendChild(btn);
      });
    }

    const customAccentColor = document.getElementById('custom-accent-color');
    if (customAccentColor) {
      customAccentColor.addEventListener('input', (e) => {
        this.state.accessoryColor = e.target.value;
        this.syncBoard();
      });
    }

    // 6. View Switcher (2D Studio vs 3D Inspector)
    const view2dBtn = document.getElementById('view-2d-btn');
    const view3dBtn = document.getElementById('view-3d-btn');
    const studio2d = document.getElementById('studio-canvas-container');
    const viewer3dWrapper = document.getElementById('threejs-canvas-wrapper');

    if (view2dBtn && view3dBtn) {
      view2dBtn.addEventListener('click', () => {
        this.state.currentView = '2d';
        view2dBtn.classList.add('tab-active');
        view3dBtn.classList.remove('tab-active');
        studio2d.classList.remove('hidden');
        viewer3dWrapper.classList.add('hidden');
        this.canvas2d.resize();
        this.canvas2d.render();
      });

      view3dBtn.addEventListener('click', () => {
        this.state.currentView = '3d';
        view3dBtn.classList.add('tab-active');
        view2dBtn.classList.remove('tab-active');
        studio2d.classList.add('hidden');
        viewer3dWrapper.classList.remove('hidden');
        if (this.viewer3d) {
          this.viewer3d.onWindowResize();
          this.viewer3d.updateBoard(this.state);
        }
      });
    }

    // 7. Category Filter Pills
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('tab-active'));
        pill.classList.add('tab-active');
        this.renderAccessoriesLibrary();
      });
    });

    // 8. Currency Toggle
    const currSelect = document.getElementById('currency-select');
    if (currSelect) {
      currSelect.addEventListener('change', (e) => {
        this.state.currency = e.target.value;
        this.renderAccessoriesLibrary();
        this.updateCostAndStats();
      });
    }

    // 9. Quick Actions
    document.getElementById('clear-board-btn')?.addEventListener('click', () => {
      if (confirm('Clear all tools from the pegboard?')) {
        this.canvas2d.clearAllAccessories();
        if (this.viewer3d) this.viewer3d.updateAccessories(this.state);
      }
    });

    document.getElementById('reset-preset-btn')?.addEventListener('click', () => {
      this.loadPrototypePreset();
      this.syncBoard();
    });

    // 10. Modals
    this.setupModals();
  }

  applyPreset(presetKey) {
    this.state.activeTiles = {};

    switch (presetKey) {
      case 'reference_photo':
        this.loadPrototypePreset();
        break;
      case 'compact':
        this.state.cols = 3;
        this.state.rows = 2;
        break;
      case 'starter':
        this.state.cols = 2;
        this.state.rows = 2;
        break;
      case 'promaster':
        this.state.cols = 5;
        this.state.rows = 3;
        break;
      case 'l_shape':
        this.state.cols = 4;
        this.state.rows = 3;
        // Inactive top-right tiles
        this.state.activeTiles = {
          '0_2': false, '0_3': false,
          '1_2': false, '1_3': false
        };
        break;
      case 'inverted_t':
        this.state.cols = 4;
        this.state.rows = 3;
        this.state.activeTiles = {
          '0_0': false, '0_3': false
        };
        break;
    }

    // Update range sliders
    const colSlider = document.getElementById('grid-cols');
    const rowSlider = document.getElementById('grid-rows');
    const colVal = document.getElementById('col-val');
    const rowVal = document.getElementById('row-val');
    if (colSlider && rowSlider) {
      colSlider.value = this.state.cols;
      rowSlider.value = this.state.rows;
      if (colVal) colVal.innerText = `${this.state.cols} cols`;
      if (rowVal) rowVal.innerText = `${this.state.rows} rows`;
    }

    this.syncBoard();
  }

  syncBoard() {
    this.canvas2d.setState(this.state);
    if (this.viewer3d) {
      this.viewer3d.updateBoard(this.state);
    }
    this.updateCostAndStats();
  }

  getActiveTileCount() {
    let count = 0;
    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
        if (this.state.activeTiles?.[`${r}_${c}`] !== false) {
          count++;
        }
      }
    }
    return count;
  }

  calculateStats() {
    const tileCount = this.getActiveTileCount();
    const mat = MATERIALS[this.state.material] || MATERIALS.petg;

    // Base panel specs (each 20cm x 20cm modular tile)
    const basePanelWeightG = 185; // grams of filament per tile with 4 wall loops & 25% gyroid infill
    const basePanelPrintHours = 4.2; // hours on Bambu Lab / Voron CoreXY printer
    const basePanelCostUSD = 8.00; // includes material, machine time, and hardware connectors

    const totalPanelWeight = tileCount * basePanelWeightG * mat.weightMultiplier;
    const totalPanelPrintHours = tileCount * basePanelPrintHours;
    const totalPanelCost = tileCount * basePanelCostUSD * mat.costMultiplier;

    // Accessories calculation
    let accessoriesWeight = 0;
    let accessoriesPrintHours = 0;
    let accessoriesCost = 0;

    this.state.placedAccessories.forEach(item => {
      const catalogItem = ACCESSORY_CATALOG.find(c => c.id === item.type);
      if (catalogItem) {
        accessoriesWeight += catalogItem.weightGrams * mat.weightMultiplier;
        accessoriesPrintHours += catalogItem.printHours;
        accessoriesCost += catalogItem.basePriceUSD * mat.costMultiplier;
      }
    });

    const totalWeightGrams = Math.round(totalPanelWeight + accessoriesWeight);
    const totalPrintHours = Math.round((totalPanelPrintHours + accessoriesPrintHours) * 10) / 10;
    const hardwareKitCost = 5.00; // Free / included mounting screws & wall anchors
    const totalPriceUSD = totalPanelCost + accessoriesCost;

    return {
      tileCount,
      totalWeightGrams,
      totalWeightKg: (totalWeightGrams / 1000).toFixed(2),
      totalPrintHours,
      totalPanelCost,
      accessoriesCost,
      hardwareKitCost,
      totalPriceUSD,
      dimensionsCm: {
        width: this.state.cols * this.state.tileDimCm,
        height: this.state.rows * this.state.tileDimCm
      }
    };
  }

  formatPrice(amountUSD) {
    const curr = CURRENCIES[this.state.currency] || CURRENCIES.USD;
    const converted = amountUSD * curr.rate;
    if (this.state.currency === 'EGP') {
      return `${Math.round(converted).toLocaleString()} ${curr.symbol}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  }

  updateCostAndStats() {
    const stats = this.calculateStats();
    const mat = MATERIALS[this.state.material] || MATERIALS.petg;

    // Update Dimensions and Specs
    const dimEl = document.getElementById('summary-dimensions');
    if (dimEl) dimEl.innerText = `${stats.dimensionsCm.width} × ${stats.dimensionsCm.height} cm (${stats.tileCount} Tiles)`;

    const weightEl = document.getElementById('summary-weight');
    if (weightEl) weightEl.innerText = `${stats.totalWeightGrams} g (${stats.totalWeightKg} kg)`;

    const timeEl = document.getElementById('summary-print-time');
    if (timeEl) timeEl.innerText = `~${stats.totalPrintHours} hrs`;

    const materialEl = document.getElementById('summary-material');
    if (materialEl) materialEl.innerText = mat.name;

    // Breakdown lines
    const panelCostEl = document.getElementById('cost-panels');
    if (panelCostEl) panelCostEl.innerText = this.formatPrice(stats.totalPanelCost);

    const accCostEl = document.getElementById('cost-accessories');
    if (accCostEl) accCostEl.innerText = this.formatPrice(stats.accessoriesCost);

    const totalEl = document.getElementById('total-cost-display');
    if (totalEl) totalEl.innerText = this.formatPrice(stats.totalPriceUSD);

    const accessoriesCountEl = document.getElementById('summary-acc-count');
    if (accessoriesCountEl) accessoriesCountEl.innerText = `${this.state.placedAccessories.length} items`;
  }

  setupModals() {
    // 1. Quote Modal
    const quoteModal = document.getElementById('quote-modal');
    const openQuoteBtn = document.getElementById('open-quote-modal-btn');
    const closeQuoteBtn = document.getElementById('close-quote-modal-btn');

    if (openQuoteBtn && quoteModal) {
      openQuoteBtn.addEventListener('click', () => {
        this.populateQuoteModal();
        quoteModal.classList.remove('hidden');
      });
    }
    if (closeQuoteBtn && quoteModal) {
      closeQuoteBtn.addEventListener('click', () => {
        quoteModal.classList.add('hidden');
      });
    }

    // 2. Prototype Modal (Photo showcase)
    const protoModal = document.getElementById('prototype-modal');
    const openProtoBtn = document.getElementById('open-prototype-btn');
    const closeProtoBtn = document.getElementById('close-prototype-btn');

    if (openProtoBtn && protoModal) {
      openProtoBtn.addEventListener('click', () => {
        protoModal.classList.remove('hidden');
      });
    }
    if (closeProtoBtn && protoModal) {
      closeProtoBtn.addEventListener('click', () => {
        protoModal.classList.add('hidden');
      });
    }

    // 3. Material Guide Modal
    const matModal = document.getElementById('material-guide-modal');
    const openMatBtn = document.getElementById('open-material-guide-btn');
    const closeMatBtn = document.getElementById('close-material-guide-btn');

    if (openMatBtn && matModal) {
      openMatBtn.addEventListener('click', () => {
        matModal.classList.remove('hidden');
      });
    }
    if (closeMatBtn && matModal) {
      closeMatBtn.addEventListener('click', () => {
        matModal.classList.add('hidden');
      });
    }

    // 4. Custom Tile Shape Editor Modal
    const shapeModal = document.getElementById('shape-editor-modal');
    const openShapeBtn = document.getElementById('open-shape-editor-btn');
    const closeShapeBtn = document.getElementById('close-shape-editor-btn');

    if (openShapeBtn && shapeModal) {
      openShapeBtn.addEventListener('click', () => {
        this.renderShapeEditorGrid();
        shapeModal.classList.remove('hidden');
      });
    }
    if (closeShapeBtn && shapeModal) {
      closeShapeBtn.addEventListener('click', () => {
        shapeModal.classList.add('hidden');
        this.syncBoard();
      });
    }

    // 5. Share Button
    const shareBtn = document.getElementById('share-design-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.copyShareableLink();
      });
    }

    // 6. Print Quote Button
    document.getElementById('print-quote-btn')?.addEventListener('click', () => {
      window.print();
    });

    // 7. WhatsApp Order Button
    document.getElementById('whatsapp-order-btn')?.addEventListener('click', () => {
      this.sendWhatsAppOrder();
    });
  }

  renderShapeEditorGrid() {
    const gridContainer = document.getElementById('shape-tile-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${this.state.cols}, minmax(0, 1fr))`;

    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
        const key = `${r}_${c}`;
        const isActive = this.state.activeTiles?.[key] !== false;

        const tileBtn = document.createElement('button');
        tileBtn.className = `h-16 rounded-lg border-2 transition-all flex flex-col items-center justify-center font-mono text-xs ${
          isActive
            ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md'
            : 'bg-slate-800/40 border-slate-700/60 text-slate-500 hover:border-slate-600'
        }`;
        tileBtn.innerHTML = `<span>T[${r},${c}]</span><span class="text-[10px]">${isActive ? 'ACTIVE' : 'OFF'}</span>`;

        tileBtn.addEventListener('click', () => {
          if (!this.state.activeTiles) this.state.activeTiles = {};
          this.state.activeTiles[key] = !isActive;
          this.renderShapeEditorGrid();
          this.syncBoard();
        });

        gridContainer.appendChild(tileBtn);
      }
    }
  }

  populateQuoteModal() {
    const stats = this.calculateStats();
    const mat = MATERIALS[this.state.material] || MATERIALS.petg;
    const orderId = 'PW-3D-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('quote-order-id').innerText = orderId;
    document.getElementById('quote-date').innerText = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Bill of Materials table
    const bomBody = document.getElementById('quote-bom-items');
    if (bomBody) {
      bomBody.innerHTML = '';

      // Line 1: Modular Panels
      const panelRow = document.createElement('tr');
      panelRow.className = 'border-b border-slate-200';
      panelRow.innerHTML = `
        <td class="py-2.5 px-3">
          <div class="font-bold text-slate-900">Modular Interlocking Pegboard Tile (${this.state.tileDimCm}×${this.state.tileDimCm}cm)</div>
          <div class="text-xs text-slate-500">Material: ${mat.name} &bull; Color: ${this.state.panelColor}</div>
        </td>
        <td class="text-center font-mono">${stats.tileCount}</td>
        <td class="text-right font-mono">${this.formatPrice(stats.totalPanelCost / stats.tileCount)}</td>
        <td class="text-right font-mono font-bold">${this.formatPrice(stats.totalPanelCost)}</td>
      `;
      bomBody.appendChild(panelRow);

      // Accessories lines (aggregate count by type)
      const counts = {};
      this.state.placedAccessories.forEach(item => {
        counts[item.type] = (counts[item.type] || 0) + 1;
      });

      Object.entries(counts).forEach(([type, count]) => {
        const cat = ACCESSORY_CATALOG.find(c => c.id === type);
        if (!cat) return;
        const lineTotal = count * cat.basePriceUSD * mat.costMultiplier;
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-200';
        row.innerHTML = `
          <td class="py-2 px-3">
            <div class="font-medium text-slate-900">${cat.name}</div>
            <div class="text-xs text-slate-500">Filament: ${cat.weightGrams * count}g &bull; ${cat.desc}</div>
          </td>
          <td class="text-center font-mono">${count}</td>
          <td class="text-right font-mono">${this.formatPrice(cat.basePriceUSD * mat.costMultiplier)}</td>
          <td class="text-right font-mono font-semibold">${this.formatPrice(lineTotal)}</td>
        `;
        bomBody.appendChild(row);
      });

      // Line: Hardware kit
      const hwRow = document.createElement('tr');
      hwRow.className = 'border-b border-slate-200';
      hwRow.innerHTML = `
        <td class="py-2 px-3">
          <div class="font-medium text-slate-900">M4 Hardware Mounting & Interlocking Joint Pack</div>
          <div class="text-xs text-slate-500">Hex bolts, corner joint brackets, drywall anchors (Included)</div>
        </td>
        <td class="text-center font-mono">1 kit</td>
        <td class="text-right font-mono text-emerald-600 font-medium">FREE</td>
        <td class="text-right font-mono font-medium text-emerald-600">FREE</td>
      `;
      bomBody.appendChild(hwRow);
    }

    // Totals
    document.getElementById('quote-total-price').innerText = this.formatPrice(stats.totalPriceUSD);
    document.getElementById('quote-total-weight').innerText = `${stats.totalWeightGrams} g (${stats.totalWeightKg} kg)`;
    document.getElementById('quote-total-time').innerText = `~${stats.totalPrintHours} hours of additive manufacturing`;
    document.getElementById('quote-specs-text').innerText = `${stats.dimensionsCm.width}cm W × ${stats.dimensionsCm.height}cm H &bull; Infill: ${mat.infill} &bull; Bed Size: 220x220mm compatible`;
  }

  sendWhatsAppOrder() {
    const stats = this.calculateStats();
    const mat = MATERIALS[this.state.material] || MATERIALS.petg;
    const itemsCount = this.state.placedAccessories.length;

    const message = encodeURIComponent(
      `Hello Graduation Project Team! 👋\n` +
      `I want to place an order for the 3D-Printed Modular Pegboard Wall:\n\n` +
      `📏 Size: ${stats.dimensionsCm.width}x${stats.dimensionsCm.height} cm (${stats.tileCount} Tiles)\n` +
      `🧵 Material: ${mat.name}\n` +
      `🎨 Colors: Base [${this.state.panelColor}], Accent [${this.state.accessoryColor}]\n` +
      `🛠️ Accessories: ${itemsCount} items installed\n` +
      `⚖️ Total Filament: ${stats.totalWeightKg} kg (~${stats.totalPrintHours} hrs print time)\n` +
      `💰 Estimated Price: ${this.formatPrice(stats.totalPriceUSD)}\n\n` +
      `Shared Configuration URL: ${window.location.href}`
    );

    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  }

  copyShareableLink() {
    const jsonState = encodeURIComponent(JSON.stringify({
      cols: this.state.cols,
      rows: this.state.rows,
      material: this.state.material,
      panelColor: this.state.panelColor,
      accessoryColor: this.state.accessoryColor,
      activeTiles: this.state.activeTiles,
      placedAccessories: this.state.placedAccessories
    }));

    const shareUrl = `${window.location.origin}${window.location.pathname}#design=${jsonState}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('✨ Design configuration link copied to clipboard! You can share this link with anyone.');
    }).catch(() => {
      prompt('Copy your custom design link:', shareUrl);
    });
  }

  loadFromUrlHash() {
    if (window.location.hash.startsWith('#design=')) {
      try {
        const rawJson = decodeURIComponent(window.location.hash.replace('#design=', ''));
        const loaded = JSON.parse(rawJson);
        this.state = { ...this.state, ...loaded };
        this.syncBoard();
      } catch (err) {
        console.warn('Could not parse hash config', err);
      }
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new OmniWallApp();
});
