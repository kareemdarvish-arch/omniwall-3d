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
    infill: '25% Gyroid (High Shear)',
    // Material-specific physical shape adaptations:
    shapeProfileName: 'Stress-Relief Filleted Tiles',
    shapeProfileDesc: 'Radiused 9mm stress-relief fillets with reinforced collar slots to prevent layer delamination under heavy shock.',
    filletRadius: 9,
    slotStyle: 'reinforced_fillet',
    bracketStyle: 'cross_dovetail',
    depth3D: 1.3,
    roughness: 0.45,
    metalness: 0.08,
    infillWatermark: 'PETG PRO · 25% GYROID'
  },
  pla_plus: {
    name: 'PLA+ Tough Bio-Polymer',
    badge: 'Rigid & Crisp',
    desc: 'Ultra-rigid, excellent surface finish, eco-friendly biopolymer. Best for indoor hobby benches and clean display walls.',
    costMultiplier: 1.0,
    weightMultiplier: 1.0,
    density: '1.24 g/cm³',
    temp: '55°C (131°F)',
    infill: '20% Grid',
    // Material-specific physical shape adaptations:
    shapeProfileName: 'Precision Razor Chamfered Tiles',
    shapeProfileDesc: 'Crisp 3mm razor corners with slim precision-cut pill slots for high mechanical rigidity and neat aesthetics.',
    filletRadius: 3,
    slotStyle: 'sharp_precision',
    bracketStyle: 'slim_flush',
    depth3D: 1.1,
    roughness: 0.65,
    metalness: 0.04,
    infillWatermark: 'PLA+ TOUGH · 20% GRID'
  },
  abs: {
    name: 'ABS / ASA Industrial',
    badge: 'High Heat & UV',
    desc: 'Withstands up to 95°C and intense sunlight without warping. Recommended for outdoor sheds and hot industrial workshops.',
    costMultiplier: 1.25,
    weightMultiplier: 0.95,
    density: '1.05 g/cm³',
    temp: '95°C (203°F)',
    infill: '30% Triangular',
    // Material-specific physical shape adaptations:
    shapeProfileName: 'Heavy Thermal Anti-Warp Profile',
    shapeProfileDesc: 'Bulbous 15mm corner curves with circular boss brackets to counter thermal shrinkage and corner bed peeling.',
    filletRadius: 15,
    slotStyle: 'thermal_relief_oval',
    bracketStyle: 'circular_boss',
    depth3D: 1.6,
    roughness: 0.82,
    metalness: 0.02,
    infillWatermark: 'ABS / ASA · 30% TRIANGULAR'
  },
  cf_petg: {
    name: 'Carbon Fiber Reinforced PETG',
    badge: 'Aerospace Grade',
    desc: '15% chopped carbon fibers for ultimate stiffness, zero flex, and a gorgeous matte textured surface finish.',
    costMultiplier: 1.65,
    weightMultiplier: 1.05,
    density: '1.30 g/cm³',
    temp: '85°C (185°F)',
    infill: '30% Honeycomb',
    // Material-specific physical shape adaptations:
    shapeProfileName: 'Octagonal Chamfer & Truss Grid',
    shapeProfileDesc: '45-degree chamfered octagonal tile trusses with carbon micro-weave stippling and reinforced hex brackets.',
    filletRadius: 6,
    isOctagon: true,
    slotStyle: 'hex_truss',
    bracketStyle: 'hex_gusset',
    depth3D: 1.5,
    roughness: 0.94,
    metalness: 0.20,
    infillWatermark: 'CF-PETG · 30% HONEYCOMB'
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

    // Interactive Tour State
    this.tourActive = false;
    this.tourAutoPlay = false;
    this.currentTourStepIndex = 0;
    this.tourTimer = null;
    this._toastTimer = null;

    this.init();
  }

  init() {
    // 1. Start with a completely clean blank board by default so customer has an unblocked view
    this.state.placedAccessories = [];
    this.state.cols = 4;
    this.state.rows = 3;
    this.state.panelColor = '#303947';
    this.state.accessoryColor = '#f97316';
    this.state.material = 'petg';
    this.state.activeTiles = {};

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
    this.updateMaterialUI();

    // 5. Initial sync
    this.canvas2d.setState(this.state);
    this.viewer3d.updateBoard(this.state);
    this.updateCostAndStats();

    // 6. Check URL hash for shared design
    this.loadFromUrlHash();
  }

  setMaterial(materialKey) {
    if (!MATERIALS[materialKey]) return;
    this.state.material = materialKey;
    this.updateMaterialUI();
    this.syncBoard();
  }

  updateMaterialUI() {
    const mat = MATERIALS[this.state.material] || MATERIALS.petg;

    // Update Material Cards in left sidebar
    document.querySelectorAll('.material-card').forEach(card => {
      const isSelected = (card.dataset.material === this.state.material);
      const checkEl = card.querySelector('.selected-check-badge');
      if (isSelected) {
        card.className = 'material-card border-2 border-orange-500 ring-2 ring-orange-500/30 bg-orange-500/15 rounded-xl p-2.5 cursor-pointer transition-all shadow-lg shadow-orange-500/10 scale-[1.02] relative';
        if (checkEl) checkEl.classList.remove('hidden');
      } else {
        card.className = 'material-card border border-slate-700/80 bg-slate-800/40 rounded-xl p-2.5 cursor-pointer hover:border-slate-600 transition-all opacity-80 hover:opacity-100 scale-100 relative';
        if (checkEl) checkEl.classList.add('hidden');
      }
    });

    // Update Live Shape Profile Banner on Canvas Top Bar
    const profileNameEl = document.getElementById('active-material-profile-name');
    if (profileNameEl) profileNameEl.innerText = `${mat.name} · ${mat.shapeProfileName}`;

    // Update summary panels
    const summaryMatEl = document.getElementById('summary-material');
    if (summaryMatEl) summaryMatEl.innerText = mat.name;
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
        this.setMaterial(card.dataset.material);
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

    // 9. Quick Actions & Tools Board Toggles
    document.getElementById('clear-board-btn')?.addEventListener('click', () => {
      this.canvas2d.clearAllAccessories();
      if (this.viewer3d) this.viewer3d.updateAccessories(this.state);
    });

    document.getElementById('blank-canvas-btn')?.addEventListener('click', () => {
      this.canvas2d.clearAllAccessories();
      if (this.viewer3d) this.viewer3d.updateAccessories(this.state);
    });

    document.getElementById('load-sample-tools-btn')?.addEventListener('click', () => {
      this.loadPrototypePreset();
      this.syncBoard();
    });

    document.getElementById('reset-preset-btn')?.addEventListener('click', () => {
      this.loadPrototypePreset();
      this.syncBoard();
    });

    // Auto-organize button
    document.getElementById('auto-organize-btn')?.addEventListener('click', () => {
      this.autoOrganizeTools();
    });

    // 10. Interactive Guided Tour Triggers & Controls
    document.getElementById('start-tour-btn')?.addEventListener('click', () => {
      this.startInteractiveTour();
    });
    document.getElementById('tour-next-btn')?.addEventListener('click', () => {
      this.nextTourStep();
    });
    document.getElementById('tour-prev-btn')?.addEventListener('click', () => {
      this.prevTourStep();
    });
    document.getElementById('tour-skip-btn')?.addEventListener('click', () => {
      this.stopTour();
    });
    document.getElementById('tour-auto-btn')?.addEventListener('click', () => {
      this.toggleTourAutoPlay();
    });

    window.addEventListener('resize', () => {
      if (this.tourActive) {
        this.positionTourSpotlight();
      }
    });

    // 11. Modals
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

  // ================= SMART AUTO-ORGANIZE ENGINE =================
  autoOrganizeTools() {
    const tools = this.state.placedAccessories || [];

    if (tools.length === 0) {
      // Board was empty: auto-populate a complete, ergonomically-organized workshop layout!
      if (this.state.cols >= 4) {
        this.state.placedAccessories = [
          // Top row: Hand & Utility Tools (relY: 0.16)
          { id: 'acc_org_1', type: 'spray_can_holder', relX: 0.12, relY: 0.16 },
          { id: 'acc_org_2', type: 'pliers_holder', relX: 0.24, relY: 0.16 },
          { id: 'acc_org_3', type: 'hammer_mount', relX: 0.36, relY: 0.16 },
          { id: 'acc_org_4', type: 'screwdriver_rack', relX: 0.48, relY: 0.16 },
          { id: 'acc_org_5', type: 'tape_holder', relX: 0.60, relY: 0.20 },
          { id: 'acc_org_6', type: 'pen_cup', relX: 0.72, relY: 0.16 },

          // Middle row: Heavy & Power Tools (relY: 0.48)
          { id: 'acc_org_7', type: 'wrench_rack', relX: 0.18, relY: 0.48 },
          { id: 'acc_org_8', type: 'screwdriver_rack', relX: 0.36, relY: 0.44 },
          { id: 'acc_org_9', type: 'drill_mount', relX: 0.54, relY: 0.46 },
          { id: 'acc_org_10', type: 'large_shelf', relX: 0.72, relY: 0.50 },

          // Right column: Stacked Hardware Bins (relX: 0.88)
          { id: 'acc_org_11', type: 'storage_bin', relX: 0.88, relY: 0.28 },
          { id: 'acc_org_12', type: 'storage_bin', relX: 0.88, relY: 0.45 },
          { id: 'acc_org_13', type: 'storage_bin', relX: 0.88, relY: 0.62 },
          { id: 'acc_org_14', type: 'storage_bin', relX: 0.88, relY: 0.79 },

          // Bottom row: High Capacity Storage Trays (relY: 0.82)
          { id: 'acc_org_15', type: 'bottom_drawer', relX: 0.22, relY: 0.82 },
          { id: 'acc_org_16', type: 'bottom_drawer', relX: 0.48, relY: 0.82 },
          { id: 'acc_org_17', type: 'large_shelf', relX: 0.70, relY: 0.76 }
        ];
      } else {
        // Compact grid (2 or 3 cols)
        this.state.placedAccessories = [
          { id: 'acc_c_1', type: 'spray_can_holder', relX: 0.20, relY: 0.18 },
          { id: 'acc_c_2', type: 'screwdriver_rack', relX: 0.50, relY: 0.18 },
          { id: 'acc_c_3', type: 'pen_cup', relX: 0.80, relY: 0.18 },
          { id: 'acc_c_4', type: 'drill_mount', relX: 0.28, relY: 0.52 },
          { id: 'acc_c_5', type: 'wrench_rack', relX: 0.62, relY: 0.52 },
          { id: 'acc_c_6', type: 'storage_bin', relX: 0.88, relY: 0.48 },
          { id: 'acc_c_7', type: 'storage_bin', relX: 0.88, relY: 0.74 },
          { id: 'acc_c_8', type: 'large_shelf', relX: 0.38, relY: 0.82 }
        ];
      }
    } else {
      // Existing tools: sort and position them neatly into ergonomic workshop zones
      const topTools = [];
      const midTools = [];
      const bins = [];
      const drawers = [];

      tools.forEach(tool => {
        if (tool.type === 'storage_bin') {
          bins.push(tool);
        } else if (tool.type === 'bottom_drawer') {
          drawers.push(tool);
        } else if (['drill_mount', 'wrench_rack', 'large_shelf', 't_handle_rack'].includes(tool.type)) {
          midTools.push(tool);
        } else {
          topTools.push(tool);
        }
      });

      // Distribute top tools evenly across top tier
      const topCount = topTools.length;
      topTools.forEach((t, i) => {
        const step = 0.72 / Math.max(topCount, 1);
        t.relX = Math.round((0.12 + (i + 0.5) * step) * 100) / 100;
        t.relY = 0.16;
      });

      // Distribute middle heavy tools across middle tier
      const midCount = midTools.length;
      midTools.forEach((t, i) => {
        const step = 0.68 / Math.max(midCount, 1);
        t.relX = Math.round((0.14 + (i + 0.5) * step) * 100) / 100;
        t.relY = 0.50;
      });

      // Stack bins vertically on the right side
      bins.forEach((t, i) => {
        t.relX = 0.88;
        t.relY = Math.min(0.85, Math.round((0.26 + i * 0.16) * 100) / 100);
      });

      // Bottom drawers spaced along lower tier
      const drawerCount = drawers.length;
      drawers.forEach((t, i) => {
        const step = 0.65 / Math.max(drawerCount, 1);
        t.relX = Math.round((0.20 + (i + 0.5) * step) * 100) / 100;
        t.relY = 0.84;
      });

      this.state.placedAccessories = [...topTools, ...midTools, ...bins, ...drawers];
    }

    this.syncBoard();
    this.showNotification('✨ Smart Auto-Organize: Tools aligned to ergonomic workshop zones!');
  }

  showNotification(message, duration = 3200) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-xl bg-slate-900/95 border border-orange-500/60 shadow-2xl backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 pointer-events-none transition-all duration-300 opacity-0 -translate-y-2';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span>${message}</span>`;
    toast.classList.remove('opacity-0', '-translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', '-translate-y-2');
    }, duration);
  }

  // ================= INTERACTIVE GUIDED TOUR ENGINE =================
  getTourSteps() {
    return [
      {
        id: 'welcome',
        targetId: 'studio-canvas-container',
        title: 'Welcome to OmniWall 3D!',
        desc: 'This interactive university graduation project allows clients to customize modular 3D-printed workshop pegboard walls. Watch this automated demo as it configures sizes, materials, tools, and auto-organizes live!',
        actionText: 'Initializing interactive studio...',
        execute: () => {
          document.getElementById('view-2d-btn')?.click();
          document.getElementById('quote-modal')?.classList.add('hidden');
        }
      },
      {
        id: 'dimensions',
        targetId: 'grid-cols',
        fallbackTarget: 'preset-grid',
        title: '1. Wall Dimensions & Modular Grid',
        desc: 'Choose how many interlocking tiles you need for your space. Watch as the configurator automatically resizes to a 4×3 multi-panel setup (80×60 cm)!',
        actionText: 'Resizing modular grid to 4×3 panels...',
        execute: () => {
          this.state.cols = 4;
          this.state.rows = 3;
          const colSlider = document.getElementById('grid-cols');
          const rowSlider = document.getElementById('grid-rows');
          const colVal = document.getElementById('col-val');
          const rowVal = document.getElementById('row-val');
          if (colSlider) colSlider.value = 4;
          if (rowSlider) rowSlider.value = 3;
          if (colVal) colVal.innerText = '4 cols';
          if (rowVal) rowVal.innerText = '3 rows';
          this.syncBoard();
        }
      },
      {
        id: 'materials',
        targetSelector: '.material-card[data-material="cf_petg"]',
        fallbackTarget: 'material-options-container',
        title: '2. Material-Driven Shape Changes',
        desc: 'Each 3D printing filament has custom physical properties. Notice how selecting "Carbon Fiber PETG" alters the physical tile geometry—adding 45° octagonal chamfers, carbon weave stippling, and reinforced brackets!',
        actionText: 'Selecting Carbon Fiber PETG & transforming tile shape...',
        execute: () => {
          this.setMaterial('cf_petg');
        }
      },
      {
        id: 'colors',
        targetId: 'panel-colors',
        title: '3. Custom Filament Colors',
        desc: 'Personalize the color palette to match your workshop tools or school colors. Watch the wall update in real-time to Industrial Charcoal & Safety Orange!',
        actionText: 'Applying custom color scheme...',
        execute: () => {
          this.state.panelColor = '#303947';
          this.state.accessoryColor = '#ea580c';
          this.syncBoard();
        }
      },
      {
        id: 'tools',
        targetId: 'accessories-list',
        title: '4. Modular 3D Tool Catalog',
        desc: 'Clients can choose from real 3D-printable mounts: drill cradles, wrench spanner rails, hammer hooks, and hardware bins. Let\'s place initial tools onto the board!',
        actionText: 'Adding workshop tools to the board...',
        execute: () => {
          this.state.placedAccessories = [
            { id: 'acc_demo_1', type: 'drill_mount', relX: 0.70, relY: 0.25 },
            { id: 'acc_demo_2', type: 'wrench_rack', relX: 0.25, relY: 0.65 },
            { id: 'acc_demo_3', type: 'screwdriver_rack', relX: 0.35, relY: 0.20 },
            { id: 'acc_demo_4', type: 'storage_bin', relX: 0.82, relY: 0.75 },
            { id: 'acc_demo_5', type: 'hammer_mount', relX: 0.50, relY: 0.60 }
          ];
          this.syncBoard();
        }
      },
      {
        id: 'auto_organize',
        targetId: 'auto-organize-btn',
        title: '5. Smart Auto-Organize Tool',
        desc: 'No manual aligning needed! Clicking "Auto-Organize" instantly organizes all your tools into ergonomic zones: hand tools up top, heavy power tools centered, and stacked bins on the right!',
        actionText: 'Running ergonomic auto-organization algorithm...',
        execute: () => {
          this.autoOrganizeTools();
        }
      },
      {
        id: 'view_3d',
        targetId: 'view-3d-btn',
        title: '6. Interactive 3D WebGL Inspector',
        desc: 'Switch seamlessly to 3D mode! Inspect the physical 3D wall with realistic filament sheen, layer lines, depth, and mounting brackets. The camera rotates automatically.',
        actionText: 'Switching to 3D WebGL mode & rotating camera...',
        execute: () => {
          document.getElementById('view-3d-btn')?.click();
          if (this.viewer3d && this.viewer3d.controls) {
            this.viewer3d.controls.autoRotate = true;
            this.viewer3d.controls.autoRotateSpeed = 5.0;
          }
        }
      },
      {
        id: 'quote',
        targetId: 'open-quote-modal-btn-2',
        fallbackTarget: 'open-quote-modal-btn',
        title: '7. Live Cost, Weight & Print Quotation',
        desc: 'Instant engineering Bill of Materials with exact filament weights (grams), 3D print hours, and total price in EGP or USD. Let\'s generate the official university project quote!',
        actionText: 'Generating formal Bill of Materials quote...',
        execute: () => {
          document.getElementById('view-2d-btn')?.click();
          if (this.viewer3d && this.viewer3d.controls) {
            this.viewer3d.controls.autoRotate = false;
          }
          this.populateQuoteModal();
          document.getElementById('quote-modal')?.classList.remove('hidden');
        }
      },
      {
        id: 'finish',
        targetId: 'studio-canvas-container',
        title: 'Ready to Build Your Own!',
        desc: 'You\'ve seen how everything works! You can now freely place tools, change materials, inspect in 3D, or share your custom design link with anyone.',
        actionText: 'Tour complete! Enjoy designing.',
        execute: () => {
          document.getElementById('quote-modal')?.classList.add('hidden');
        }
      }
    ];
  }

  startInteractiveTour() {
    this.tourActive = true;
    this.tourAutoPlay = true;
    this.currentTourStepIndex = 0;

    const autoBtn = document.getElementById('tour-auto-btn');
    if (autoBtn) {
      autoBtn.innerHTML = `<i data-lucide="pause" class="w-3 h-3 text-amber-400"></i><span id="tour-auto-label">Pause</span>`;
      if (window.lucide) window.lucide.createIcons({ root: autoBtn });
    }

    this.renderTourStep();
  }

  renderTourStep() {
    const steps = this.getTourSteps();
    const step = steps[this.currentTourStepIndex];
    if (!step) {
      this.stopTour();
      return;
    }

    // Step counter
    const counterEl = document.getElementById('tour-step-counter');
    if (counterEl) counterEl.innerText = `Step ${this.currentTourStepIndex + 1} of ${steps.length}`;

    // Title & description
    const titleEl = document.getElementById('tour-title');
    if (titleEl) titleEl.innerText = step.title;

    const descEl = document.getElementById('tour-desc');
    if (descEl) descEl.innerText = step.desc;

    // Simulated action feedback pill
    const feedbackEl = document.getElementById('tour-action-feedback');
    const actionTextEl = document.getElementById('tour-action-text');
    if (feedbackEl && actionTextEl) {
      if (step.actionText) {
        feedbackEl.classList.remove('hidden');
        actionTextEl.innerText = step.actionText;
      } else {
        feedbackEl.classList.add('hidden');
      }
    }

    // Prev button visibility
    const prevBtn = document.getElementById('tour-prev-btn');
    if (prevBtn) {
      prevBtn.style.display = (this.currentTourStepIndex === 0) ? 'none' : 'block';
    }

    // Next button label
    const nextBtn = document.getElementById('tour-next-btn');
    if (nextBtn) {
      if (this.currentTourStepIndex === steps.length - 1) {
        nextBtn.innerHTML = `<span>Finish</span><i data-lucide="check" class="w-3.5 h-3.5"></i>`;
      } else {
        nextBtn.innerHTML = `<span>Next</span><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>`;
      }
      if (window.lucide) window.lucide.createIcons({ root: nextBtn });
    }

    // Execute step simulation
    try {
      step.execute();
    } catch (err) {
      console.error('Error executing tour step:', err);
    }

    // Reposition spotlight ring & floating card
    this.positionTourSpotlight();

    // Auto-advance if auto play is active
    if (this.tourAutoPlay) {
      if (this.tourTimer) clearTimeout(this.tourTimer);
      if (this.currentTourStepIndex < steps.length - 1) {
        this.tourTimer = setTimeout(() => {
          if (this.tourActive && this.tourAutoPlay) {
            this.nextTourStep();
          }
        }, 4200);
      } else {
        this.tourTimer = setTimeout(() => {
          if (this.tourActive && this.tourAutoPlay) {
            this.stopTour();
          }
        }, 5000);
      }
    }
  }

  nextTourStep() {
    const steps = this.getTourSteps();
    if (this.currentTourStepIndex < steps.length - 1) {
      this.currentTourStepIndex++;
      this.renderTourStep();
    } else {
      this.stopTour();
    }
  }

  prevTourStep() {
    if (this.currentTourStepIndex > 0) {
      this.currentTourStepIndex--;
      this.renderTourStep();
    }
  }

  toggleTourAutoPlay() {
    this.tourAutoPlay = !this.tourAutoPlay;
    const btn = document.getElementById('tour-auto-btn');
    if (this.tourAutoPlay) {
      if (btn) btn.innerHTML = `<i data-lucide="pause" class="w-3 h-3 text-amber-400"></i><span id="tour-auto-label">Pause</span>`;
      this.renderTourStep();
    } else {
      if (this.tourTimer) clearTimeout(this.tourTimer);
      if (btn) btn.innerHTML = `<i data-lucide="play" class="w-3 h-3 text-emerald-400"></i><span id="tour-auto-label">Auto-Play</span>`;
    }
    if (window.lucide && btn) window.lucide.createIcons({ root: btn });
  }

  stopTour() {
    this.tourActive = false;
    if (this.tourTimer) clearTimeout(this.tourTimer);

    document.getElementById('tour-spotlight')?.classList.add('hidden');
    document.getElementById('tour-arrow')?.classList.add('hidden');
    document.getElementById('tour-card')?.classList.add('hidden');
    document.getElementById('quote-modal')?.classList.add('hidden');

    if (this.viewer3d && this.viewer3d.controls) {
      this.viewer3d.controls.autoRotate = false;
    }
    document.getElementById('view-2d-btn')?.click();

    this.showNotification('🎉 Interactive tour completed! Start customizing your wall.');
  }

  positionTourSpotlight() {
    if (!this.tourActive) return;
    const step = this.getTourSteps()[this.currentTourStepIndex];
    if (!step) return;

    let el = null;
    if (step.targetSelector) {
      el = document.querySelector(step.targetSelector);
    }
    if (!el && step.targetId) {
      el = document.getElementById(step.targetId);
    }
    if (!el && step.fallbackTarget) {
      el = document.getElementById(step.fallbackTarget);
    }
    if (!el) {
      el = document.getElementById('studio-canvas-container') || document.body;
    }

    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    } catch (e) {}

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const spotlight = document.getElementById('tour-spotlight');
      const arrow = document.getElementById('tour-arrow');
      const card = document.getElementById('tour-card');

      if (!spotlight || !arrow || !card) return;

      spotlight.classList.remove('hidden');
      arrow.classList.remove('hidden');
      card.classList.remove('hidden');

      const pad = 14;
      const w = Math.max(rect.width + pad * 2, 54);
      const h = Math.max(rect.height + pad * 2, 54);
      const left = Math.max(rect.left - pad, 6);
      const top = Math.max(rect.top - pad, 6);

      spotlight.style.width = `${w}px`;
      spotlight.style.height = `${h}px`;
      spotlight.style.left = `${left}px`;
      spotlight.style.top = `${top}px`;
      spotlight.style.borderRadius = (w / h > 1.8 || h / w > 1.8) ? '18px' : '9999px';

      // Position arrow
      const arrowX = rect.left + rect.width / 2 - 18;
      let arrowY = rect.top - 46;
      if (arrowY < 12) {
        arrowY = rect.bottom + 12;
        arrow.innerHTML = '<i data-lucide="arrow-up-circle" class="w-9 h-9 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]"></i>';
      } else {
        arrow.innerHTML = '<i data-lucide="arrow-down-circle" class="w-9 h-9 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]"></i>';
      }
      if (window.lucide) window.lucide.createIcons({ root: arrow });

      arrow.style.left = `${Math.max(10, Math.min(window.innerWidth - 46, arrowX))}px`;
      arrow.style.top = `${arrowY}px`;

      // Position tour dialog card smartly
      const cardWidth = Math.min(window.innerWidth - 28, 380);
      const cardHeight = card.offsetHeight || 230;

      let cardLeft = rect.left + rect.width / 2 - cardWidth / 2;
      if (rect.left < 360 && window.innerWidth > 800) {
        cardLeft = rect.right + 24;
      } else if (rect.right > window.innerWidth - 380 && window.innerWidth > 800) {
        cardLeft = rect.left - cardWidth - 24;
      }

      let cardTop = rect.bottom + 20;
      if (cardTop + cardHeight > window.innerHeight - 16) {
        cardTop = rect.top - cardHeight - 20;
      }

      cardLeft = Math.max(14, Math.min(window.innerWidth - cardWidth - 14, cardLeft));
      cardTop = Math.max(14, Math.min(window.innerHeight - cardHeight - 14, cardTop));

      card.style.left = `${cardLeft}px`;
      card.style.top = `${cardTop}px`;
    }, 120);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new OmniWallApp();
});
