# OmniWall 3D — Modular 3D-Printed Workshop Wall Configurator 🛠️🖨️
> **University Graduation Project** &bull; Faculty of Engineering  
> Advanced Additive Manufacturing & Rapid Product Customization Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=flat&logo=three.js)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Free Hosting](https://img.shields.io/badge/Hosting-GitHub_Pages_100%25_FREE-success)](https://pages.github.com/)

---

## 📌 Project Overview
**OmniWall 3D** is an interactive web-based product configurator designed for an engineering graduation project. Customers and workshop technicians can custom-configure an interlocking 3D-printed modular pegboard system tailored to their workshop dimensions, tool collection, filament material requirements, and budget.

The system dynamically models **filament consumption (grams)**, **additive manufacturing print runtime (hours)**, and **real-time pricing** (supporting **EGP**, **USD**, and **EUR**), before exporting an itemized Bill of Materials (BOM) and quote.

---

## ✨ Key Features

### 1. 🎛️ Dual-Mode Interactive Visualization
* **2D Studio Canvas**: Drag-and-drop tool mounts, automatic slot-snapping, click-to-delete, and rotation controls.
* **3D Orbit Inspector (Three.js WebGL)**: 360° rotation, zoom, realistic lighting, cast shadows, modular dovetail connector brackets, and simulated layer texture.

### 2. 📏 Modular Sizing & Custom Shapes
* Choose standard grid dimensions (e.g. 4×3, 3×2, 2×2, 5×3).
* **Interactive Shape Planner**: Click any individual tile to toggle it ON or OFF to fit around workshop outlets, conduits, or awkward corners (L-Shape, Inverted-T, Stair-stepped).
* Standard modular tile unit: `20 × 20 cm` (compatible with 220×220mm printer beds like Bambu Lab, Creality, and Prusa).

### 3. 🛠️ Comprehensive Tool Catalog (Modeled directly from physical prototype)
* **Power Tool Mounts**: Cordless Drill / Impact Driver Cradles, Angle Grinder & Circular Saw Shelves.
* **Hand Tool Racks**: Precision Wrench Rails (5 sizes), 6-Slot Screwdriver Arrays, Dual Hammer & Mallet Hooks, Pliers Holsters, T-Handle Socket Key Grippers.
* **Storage & Hardware**: Open-front Stackable Hardware Bins (screws/bolts), Wide Bottom Storage Drawer, Dual Spray Can / Lubricant Holsters, Masking Tape Spool, Markers & Zip-Tie Cup.

### 4. 🧵 Engineering Material Selector
* **PETG Pro (Recommended)**: High impact toughness, chemical/oil resistance, 75°C temperature threshold.
* **PLA+ Tough**: High flexural rigidity, sharp layer aesthetic, eco-friendly biopolymer.
* **ABS / ASA Industrial**: High heat threshold (95°C), UV-resistant for outdoor sheds.
* **Carbon Fiber PETG**: 15% chopped carbon fiber micro-fill, zero flex, matte industrial micro-texture.

### 5. 🎨 Two-Tone Styling & Filament Colors
* Independent color selection for **Wall Tiles** (Matte Slate Gray, Stealth Black, Industrial Orange, Arctic White, Navy) and **Accessory Mounts** (Hazard Orange, Ferrari Red, Cyber Yellow, Cyan).
* Integrated custom HEX color picker for any specific spool.

### 6. 💰 Real-Time Cost & Print Runtime Engine
* Computes filament weight in grams based on solid volume and infill density (25% gyroid infill).
* Projects total 3D printer machine run time (hours).
* Live currency toggle: **USD ($)**, **EGP (ج.م)**, and **EUR (€)**.
* Fastening hardware pack (M4 bolts, corner joint brackets, wall anchors) included free.

### 7. 📄 Official Customer Quotation & Ordering
* **Printable Bill of Materials (BOM)**: Generates a branded quotation sheet with unique Order Ref ID, itemized quantities, and unit pricing. Ready to save as PDF.
* **WhatsApp Direct Order Link**: Pre-fills customer specifications and design URL for instant messaging to the graduation project team.
* **Shareable URL Configuration**: Encodes design parameters in the browser URL hash for instant sharing.
* **Physical Prototype Showcase**: Embedded high-resolution photo comparing the physical 3D print to the interactive visualizer.

---

## 🚀 How to Make This Website Online for FREE (Step-by-Step)

You do **NOT** need to pay for any hosting or domain. You can publish this directly to the web using **GitHub Pages** for 100% free with a permanent link.

### 🌐 Method 1: Using GitHub Web Browser (No Git installation needed!)
1. Go to [https://github.com](https://github.com) and log in (or create a free account).
2. Click the **`+`** icon in the top right corner and choose **"New repository"**.
3. Name your repository (for example: `omniwall-3d` or `graduation-project`).
4. Set visibility to **Public** and click **"Create repository"**.
5. On the next screen, click the link that says **`uploading an existing file`**.
6. Select and drag all files from your project folder (`d:\grad project`):
   - `index.html`
   - `start_server.bat`
   - `README.md`
   - `.gitignore`
   - The entire `assets/` folder (including `assets/css/`, `assets/js/`, and `assets/images/`)
7. Click **"Commit changes"**.
8. In your GitHub repository:
   - Click the **"Settings"** tab at the top.
   - On the left sidebar, click **"Pages"**.
   - Under **"Build and deployment" > "Branch"**, choose `main` (or `master`) and folder `/(root)`.
   - Click **"Save"**.
9. Wait 30–60 seconds, then refresh the page.
10. GitHub will provide your live public URL:
    ```
    https://<your-username>.github.io/<repo-name>/
    ```
    Anyone in the world can now open this link on their phone, tablet, or laptop!

---

### 💻 Method 2: Using the Included Setup Script (If Git is installed)
If you have Git installed on your computer:
1. Double-click `setup_github.bat` in this folder.
2. Paste your GitHub repository URL when prompted.
3. The script will automatically commit and push all files to GitHub `main` branch.
4. Follow Step 8 above to enable GitHub Pages in Settings!

---

### ⚡ Method 3: Instant 30-Second Drag-and-Drop (Vercel or Netlify)
If you want an instant link without using GitHub:
1. Open [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `d:\grad project` folder into the browser window.
3. Your interactive website is live instantly with an SSL HTTPS link!

---

## 💻 How to Test & Run Locally on Your Computer
To run and test the website on your own machine without internet hosting:

1. **Option A (One-Click Server)**:
   - Double-click `start_server.bat` in this directory.
   - It will start a local server and automatically open `http://localhost:8080` in your default browser.

2. **Option B (Direct Browser File)**:
   - Simply double-click `index.html` to open it in Chrome, Edge, or Firefox.

---

## 📁 Project Directory Structure
```text
d:\grad project\
│
├── index.html                     # Main application layout & modals
├── start_server.bat               # One-click Windows launcher
├── start_server.ps1               # Lightweight .NET local HTTP server
├── setup_github.bat               # Automated Git repository push helper
├── .gitignore                     # Git ignore rules
├── README.md                      # Documentation & deployment guide
│
└── assets\
    ├── css\
    │   └── style.css              # Custom styling, glassmorphism & print CSS
    ├── js\
    │   ├── app.js                 # App state, pricing engine, BOM & event logic
    │   ├── canvas2d.js            # 2D Interactive drag-and-drop studio
    │   └── viewer3d.js            # Three.js 3D WebGL orbit inspector
    └── images\
        └── reference_board.jpg    # Physical prototype test build photo
```

---

## 🔧 How to Customize (Add Tools, Photos & Details Later)

### 1. Adding More Tool Mounts / Accessories
Open [assets/js/app.js](file:///d:/grad%20project/assets/js/app.js) and locate the `ACCESSORY_CATALOG` array at the top. You can add any new tool by adding an object:
```javascript
{
  id: 'caliper_holder',
  name: 'Digital Caliper Mount',
  category: 'hand',
  badge: 'Precision',
  desc: 'Vertical cradle for 150mm digital vernier calipers.',
  weightGrams: 35,
  printHours: 1.1,
  basePriceUSD: 3.00,
  icon: 'ruler'
}
```

### 2. Adding More Physical Photos
1. Place your new photos inside `assets/images/`.
2. Open [index.html](file:///d:/grad%20project/index.html) and locate the `<!-- 2. REAL PROTOTYPE PHOTO & PROJECT SHOWCASE MODAL -->` section.
3. Add `<img>` tags pointing to your new photo paths (e.g. `assets/images/photo2.jpg`).

### 3. Adjusting Filament Prices or Print Rates
In [assets/js/app.js](file:///d:/grad%20project/assets/js/app.js), locate `calculateStats()`. You can adjust:
* `basePanelWeightG` (default: 185g)
* `basePanelPrintHours` (default: 4.2 hours)
* `basePanelCostUSD` (default: $8.00 per tile)
* Currency exchange rate in `CURRENCIES` (e.g. `EGP: 50.0`)

---

## 🎓 Academic Project Credit
* **Project**: Modular Additive Tool Wall System
* **Department**: Faculty of Engineering
* **Specialization**: Additive Manufacturing, Product Customization & Web Systems
* **Year**: 2026
