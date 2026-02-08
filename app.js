const treeWrap = document.getElementById("tree-wrap");
const treeZoom = document.getElementById("tree-zoom");
const treeCanvas = document.getElementById("tree-canvas");
const treeStatus = document.getElementById("tree-status");
const treeLines = document.getElementById("tree-lines");
const minimapCanvas = document.getElementById("minimap-canvas");
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const searchGoBtn = document.getElementById("search-go");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");
const resetViewBtn = document.getElementById("reset-view");
const toggleThemeBtn = document.getElementById("toggle-theme");
const exportPngBtn = document.getElementById("export-png");
const exportPdfBtn = document.getElementById("export-pdf");
const exportJsonBtn = document.getElementById("export-json");
const importJsonBtn = document.getElementById("import-json");
const importJsonFile = document.getElementById("import-json-file");
const validateDataBtn = document.getElementById("validate-data");
const validateOutput = document.getElementById("validate-output");
const modal = document.getElementById("person-modal");
const modalBody = document.getElementById("modal-body");
const app = document.getElementById("app");
const controlsToggleBtn = document.getElementById("controls-toggle");
const generationControls = document.getElementById("generation-controls");
const branchFilter = document.getElementById("branch-filter");
const viewToggle = document.getElementById("view-toggle");
const storyPanel = document.getElementById("story-panel");
const storyTitle = document.getElementById("story-title");
const storyBody = document.getElementById("story-body");
const storyContent = document.getElementById("story-content");
const panelEditBtn = document.getElementById("panel-edit");
const panelDeleteBtn = document.getElementById("panel-delete");
const panelCloseBtn = document.getElementById("panel-close");
const panelEditForm = document.getElementById("panel-edit-form");
const panelCancelBtn = document.getElementById("panel-cancel");
const panelEditName = document.getElementById("panel-edit-name");
const panelEditFirst = document.getElementById("panel-edit-first");
const panelEditLast = document.getElementById("panel-edit-last");
const panelGenderInputs = document.querySelectorAll('input[name="panel-gender"]');
const panelEditRelation = document.getElementById("panel-edit-relation");
const panelEditBirth = document.getElementById("panel-edit-birth");
const panelEditDeath = document.getElementById("panel-edit-death");
const panelEditPhoto = document.getElementById("panel-edit-photo");
const panelEditPhotoFile = document.getElementById("panel-edit-photo-file");
const panelEditNote = document.getElementById("panel-edit-note");
const panelEditStory = document.getElementById("panel-edit-story");
const timelineSection = document.getElementById("timeline-section");
const timelineList = document.getElementById("timeline-list");
const editorToggle = document.getElementById("editor-toggle");
const editorPanel = document.getElementById("editor-panel");
const editorPerson = document.getElementById("editor-person");
const editorName = document.getElementById("editor-name");
const editorRelation = document.getElementById("editor-relation");
const editorBirth = document.getElementById("editor-birth");
const editorDeath = document.getElementById("editor-death");
const editorPhoto = document.getElementById("editor-photo");
const editorPhotoFile = document.getElementById("editor-photo-file");
const editorNote = document.getElementById("editor-note");
const editorStory = document.getElementById("editor-story");
const editorParent = document.getElementById("editor-parent");
const editorPartner = document.getElementById("editor-partner");
const editorSave = document.getElementById("editor-save");
const editorAdd = document.getElementById("editor-add");
const editorLinkPartner = document.getElementById("editor-link-partner");
const editorDelete = document.getElementById("editor-delete");
const zoomFitBtn = document.getElementById("zoom-fit");
const focusEldersBtn = document.getElementById("focus-elders");
const backTopBtn = document.getElementById("back-top");
const pathToggleBtn = document.getElementById("path-toggle");
const compactToggleBtn = document.getElementById("compact-toggle");
const langToggleBtn = document.getElementById("lang-toggle");
const clearCacheBtn = document.getElementById("clear-cache");
const mobileActionSelect = document.getElementById("mobile-action");
const mobileActionLabel = document.getElementById("mobile-action-label");
const mobileActionGo = document.getElementById("mobile-action-go");
const mobileQuickZoomIn = document.getElementById("m-zoom-in");
const mobileQuickZoomOut = document.getElementById("m-zoom-out");
const mobileQuickZoomFit = document.getElementById("m-zoom-fit");

const layoutConfig = {
  cardWidth: 220,
  cardGap: 16,
  hGap: 40,
  vGap: 180,
  topPadding: 10,
  leftPadding: 20,
  labelColumnWidth: 120
};

const branchPalette = ["#4f8a6a", "#8bb8d4", "#c49b6c", "#c47a7a", "#6f8ac4", "#8a6cc4", "#6cc4a1"];
const BRANCH_FILTER_ENABLED = false;
const GENERATION_FILTER_ENABLED = true;
const SOFT_PEACH_ROOT_ID = "p3";
const SOFT_PEACH_COLOR = "var(--soft-peach)";
const BABY_BLUE_ROOT_ID = "p5";
const BABY_BLUE_COLOR = "var(--baby-blue)";
const MINT_GREEN_ROOT_ID = "p7";
const MINT_GREEN_COLOR = "var(--mint-green)";
const LAVENDER_ROOT_ID = "p9";
const LAVENDER_COLOR = "var(--lavender)";
const VIRTUALIZE_THRESHOLD = 1000000;
const STORAGE_KEY = "familyTreePrefs";
const DATA_KEY = "familyTreeData";
const FORCE_RESET = false;
const PWA_CLEANUP_KEY = "pwa_cleanup_done";

let treeData = null;
let peopleById = new Map();
let layoutRoot = null;
let nodesList = [];
let maxDepth = 0;
let scale = 1;
let baseSize = { width: 0, height: 0 };
let elementByPersonId = new Map();
let elementByNodeId = new Map();
let nodeByPersonId = new Map();
let hiddenGenerations = new Set();
let virtualizationEnabled = false;
let renderQueued = false;
let lastSearchResults = [];
let selectedPersonId = "";
let viewMode = "tree";
let branchFilterValue = "all";
let softPeachPeople = new Set();
let babyBluePeople = new Set();
let mintGreenPeople = new Set();
let lavenderPeople = new Set();
let forceFreshData = false;
let recoveryAttempted = false;
let lang = "ms";
let compactMode = false;
let pathMode = false;
let controlsCollapsed = false;

const prefs = loadPrefs();
const i18n = {
  ms: {
    appKicker: "Salasilah Keluarga",
    appTitle: "Paparan Generasi Keluarga",
    appSubtitle: "Semua ahli keluarga dalam satu pandangan yang jelas, mudah, dan mesra.",
    searchLabel: "Carian nama",
    searchGo: "Cari & Fokus",
    viewTimeline: "Lihat Timeline",
    viewTree: "Lihat Tree",
    compactOn: "Mode Penuh",
    compactOff: "Mode Ringkas",
    pathOn: "Sembunyi Laluan",
    pathOff: "Laluan Saya",
    focusElders: "Fokus Tok/Wan",
    backTop: "Kembali Atas",
    fit: "Fit Skrin",
    zoomIn: "Zoom +",
    zoomOut: "Zoom -",
    zoomReset: "Reset",
    themeToggle: "Cerah / Gelap",
    langToggle: "BM / EN",
    exportPng: "Export PNG",
    exportPdf: "Export PDF",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    validateData: "Validasi Data",
    editorToggle: "Editor Data",
    branchLabel: "Tapis cabang",
    generationLabel: "Generasi (Lipat/Buka)",
    legendParentChild: "Garis sambungan ibu bapa \u2192 anak",
    legendCouple: "Pasangan ditunjukkan secara selari",
    storyTitle: "Cerita Keluarga",
    storyEmpty: "Klik pada mana-mana ahli keluarga untuk melihat catatan panjang.",
    editorTitle: "Editor Ahli Keluarga",
    editorPersonLabel: "Pilih ahli",
    editorNameLabel: "Nama penuh",
    editorRelationLabel: "Hubungan",
    editorBirthLabel: "Tarikh lahir",
    editorDeathLabel: "Tarikh meninggal",
    editorPhotoLabel: "URL gambar",
    editorNoteLabel: "Nota ringkas",
    editorStoryLabel: "Cerita panjang",
    editorParentLabel: "Tambah sebagai anak kepada pasangan",
    editorPartnerLabel: "Tambah pasangan kepada ahli dipilih",
    editorSave: "Simpan",
    editorAdd: "Tambah Ahli Baru",
    editorLinkPartner: "Bina Pasangan",
    editorDelete: "Padam",
    editorHint: "Data disimpan di pelayar (localStorage). Guna Export PNG/PDF untuk kongsi, atau kemas kini data.json bila perlu.",
    timelineTitle: "Timeline Keluarga",
    modalClose: "Tutup",
    modalEdit: "Edit",
    modalRelation: "Hubungan",
    modalBirth: "Tarikh lahir",
    modalDeath: "Tarikh meninggal",
    modalNote: "Catatan",
    modalStory: "Cerita",
    modalFullName: "Nama penuh",
    modalImage: "URL gambar",
    modalShortNote: "Nota ringkas",
    modalLongStory: "Cerita panjang",
    modalCancel: "Batal",
    modalSave: "Simpan",
    modalDelete: "Padam",
    modalDeleteConfirm: "Padam ahli ini? Tindakan ini akan buang hubungan pasangan/anak.",
    legendGeneration: "Generasi",
    branchAll: "Semua cabang",
    branchName: "Cabang {n}",
    parentNone: "Tiada (jadi root)",
    genAll: "Tunjuk Semua",
    searchNone: "Tiada nama ditemui",
    datesUnknown: "Tarikh tidak dinyatakan",
    bornPrefix: "Lahir: ",
    diedPrefix: "Meninggal: ",
    loadFail: "Gagal memuatkan data keluarga.",
    importFail: "Import gagal: format JSON tidak sah.",
    deleteBlocked: "Tidak boleh padam kerana masih terikat dengan pasangan/anak. Padam hubungan dahulu.",
    partnerExists: "Pasangan ini sudah wujud.",
    exportDate: "Tarikh eksport: {date}",
    exportPngFail: "Gagal export PNG: library tidak tersedia.",
    exportPdfFail: "Gagal export PDF: library tidak tersedia.",
    ageLabel: "Umur",
    minimapTitle: "Minimap",
    minimapHint: "Klik pada kotak kecil untuk lompat lokasi. Kotak putih menunjukkan kawasan semasa.",
    minimapShow: "Buka Minimap",
    firstNameLabel: "Nama pertama",
    lastNameLabel: "Nama akhir",
    genderLabel: "Jantina",
    genderMale: "Lelaki",
    genderFemale: "Perempuan",
    controlsToggleOpen: "Buka Panel",
    controlsToggleClose: "Tutup Panel",
    resetView: "Reset View",
    loading: "Memuatkan data...",
    clearCache: "Clear Cache",
    clearCacheConfirm: "Padam cache untuk laman ini? Data tersimpan di pelayar akan dipadam.",
    okBtn: "OK",
    errStructure: "Struktur utama mesti ada `people` dan `unions`.",
    errPersonNoId: "Ada ahli tanpa id.",
    errDuplicateId: "ID berulang: {id}",
    errUnionNoId: "Ada union tanpa id.",
    errPartner1Missing: "Partner1 tidak wujud: {id}",
    errPartner2Missing: "Partner2 tidak wujud: {id}",
    errChildMissing: "Anak tidak wujud: {id}",
    errChildMultiple: "Anak {id} terikat pada lebih satu union ({unions}).",
    mobileActions: "Aksi lain",
    mobilePick: "Pilih aksi...",
    validateOk: "Data sah. Tiada ralat ditemui.",
    validateErr: "Ralat data ditemui:",
    searchPlaceholder: "Cari nama ahli keluarga..."
  },
  en: {
    appKicker: "Family Lineage",
    appTitle: "Family Generation View",
    appSubtitle: "All family members in one clear, simple, friendly view.",
    searchLabel: "Name search",
    searchGo: "Search & Focus",
    viewTimeline: "Timeline View",
    viewTree: "Tree View",
    compactOn: "Full Mode",
    compactOff: "Compact Mode",
    pathOn: "Hide Path",
    pathOff: "My Lineage",
    focusElders: "Focus Elders",
    backTop: "Back Top",
    fit: "Fit Screen",
    zoomIn: "Zoom +",
    zoomOut: "Zoom -",
    zoomReset: "Reset",
    themeToggle: "Light / Dark",
    langToggle: "EN / BM",
    exportPng: "Export PNG",
    exportPdf: "Export PDF",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    validateData: "Validate Data",
    editorToggle: "Data Editor",
    branchLabel: "Filter branch",
    generationLabel: "Generation (Collapse/Expand)",
    legendParentChild: "Parent \u2192 child connection",
    legendCouple: "Partners shown side by side",
    storyTitle: "Family Story",
    storyEmpty: "Tap any family member to see detailed notes.",
    editorTitle: "Family Editor",
    editorPersonLabel: "Select member",
    editorNameLabel: "Full name",
    editorRelationLabel: "Relation",
    editorBirthLabel: "Birth date",
    editorDeathLabel: "Death date",
    editorPhotoLabel: "Image URL",
    editorNoteLabel: "Short note",
    editorStoryLabel: "Long story",
    editorParentLabel: "Add as child to couple",
    editorPartnerLabel: "Add partner to selected member",
    editorSave: "Save",
    editorAdd: "Add New Member",
    editorLinkPartner: "Link Partner",
    editorDelete: "Delete",
    editorHint: "Data is stored in the browser (localStorage). Use Export PNG/PDF to share, or update data.json when needed.",
    timelineTitle: "Family Timeline",
    modalClose: "Close",
    modalEdit: "Edit",
    modalRelation: "Relation",
    modalBirth: "Birth date",
    modalDeath: "Death date",
    modalNote: "Notes",
    modalStory: "Story",
    modalFullName: "Full name",
    modalImage: "Image URL",
    modalShortNote: "Short note",
    modalLongStory: "Long story",
    modalCancel: "Cancel",
    modalSave: "Save",
    modalDelete: "Delete",
    modalDeleteConfirm: "Delete this person? This will remove partner/child links.",
    legendGeneration: "Generation",
    branchAll: "All branches",
    branchName: "Branch {n}",
    parentNone: "None (as root)",
    genAll: "Show All",
    searchNone: "No names found",
    datesUnknown: "Date not specified",
    bornPrefix: "Born: ",
    diedPrefix: "Died: ",
    loadFail: "Failed to load family data.",
    importFail: "Import failed: invalid JSON format.",
    deleteBlocked: "Cannot delete because this person is linked to a partner/child. Remove relationships first.",
    partnerExists: "This partner pair already exists.",
    exportDate: "Export date: {date}",
    exportPngFail: "PNG export failed: library not available.",
    exportPdfFail: "PDF export failed: library not available.",
    ageLabel: "Age",
    minimapTitle: "Minimap",
    minimapHint: "Tap the minimap to jump. The white box shows your current view.",
    minimapShow: "Show Minimap",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    controlsToggleOpen: "Show Panel",
    controlsToggleClose: "Hide Panel",
    resetView: "Reset View",
    loading: "Loading data...",
    clearCache: "Clear Cache",
    clearCacheConfirm: "Clear cache for this site? This will remove data stored in your browser.",
    okBtn: "OK",
    errStructure: "Root structure must include `people` and `unions`.",
    errPersonNoId: "A person is missing an id.",
    errDuplicateId: "Duplicate ID: {id}",
    errUnionNoId: "A union is missing an id.",
    errPartner1Missing: "Partner1 not found: {id}",
    errPartner2Missing: "Partner2 not found: {id}",
    errChildMissing: "Child not found: {id}",
    errChildMultiple: "Child {id} is linked to multiple unions ({unions}).",
    mobileActions: "More actions",
    mobilePick: "Select action...",
    validateOk: "Data is valid. No issues found.",
    validateErr: "Data issues found:",
    searchPlaceholder: "Search family member..."
  }
};

function formatText(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : ""));
}

function setTreeStatus(message = "", isError = false) {
  if (!treeStatus) return;
  treeStatus.textContent = message;
  treeStatus.hidden = !message;
  treeStatus.classList.toggle("is-error", isError);
}

async function clearSiteCache() {
  const t = i18n[lang] || i18n.ms;
  if (!confirm(t.clearCacheConfirm)) return;
  try {
    localStorage.clear();
  } catch {
    // ignore storage errors
  }
  try {
    sessionStorage.clear();
  } catch {
    // ignore storage errors
  }
  await clearBrowserCaches();
  await unregisterServiceWorkers();
  window.location.replace(`${window.location.pathname}?v=${Date.now()}`);
}

async function clearBrowserCaches() {
  if (!("caches" in window)) return;
  try {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
  } catch {
    // ignore cache errors
  }
}

async function unregisterServiceWorkers() {
  try {
    const sw = navigator["service" + "Worker"];
    if (!sw) return;
    const regs = await sw.getRegistrations();
    await Promise.all(regs.map((reg) => reg.unregister()));
  } catch {
    // ignore service worker errors
  }
}

function hasPwaCleanupFlag() {
  try {
    return localStorage.getItem(PWA_CLEANUP_KEY) === "1";
  } catch {
    // ignore storage errors
  }
  try {
    return sessionStorage.getItem(PWA_CLEANUP_KEY) === "1";
  } catch {
    // ignore storage errors
  }
  return false;
}

function setPwaCleanupFlag() {
  try {
    localStorage.setItem(PWA_CLEANUP_KEY, "1");
    return;
  } catch {
    // ignore storage errors
  }
  try {
    sessionStorage.setItem(PWA_CLEANUP_KEY, "1");
  } catch {
    // ignore storage errors
  }
}

async function runPwaCleanupOnce() {
  if (hasPwaCleanupFlag()) return;
  setPwaCleanupFlag();
  let didCleanup = false;
  try {
    const sw = navigator["service" + "Worker"];
    if (sw) {
      const regs = await sw.getRegistrations();
      if (regs.length) {
        await Promise.all(regs.map((reg) => reg.unregister()));
        didCleanup = true;
      }
    }
  } catch {
    // ignore service worker errors
  }
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      if (names.length) {
        await Promise.all(names.map((name) => caches.delete(name)));
        didCleanup = true;
      }
    } catch {
      // ignore cache errors
    }
  }
  if (didCleanup) {
    window.location.replace(`${window.location.pathname}?v=${Date.now()}`);
  }
}

function initFromData(data) {
  treeData = data;
  peopleById = new Map(treeData.people.map((p) => [p.id, p]));
  softPeachPeople = computeBranchPeople(SOFT_PEACH_ROOT_ID);
  babyBluePeople = computeBranchPeople(BABY_BLUE_ROOT_ID);
  mintGreenPeople = computeBranchPeople(MINT_GREEN_ROOT_ID);
  lavenderPeople = computeBranchPeople(LAVENDER_ROOT_ID);
  if (storyPanel) storyPanel.hidden = true;

  if (prefs.theme) {
    app.dataset.theme = prefs.theme;
    document.body.dataset.theme = prefs.theme;
  } else {
    document.body.dataset.theme = app.dataset.theme || "light";
  }

  if (prefs.scale) scale = prefs.scale;
  if (prefs.hiddenGenerations) hiddenGenerations = new Set(prefs.hiddenGenerations);
  if (prefs.viewMode) viewMode = prefs.viewMode;
  if (prefs.branchFilter) branchFilterValue = prefs.branchFilter;
  if (prefs.lang) lang = prefs.lang;
  if (prefs.compactMode) compactMode = true;
  if (prefs.pathMode) pathMode = true;
  if (prefs.controlsCollapsed) controlsCollapsed = true;
  if (!BRANCH_FILTER_ENABLED) branchFilterValue = "all";
  if (!GENERATION_FILTER_ENABLED) hiddenGenerations.clear();

  buildLayout();
  if (nodesList.length === 0) {
    forceFreshData = true;
  }
  if (branchFilterValue !== "all") {
    const maxBranch = layoutRoot?.children?.length || 0;
    if (Number(branchFilterValue) >= maxBranch) {
      branchFilterValue = "all";
      savePrefs();
    }
  }
  if (hiddenGenerations.size >= maxDepth) {
    hiddenGenerations.clear();
    savePrefs();
  }
  buildGenerationControls();
  buildBranchFilter();
  initEditor();
  applyLanguage();
  document.body.classList.toggle("compact", compactMode);
  document.body.classList.toggle("controls-collapsed", controlsCollapsed);
  if (!timelineSection) viewMode = "tree";
  applyViewMode();
  renderScene();
  applyZoom();
  treeWrap.scrollTo({ left: 0, top: 0 });
  setTreeStatus("");
  restoreFromUrl();
  if (pathMode) applyLineageHighlight();
  if (treeCanvas && treeCanvas.children.length === 0) {
    recoverEmptyView();
    recoverEmptyViewAsync();
  }
  return treeCanvas && treeCanvas.children.length > 0;
}

function recoverEmptyView() {
  hiddenGenerations.clear();
  branchFilterValue = "all";
  viewMode = "tree";
  scale = 1;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATA_KEY);
  } catch {
    // ignore storage errors
  }
  applyViewMode();
  renderScene();
  applyZoom();
  if (treeCanvas && treeCanvas.children.length === 0) {
    const t = i18n[lang] || i18n.ms;
    treeCanvas.textContent = t.loadFail;
    setTreeStatus(t.loadFail, true);
  }
}

async function recoverEmptyViewAsync() {
  if (recoveryAttempted) return;
  recoveryAttempted = true;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATA_KEY);
  } catch {
    // ignore storage errors
  }
  try {
    const res = await fetch(`data.json?ts=${Date.now()}`);
    const data = await res.json();
    treeData = data;
    storeData();
    initFromData(data);
  } catch {
    // ignore fetch errors
  }
}

let stored = loadStoredData();
if (FORCE_RESET) {
  localStorage.removeItem(DATA_KEY);
  localStorage.removeItem(STORAGE_KEY);
  stored = null;
  hiddenGenerations.clear();
  branchFilterValue = "all";
}
if (stored) {
  const errors = validateTreeData(stored);
  if (errors.length === 0 && stored.people.length > 0) {
    const ok = initFromData(stored);
    if (forceFreshData) {
      localStorage.removeItem(DATA_KEY);
      stored = null;
      forceFreshData = false;
    }
    if (!ok) {
      localStorage.removeItem(DATA_KEY);
      stored = null;
    }
  } else {
    stored = null;
  }
}

if (!treeCanvas || !treeCanvas.children.length) {
  const t = i18n[lang] || i18n.ms;
  setTreeStatus(t.loading);
}

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    treeCanvas.textContent = "";
    if (!stored) {
      treeData = data;
      storeData();
      stored = data;
      initFromData(data);
    }
    if (!treeCanvas.children.length) {
      treeData = data;
      storeData();
      initFromData(data);
      return;
    }
    if (data?.dataVersion && stored.dataVersion === data.dataVersion) {
      return;
    }
    treeData = data;
    storeData();
    initFromData(data);
  })
  .catch((err) => {
    if (!stored) {
      const t = i18n[lang] || i18n.ms;
      treeCanvas.textContent = t.loadFail;
      setTreeStatus(t.loadFail, true);
    }
    console.error(err);
  });

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function savePrefs() {
  const payload = {
    theme: app.dataset.theme,
    scale,
    hiddenGenerations: Array.from(hiddenGenerations),
    viewMode,
    branchFilter: branchFilterValue,
    lang,
    compactMode,
    pathMode,
    controlsCollapsed
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadStoredData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function storeData() {
  localStorage.setItem(DATA_KEY, JSON.stringify(treeData));
}

function buildLayout() {
  const unionsById = new Map(treeData.unions.map((u) => [u.id, u]));
  const unionsByPartner = new Map();
  const parentUnionByChild = new Map();

  treeData.unions.forEach((union) => {
    [union.partner1, union.partner2].forEach((pid) => {
      if (!pid) return;
      if (!unionsByPartner.has(pid)) unionsByPartner.set(pid, []);
      unionsByPartner.get(pid).push(union.id);
    });
    union.children.forEach((childId) => parentUnionByChild.set(childId, union.id));
  });

  const unionNodes = new Map();

  function buildUnionNode(unionId, trail = new Set()) {
    if (trail.has(unionId)) return null;
    if (unionNodes.has(unionId)) return unionNodes.get(unionId);
    const union = unionsById.get(unionId);
    if (!union) return null;
    const node = {
      id: unionId,
      type: "union",
      partner1: union.partner1,
      partner2: union.partner2,
      children: []
    };
    unionNodes.set(unionId, node);
    const nextTrail = new Set(trail);
    nextTrail.add(unionId);
    union.children.forEach((childId) => {
      const childUnions = (unionsByPartner.get(childId) || []).filter((id) => id !== unionId);
      if (childUnions.length > 0) {
        childUnions.forEach((childUnionId) => {
          const childUnionNode = buildUnionNode(childUnionId, nextTrail);
          if (childUnionNode) node.children.push(childUnionNode);
        });
      } else {
        node.children.push({ id: childId, type: "person", personId: childId, children: [] });
      }
    });
    return node;
  }

  const root = { id: "root", type: "root", children: [] };

  const rootUnions = treeData.unions.filter((u) => {
    const p1Parent = u.partner1 && parentUnionByChild.has(u.partner1);
    const p2Parent = u.partner2 && parentUnionByChild.has(u.partner2);
    return !p1Parent && !p2Parent;
  });

  rootUnions.forEach((u) => {
    const node = buildUnionNode(u.id);
    if (node) root.children.push(node);
  });

  treeData.people.forEach((person) => {
    const isChild = parentUnionByChild.has(person.id);
    const isPartner = unionsByPartner.has(person.id);
    if (!isChild && !isPartner) {
      root.children.push({ id: person.id, type: "person", personId: person.id, children: [] });
    }
  });

  function measure(node) {
    if (node.type === "root") {
      const childWidths = node.children.map((child) => measure(child));
      const total = childWidths.reduce((sum, w) => sum + w, 0) + layoutConfig.hGap * Math.max(0, childWidths.length - 1);
      node.width = total;
      node.ownWidth = 0;
      return node.width;
    }

    const ownWidth = node.type === "union" && node.partner2
      ? layoutConfig.cardWidth * 2 + layoutConfig.cardGap
      : layoutConfig.cardWidth;

    const childWidths = node.children.map((child) => measure(child));
    const childrenTotal = childWidths.reduce((sum, w) => sum + w, 0) + layoutConfig.hGap * Math.max(0, childWidths.length - 1);
    node.width = Math.max(ownWidth, childrenTotal || 0);
    node.ownWidth = ownWidth;
    return node.width;
  }

  function layout(node, x, y, depth = 0, branchId = 0) {
    node.depth = depth;
    node.branchId = branchId;
    if (node.type !== "root") {
      node.x = x + (node.width - node.ownWidth) / 2;
      node.y = y;
    }
    const childWidths = node.children.map((child) => child.width);
    const total = childWidths.reduce((sum, w) => sum + w, 0) + layoutConfig.hGap * Math.max(0, childWidths.length - 1);
    let startX = x + (node.width - total) / 2;
    node.children.forEach((child) => {
      layout(child, startX, y + layoutConfig.vGap, depth + 1, branchId);
      startX += child.width + layoutConfig.hGap;
    });
  }

  measure(root);
  root.children.forEach((child, index) => {
    const branchId = index % branchPalette.length;
    layout(child, layoutConfig.leftPadding + layoutConfig.labelColumnWidth, layoutConfig.topPadding, 1, branchId);
  });

  nodesList = [];
  maxDepth = 0;

  function collect(node) {
    if (node.type !== "root") {
      nodesList.push(node);
      maxDepth = Math.max(maxDepth, node.depth);
    }
    node.children.forEach(collect);
  }

  collect(root);
  layoutRoot = root;

  let maxX = 0;
  let maxY = 0;
  nodesList.forEach((node) => {
    const width = node.ownWidth || layoutConfig.cardWidth;
    maxX = Math.max(maxX, node.x + width);
    maxY = Math.max(maxY, node.y + layoutConfig.vGap);
  });

  baseSize = {
    width: maxX + layoutConfig.leftPadding,
    height: maxY + layoutConfig.vGap
  };

  virtualizationEnabled = nodesList.length > VIRTUALIZE_THRESHOLD;
}

function buildGenerationControls() {
  if (!generationControls || !GENERATION_FILTER_ENABLED) return;
  const t = i18n[lang] || i18n.ms;
  generationControls.innerHTML = "";
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "gen-chip";
    chip.dataset.depth = depth;
    chip.textContent = `G${depth}`;
    if (hiddenGenerations.has(depth)) chip.classList.add("inactive");
    chip.addEventListener("click", () => {
      if (hiddenGenerations.has(depth)) {
        hiddenGenerations.delete(depth);
        chip.classList.remove("inactive");
      } else {
        hiddenGenerations.add(depth);
        chip.classList.add("inactive");
      }
      savePrefs();
      scheduleRender();
      updateUrlState();
    });
    generationControls.appendChild(chip);
  }

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "gen-chip";
  reset.textContent = t.genAll;
  reset.dataset.reset = "true";
  reset.addEventListener("click", () => {
    hiddenGenerations.clear();
    generationControls.querySelectorAll(".gen-chip").forEach((chip) => {
      if (!chip.dataset.reset) chip.classList.remove("inactive");
    });
    savePrefs();
    scheduleRender();
    updateUrlState();
  });
  generationControls.appendChild(reset);
}

function buildBranchFilter() {
  if (!branchFilter || !BRANCH_FILTER_ENABLED) return;
  const t = i18n[lang] || i18n.ms;
  branchFilter.innerHTML = "";
  const optionAll = document.createElement("option");
  optionAll.value = "all";
  optionAll.textContent = t.branchAll;
  branchFilter.appendChild(optionAll);

  layoutRoot.children.forEach((child, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatText(t.branchName, { n: index + 1 });
    branchFilter.appendChild(option);
  });

  branchFilter.value = branchFilterValue;
  branchFilter.addEventListener("change", () => {
    branchFilterValue = branchFilter.value;
    savePrefs();
    scheduleRender();
    updateUrlState();
  });
}

function initEditor() {
  if (!editorPanel || !editorPerson) return;
  if (editorPhotoFile) {
    editorPhotoFile.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        editorPhoto.value = dataUrl;
      } finally {
        editorPhotoFile.value = "";
      }
    });
  }

  if (editorToggle) {
    editorToggle.addEventListener("click", () => {
      const next = editorPanel.hidden === true ? false : true;
      editorPanel.hidden = next;
    });
  }

  refreshEditorLists();
  editorPerson.addEventListener("change", () => {
    const person = peopleById.get(editorPerson.value);
    if (person) fillEditor(person);
  });

  editorSave.addEventListener("click", () => {
    const id = editorPerson.value;
    const person = peopleById.get(id);
    if (!person) return;
    person.name = editorName.value.trim();
    person.relation = editorRelation.value.trim();
    person.birth = editorBirth.value.trim();
    person.death = editorDeath.value.trim();
    person.photo = editorPhoto.value.trim();
    person.note = editorNote.value.trim();
    person.story = editorStory.value.trim();
    storeData();
    rebuildFromData();
  });

  editorAdd.addEventListener("click", () => {
    const newId = generateId();
    const person = {
      id: newId,
      name: editorName.value.trim() || "Ahli Baru",
      birth: editorBirth.value.trim(),
      death: editorDeath.value.trim(),
      relation: editorRelation.value.trim(),
      note: editorNote.value.trim(),
      story: editorStory.value.trim(),
      photo: editorPhoto.value.trim()
    };
    treeData.people.push(person);
    const parentId = editorParent.value;
    if (parentId) {
      const union = treeData.unions.find((u) => u.id === parentId);
      if (union) union.children.push(newId);
    }
    storeData();
    rebuildFromData();
    editorPerson.value = newId;
    fillEditor(person);
  });

  editorDelete.addEventListener("click", () => {
    const id = editorPerson.value;
    if (!id) return;
    const isPartner = treeData.unions.some((u) => u.partner1 === id || u.partner2 === id);
    const isChild = treeData.unions.some((u) => u.children.includes(id));
    if (isPartner || isChild) {
      alert(i18n[lang].deleteBlocked);
      return;
    }
    treeData.people = treeData.people.filter((p) => p.id !== id);
    if (treeData.selfId === id) treeData.selfId = "";
    storeData();
    rebuildFromData();
  });

  editorLinkPartner.addEventListener("click", () => {
    const personId = editorPerson.value;
    const partnerId = editorPartner.value;
    if (!personId || !partnerId || personId === partnerId) return;
    const exists = treeData.unions.some((u) => {
      const pairA = [u.partner1, u.partner2].filter(Boolean).sort().join("|");
      const pairB = [personId, partnerId].sort().join("|");
      return pairA === pairB;
    });
    if (exists) {
      alert(i18n[lang].partnerExists);
      return;
    }
    treeData.unions.push({
      id: generateUnionId(),
      partner1: personId,
      partner2: partnerId,
      children: []
    });
    storeData();
    rebuildFromData();
  });
}

function refreshEditorLists() {
  const t = i18n[lang] || i18n.ms;
  editorPerson.innerHTML = "";
  treeData.people.forEach((person) => {
    const option = document.createElement("option");
    option.value = person.id;
    option.textContent = formatDisplayName(person.name);
    editorPerson.appendChild(option);
  });

  editorPartner.innerHTML = "";
  treeData.people.forEach((person) => {
    const option = document.createElement("option");
    option.value = person.id;
    option.textContent = formatDisplayName(person.name);
    editorPartner.appendChild(option);
  });

  editorParent.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = t.parentNone;
  editorParent.appendChild(empty);
  treeData.unions.forEach((union) => {
    const p1 = peopleById.get(union.partner1);
    const p2 = peopleById.get(union.partner2);
    const label = [p1?.name, p2?.name].filter(Boolean).join(" & ") || union.id;
    const option = document.createElement("option");
    option.value = union.id;
    option.textContent = label;
    editorParent.appendChild(option);
  });

  if (treeData.people[0]) {
    editorPerson.value = treeData.people[0].id;
    editorPartner.value = treeData.people[0].id;
    fillEditor(treeData.people[0]);
  }
}

function fillEditor(person) {
  editorName.value = person.name || "";
  editorRelation.value = person.relation || "";
  editorBirth.value = person.birth || "";
  editorDeath.value = person.death || "";
  editorPhoto.value = person.photo || "";
  editorNote.value = person.note || "";
  editorStory.value = person.story || "";
}

function deletePersonAndCleanup(personId) {
  if (!personId) return;
  treeData.people = treeData.people.filter((p) => p.id !== personId);
  if (treeData.selfId === personId) treeData.selfId = "";
  treeData.unions.forEach((union) => {
    if (union.partner1 === personId) union.partner1 = "";
    if (union.partner2 === personId) union.partner2 = "";
    union.children = (union.children || []).filter((cid) => cid !== personId);
  });
  treeData.unions = treeData.unions.filter((union) => {
    const hasPartner = Boolean(union.partner1 || union.partner2);
    const hasChildren = (union.children || []).length > 0;
    return hasPartner || hasChildren;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function rebuildFromData() {
  peopleById = new Map(treeData.people.map((p) => [p.id, p]));
  softPeachPeople = computeBranchPeople(SOFT_PEACH_ROOT_ID);
  babyBluePeople = computeBranchPeople(BABY_BLUE_ROOT_ID);
  mintGreenPeople = computeBranchPeople(MINT_GREEN_ROOT_ID);
  lavenderPeople = computeBranchPeople(LAVENDER_ROOT_ID);
  buildLayout();
  buildGenerationControls();
  buildBranchFilter();
  renderScene();
  refreshEditorLists();
  applyLanguage();
  if (pathMode) applyLineageHighlight();
}

function computeBranchPeople(rootId) {
  if (!treeData?.unions || !treeData?.people) return new Set();
  if (!treeData.people.some((p) => p.id === rootId)) return new Set();
  const unionsByPartner = new Map();
  treeData.unions.forEach((union) => {
    [union.partner1, union.partner2].forEach((pid) => {
      if (!pid) return;
      if (!unionsByPartner.has(pid)) unionsByPartner.set(pid, []);
      unionsByPartner.get(pid).push(union);
    });
  });

  const result = new Set();
  const queue = [rootId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || result.has(current)) continue;
    result.add(current);
    const unions = unionsByPartner.get(current) || [];
    unions.forEach((union) => {
      if (union.partner1) queue.push(union.partner1);
      if (union.partner2) queue.push(union.partner2);
      (union.children || []).forEach((childId) => queue.push(childId));
    });
  }
  return result;
}

function generateId() {
  let idx = treeData.people.length + 1;
  let id = `p${idx}`;
  while (peopleById.has(id)) {
    idx += 1;
    id = `p${idx}`;
  }
  return id;
}

function generateUnionId() {
  const used = new Set(treeData.unions.map((u) => u.id));
  let idx = treeData.unions.length + 1;
  let id = `u${idx}`;
  while (used.has(id)) {
    idx += 1;
    id = `u${idx}`;
  }
  return id;
}

function applyViewMode() {
  if (!timelineSection) {
    viewMode = "tree";
    if (treeWrap) treeWrap.hidden = false;
    document.body.dataset.view = "tree";
    return;
  }
  if (viewMode === "timeline") {
    document.body.dataset.view = "timeline";
    timelineSection.hidden = false;
    treeWrap.hidden = true;
    renderTimeline();
  } else {
    document.body.dataset.view = "tree";
    timelineSection.hidden = true;
    treeWrap.hidden = false;
  }
  applyLanguage();
}

function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderScene();
  });
}

function renderScene() {
  if (viewMode === "timeline") {
    if (!timelineSection) {
      viewMode = "tree";
    } else {
      renderTimeline();
      return;
    }
  }

  treeCanvas.innerHTML = "";
  treeLines.innerHTML = "";
  elementByPersonId.clear();
  elementByNodeId.clear();
  nodeByPersonId.clear();

  treeCanvas.style.width = `${baseSize.width}px`;
  treeCanvas.style.height = `${baseSize.height}px`;
  treeLines.setAttribute("width", baseSize.width);
  treeLines.setAttribute("height", baseSize.height);

  renderGenerationLabels();

  let visibleNodes = getVisibleNodes();
  if (visibleNodes.length === 0) {
    let changed = false;
    if (hiddenGenerations.size > 0) {
      hiddenGenerations.clear();
      changed = true;
    }
    if (branchFilterValue !== "all") {
      branchFilterValue = "all";
      changed = true;
    }
    if (changed) {
      savePrefs();
      visibleNodes = getVisibleNodes();
    }
    if (visibleNodes.length === 0 && treeData?.people?.length) {
      hiddenGenerations.clear();
      branchFilterValue = "all";
      viewMode = "tree";
      localStorage.removeItem(STORAGE_KEY);
      visibleNodes = getVisibleNodes();
    }
  }
  visibleNodes.forEach((node) => renderNode(node));

  drawLines(layoutRoot, visibleNodes);
  applyZoom();
  updateMinimap();
  if (pathMode) applyLineageHighlight();
}

function renderGenerationLabels() {
  const labelOffset = 20;
  const depthMap = new Map();
  nodesList.forEach((node) => {
    if (!nodeVisible(node)) return;
    if (!depthMap.has(node.depth)) depthMap.set(node.depth, node.y);
  });

  depthMap.forEach((y, depth) => {
    const divider = document.createElement("div");
    divider.className = "generation-divider";
    divider.style.top = `${y - 24}px`;
    treeCanvas.appendChild(divider);

    const label = document.createElement("div");
    label.className = "generation-label";
    label.textContent = `${i18n[lang].legendGeneration} ${depth}`;
    label.style.top = `${y + labelOffset}px`;
    label.style.left = "16px";
    treeCanvas.appendChild(label);
  });
}

function nodeVisible(node) {
  if (hiddenGenerations.has(node.depth)) return false;
  if (branchFilterValue !== "all" && String(node.branchId) !== branchFilterValue) return false;
  return true;
}

function getVisibleNodes() {
  const nodes = nodesList.filter((node) => nodeVisible(node));
  if (!virtualizationEnabled) return nodes;

  const padding = 300;
  const viewX = treeWrap.scrollLeft / scale - padding;
  const viewY = treeWrap.scrollTop / scale - padding;
  const viewW = treeWrap.clientWidth / scale + padding * 2;
  const viewH = treeWrap.clientHeight / scale + padding * 2;

  return nodes.filter((node) => {
    const width = node.ownWidth || layoutConfig.cardWidth;
    const height = 120;
    return node.x + width >= viewX && node.x <= viewX + viewW && node.y + height >= viewY && node.y <= viewY + viewH;
  });
}

function renderNode(node) {
  if (node.type === "person") {
    const person = peopleById.get(node.personId);
    const group = document.createElement("div");
    group.className = "node-group";
    group.style.left = `${node.x}px`;
    group.style.top = `${node.y}px`;
    group.dataset.nodeId = node.id;
    group.dataset.depth = node.depth;
    group.style.setProperty("--branch-color", branchPalette[node.branchId]);
    const card = createPersonCard(person, node.depth);
    const isMenantu = (person?.relation || "").toLowerCase().includes("menantu");
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && softPeachPeople.has(node.personId)) {
      card.classList.add("soft-peach");
      card.style.setProperty("--card-fill", SOFT_PEACH_COLOR);
    }
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && babyBluePeople.has(node.personId)) {
      card.classList.add("baby-blue");
      card.style.setProperty("--card-fill", BABY_BLUE_COLOR);
    }
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && mintGreenPeople.has(node.personId)) {
      card.classList.add("mint-green");
      card.style.setProperty("--card-fill", MINT_GREEN_COLOR);
    }
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && lavenderPeople.has(node.personId)) {
      card.classList.add("lavender");
      card.style.setProperty("--card-fill", LAVENDER_COLOR);
    }
    group.appendChild(card);
    treeCanvas.appendChild(group);
    elementByPersonId.set(person.id, group);
    nodeByPersonId.set(person.id, node);
    elementByNodeId.set(node.id, group);
  }

  if (node.type === "union") {
    const group = document.createElement("div");
    group.className = "node-group";
    group.style.left = `${node.x}px`;
    group.style.top = `${node.y}px`;
    group.dataset.nodeId = node.id;
    group.dataset.depth = node.depth;
    group.style.setProperty("--branch-color", branchPalette[node.branchId]);
    const partner1 = peopleById.get(node.partner1);
    const partner2 = node.partner2 ? peopleById.get(node.partner2) : null;
    if (partner1) {
      const card1 = createPersonCard(partner1, node.depth);
      card1.dataset.partner = "left";
      const isMenantu1 = (partner1?.relation || "").toLowerCase().includes("menantu");
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && softPeachPeople.has(node.partner1)) {
        card1.classList.add("soft-peach");
        card1.style.setProperty("--card-fill", SOFT_PEACH_COLOR);
      }
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && babyBluePeople.has(node.partner1)) {
        card1.classList.add("baby-blue");
        card1.style.setProperty("--card-fill", BABY_BLUE_COLOR);
      }
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && mintGreenPeople.has(node.partner1)) {
        card1.classList.add("mint-green");
        card1.style.setProperty("--card-fill", MINT_GREEN_COLOR);
      }
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && lavenderPeople.has(node.partner1)) {
        card1.classList.add("lavender");
        card1.style.setProperty("--card-fill", LAVENDER_COLOR);
      }
      group.appendChild(card1);
      elementByPersonId.set(partner1.id, group);
      nodeByPersonId.set(partner1.id, node);
    }
    if (partner2) {
      const card2 = createPersonCard(partner2, node.depth);
      card2.dataset.partner = "right";
      const isMenantu2 = (partner2?.relation || "").toLowerCase().includes("menantu");
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && softPeachPeople.has(node.partner2)) {
        card2.classList.add("soft-peach");
        card2.style.setProperty("--card-fill", SOFT_PEACH_COLOR);
      }
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && babyBluePeople.has(node.partner2)) {
        card2.classList.add("baby-blue");
        card2.style.setProperty("--card-fill", BABY_BLUE_COLOR);
      }
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && mintGreenPeople.has(node.partner2)) {
        card2.classList.add("mint-green");
        card2.style.setProperty("--card-fill", MINT_GREEN_COLOR);
      }
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && lavenderPeople.has(node.partner2)) {
        card2.classList.add("lavender");
        card2.style.setProperty("--card-fill", LAVENDER_COLOR);
      }
      group.appendChild(card2);
      elementByPersonId.set(partner2.id, group);
      nodeByPersonId.set(partner2.id, node);
    }
    treeCanvas.appendChild(group);
    elementByNodeId.set(node.id, group);
  }
}

function createPersonCard(person, depth) {
  const displayName = formatDisplayName(person.name);
  const card = document.createElement("div");
  card.className = "person-card";
  card.dataset.personId = person.id;
  card.dataset.depth = depth;
  card.style.setProperty("--enter-delay", `${Math.min(420, depth * 55)}ms`);
  card.tabIndex = 0;
  if ((person.relation || "").toLowerCase().includes("menantu")) {
    card.classList.add("is-menantu");
  }

  if (person.death) card.classList.add("deceased");

  const header = document.createElement("div");
  header.className = "person-header";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.setProperty("--gen-ring", generationColor(depth));
  if (person.photo) {
    const img = document.createElement("img");
    img.src = person.photo;
    img.alt = displayName || person.name || "";
    avatar.appendChild(img);
  } else {
    avatar.textContent = initials(displayName || person.name || "");
  }

  const nameWrap = document.createElement("div");
  const name = document.createElement("div");
  name.className = "person-name";
  const split = splitNameByBin(displayName || person.name || "");
  const firstName = formatDisplayName(person.firstName || split.first || person.name || "");
  name.textContent = firstName || displayName || person.name || "";
  const meta = document.createElement("div");
  meta.className = "person-meta";
  const birthLine = document.createElement("div");
  if (person.birth) {
    const birthDate = parseDateValue(person.birth);
    const age = !person.death ? calcAge(birthDate) : null;
    const ageText = age !== null ? ` (${i18n[lang].ageLabel}: ${age})` : "";
    birthLine.textContent = `${i18n[lang].bornPrefix}${person.birth}${ageText}`;
  } else {
    birthLine.textContent = "";
  }
  const deathLine = document.createElement("div");
  deathLine.textContent = person.death ? `${i18n[lang].diedPrefix}${person.death}` : "";
  if (birthLine.textContent) meta.appendChild(birthLine);
  if (deathLine.textContent) meta.appendChild(deathLine);
  nameWrap.appendChild(name);
  nameWrap.appendChild(meta);

  header.appendChild(avatar);
  header.appendChild(nameWrap);

  const tags = document.createElement("div");
  tags.className = "person-tags";
  const relationText = person.relation || "";
  const noteText = person.note || "";
  let tagText = "";
  if (noteText && relationText) {
    tagText = `${noteText}, ${relationText}`;
  } else {
    tagText = relationText || noteText;
  }
  if (tagText) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = tagText;
    tags.appendChild(tag);
  }
  // No Bin/Binti tag on card

  card.appendChild(header);
  card.appendChild(tags);

  card.addEventListener("click", (e) => {
    e.stopPropagation();
    openModal(person);
    updateStoryPanel(person);
    selectedPersonId = person.id;
    updateUrlState();
  });

  return card;
}

function drawLines(root, visibleNodes) {
  const visibleSet = new Set(visibleNodes.map((node) => node.id));
  treeLines.innerHTML = "";

  function drawNodeEdges(node) {
    if (node.type === "union") {
      if (!visibleSet.has(node.id)) return;
      const parentEl = elementByNodeId.get(node.id);
      if (!parentEl) return;
      const parentCenterX = parentEl.offsetLeft + parentEl.offsetWidth / 2;
      const parentBottomY = parentEl.offsetTop + parentEl.offsetHeight;
      const childPoints = [];
      node.children.forEach((child) => {
        if (!nodeVisible(child)) return;
        if (!visibleSet.has(child.id)) return;
        const childEl = elementByNodeId.get(child.id);
        if (!childEl) return;
        childPoints.push({
          x: childEl.offsetLeft + childEl.offsetWidth / 2,
          y: childEl.offsetTop
        });
      });

      if (childPoints.length > 0) {
        const midY = (parentBottomY + Math.min(...childPoints.map((p) => p.y))) / 2;
        const minX = Math.min(...childPoints.map((p) => p.x));
        const maxX = Math.max(...childPoints.map((p) => p.x));
        const stroke = `${branchPalette[node.branchId] || "#7a8a80"}CC`;

        const trunk = document.createElementNS("http://www.w3.org/2000/svg", "path");
        trunk.setAttribute("d", `M ${parentCenterX} ${parentBottomY} V ${midY}`);
        trunk.setAttribute("fill", "none");
        trunk.setAttribute("stroke", stroke);
        trunk.setAttribute("stroke-width", "2.5");
        trunk.setAttribute("stroke-linecap", "round");
        treeLines.appendChild(trunk);

        const bar = document.createElementNS("http://www.w3.org/2000/svg", "line");
        if (minX === maxX) {
          bar.setAttribute("x1", minX - 24);
          bar.setAttribute("x2", maxX + 24);
        } else {
          bar.setAttribute("x1", minX);
          bar.setAttribute("x2", maxX);
        }
        bar.setAttribute("y1", midY);
        bar.setAttribute("y2", midY);
        bar.setAttribute("stroke", stroke);
        bar.setAttribute("stroke-width", "2.5");
        bar.setAttribute("stroke-linecap", "round");
        treeLines.appendChild(bar);

        if (childPoints.length > 1) {
          const sorted = [...childPoints].sort((a, b) => a.x - b.x);
          for (let i = 0; i < sorted.length - 1; i += 1) {
            const midX = (sorted[i].x + sorted[i + 1].x) / 2;
            const divider = document.createElementNS("http://www.w3.org/2000/svg", "line");
            divider.setAttribute("x1", midX);
            divider.setAttribute("y1", midY - 6);
            divider.setAttribute("x2", midX);
            divider.setAttribute("y2", midY + 6);
            divider.setAttribute("stroke", stroke);
            divider.setAttribute("stroke-width", "2");
            divider.setAttribute("stroke-linecap", "round");
            treeLines.appendChild(divider);
          }
        }

        childPoints.forEach((point) => {
          const stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
          stem.setAttribute("d", `M ${point.x} ${midY} V ${point.y}`);
          stem.setAttribute("fill", "none");
          stem.setAttribute("stroke", stroke);
          stem.setAttribute("stroke-width", "2.5");
          stem.setAttribute("stroke-linecap", "round");
          treeLines.appendChild(stem);
        });
      }

      const partnerCards = parentEl.querySelectorAll(".person-card");
      if (partnerCards.length === 2) {
        const leftBox = partnerCards[0].getBoundingClientRect();
        const rightBox = partnerCards[1].getBoundingClientRect();
        const y = leftBox.top - canvasBox.top + leftBox.height / 2;
        const x1 = leftBox.right - canvasBox.left;
        const x2 = rightBox.left - canvasBox.left;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1 + 6);
        line.setAttribute("y1", y);
        line.setAttribute("x2", x2 - 6);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", `${branchPalette[node.branchId] || "#7a8a80"}CC`);
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke-linecap", "round");
        treeLines.appendChild(line);
      }
    }

    node.children.forEach(drawNodeEdges);
  }

  drawNodeEdges(root);
}

function renderTimeline() {
  if (!timelineSection) return;
  timelineList.innerHTML = "";
  const entries = treeData.people.map((person) => {
    const birth = parseYear(person.birth);
    const death = parseYear(person.death);
    const order = birth || death || 9999;
    return { person, order };
  });

  entries.sort((a, b) => a.order - b.order);

  entries.forEach(({ person }) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    if (person.death) item.classList.add("deceased");
    item.innerHTML = `
      <div class="timeline-name">${formatDisplayName(person.name)}</div>
      <div class="timeline-meta">${formatDates(person.birth, person.death)}</div>
      <div class="timeline-relation">${person.relation || ""}</div>
    `;
    item.addEventListener("click", () => {
      openModal(person);
      updateStoryPanel(person);
      selectedPersonId = person.id;
      updateUrlState();
    });
    timelineList.appendChild(item);
  });
}

function parseYear(value) {
  if (!value) return null;
  const match = String(value).match(/(\d{4})/);
  return match ? Number(match[1]) : null;
}

function parseDateValue(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}$/.test(str)) {
    return new Date(Number(str), 0, 1);
  }
  const dt = new Date(str);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function splitNameByBin(fullName) {
  const name = String(fullName || "").trim();
  if (!name) return { first: "", last: "" };
  const parts = name.split(/\s+/);
  const idx = parts.findIndex((p) => /^(bin|binti|bt)$/i.test(p));
  if (idx > 0 && idx < parts.length - 1) {
    return {
      first: parts.slice(0, idx).join(" "),
      last: parts.slice(idx + 1).join(" ")
    };
  }
  return {
    first: parts[0],
    last: parts.slice(1).join(" ")
  };
}

function detectGenderFromName(fullName) {
  const name = String(fullName || "").toLowerCase();
  if (name.includes(" binti ") || name.includes(" bt ")) return "female";
  if (name.includes(" bin ")) return "male";
  return "";
}

function calcAge(birthDate, refDate = new Date()) {
  if (!birthDate) return null;
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const m = refDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

function generationColor(depth) {
  const index = (depth - 1) % branchPalette.length;
  return branchPalette[index];
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDisplayName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const isAllUpper = raw === raw.toUpperCase();
  if (!isAllUpper) return raw;
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((part) => {
      if (!part) return "";
      if (part === "bin" || part === "binti" || part === "bt") return part;
      return part
        .split("-")
        .map((chunk) => (chunk ? chunk[0].toUpperCase() + chunk.slice(1) : ""))
        .join("-");
    })
    .join(" ");
}

function formatDates(birth, death) {
  const t = i18n[lang] || i18n.ms;
  if (!birth && !death) return t.datesUnknown;
  if (birth && death) return `${birth} - ${death}`;
  if (birth) {
    const birthDate = parseDateValue(birth);
    const age = !death ? calcAge(birthDate) : null;
    const ageText = age !== null ? ` (${t.ageLabel}: ${age})` : "";
    return `${t.bornPrefix}${birth}${ageText}`;
  }
  return `${t.diedPrefix}${death}`;
}

function openModal(person) {
  const t = i18n[lang] || i18n.ms;
  if (!storyContent) return;
  if (storyPanel) storyPanel.hidden = false;
  const birthDate = parseDateValue(person.birth);
  const age = !person.death ? calcAge(birthDate) : null;
  const ageText = age !== null ? ` (${t.ageLabel}: ${age})` : "";
  storyTitle.textContent = formatDisplayName(person.name);
  storyContent.innerHTML = `
    <div class="story-detail"><strong>${t.modalRelation}</strong><span>${person.relation || "-"}</span></div>
    <div class="story-detail"><strong>${t.modalBirth}</strong><span>${person.birth || "-"}${ageText}</span></div>
    <div class="story-detail"><strong>${t.modalDeath}</strong><span>${person.death || "-"}</span></div>
    <div class="story-detail"><strong>${t.modalNote}</strong><span>${person.note || "-"}</span></div>
    <div class="story-detail"><strong>${t.modalStory}</strong><span>${person.story || "-"}</span></div>
  `;

  if (panelEditForm) panelEditForm.hidden = true;
  if (panelEditBtn) panelEditBtn.hidden = false;
  if (panelDeleteBtn) panelDeleteBtn.hidden = false;

  if (panelEditName) panelEditName.value = person.name || "";
  if (panelEditFirst && panelEditLast) {
    const split = splitNameByBin(person.name || "");
    panelEditFirst.value = split.first || "";
    panelEditLast.value = split.last || "";
  }
  if (panelEditRelation) panelEditRelation.value = person.relation || "";
  if (panelEditBirth) panelEditBirth.value = person.birth || "";
  if (panelEditDeath) panelEditDeath.value = person.death || "";
  if (panelEditPhoto) panelEditPhoto.value = person.photo || "";
  if (panelEditNote) panelEditNote.value = person.note || "";
  if (panelEditStory) panelEditStory.value = person.story || "";
  const inferredGender = detectGenderFromName(person.name);
  panelGenderInputs.forEach((input) => {
    input.checked = inferredGender === input.value;
  });

  if (panelEditName) {
    panelEditName.oninput = () => {
      const split = splitNameByBin(panelEditName.value || "");
      if (panelEditFirst) panelEditFirst.value = split.first || "";
      if (panelEditLast) panelEditLast.value = split.last || "";
      const gender = detectGenderFromName(panelEditName.value);
      panelGenderInputs.forEach((input) => {
        input.checked = gender === input.value;
      });
    };
  }

  if (panelEditPhotoFile) {
    panelEditPhotoFile.onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        panelEditPhoto.value = dataUrl;
      } finally {
        panelEditPhotoFile.value = "";
      }
    };
  }

  if (panelEditBtn) {
    panelEditBtn.onclick = () => {
      const pw = window.prompt("Masukkan kata laluan:");
      if (pw !== "1234") return;
      if (panelEditForm) panelEditForm.hidden = false;
    };
  }

  if (panelCloseBtn) {
    panelCloseBtn.onclick = () => {
      if (panelEditForm) panelEditForm.hidden = true;
      if (storyPanel) storyPanel.hidden = true;
    };
  }

  if (panelCancelBtn) {
    panelCancelBtn.onclick = () => {
      if (panelEditForm) panelEditForm.hidden = true;
    };
  }

  if (panelDeleteBtn) {
    panelDeleteBtn.onclick = () => {
      if (!confirm(i18n[lang].modalDeleteConfirm)) return;
      deletePersonAndCleanup(person.id);
      storeData();
      rebuildFromData();
    };
  }

  if (panelEditForm) {
    panelEditForm.onsubmit = (event) => {
      event.preventDefault();
      const fullName = panelEditName.value.trim();
      const split = splitNameByBin(fullName);
      person.firstName = split.first || "";
      person.lastName = split.last || "";
      person.name = fullName;
      person.relation = panelEditRelation.value.trim();
      person.birth = panelEditBirth.value.trim();
      person.death = panelEditDeath.value.trim();
      person.photo = panelEditPhoto.value.trim();
      person.note = panelEditNote.value.trim();
      person.story = panelEditStory.value.trim();
      person.gender = detectGenderFromName(person.name);
      storeData();
      rebuildFromData();
      if (panelEditForm) panelEditForm.hidden = true;
      openModal(person);
    };
  }
}

function updateStoryPanel(person) {
  storyTitle.textContent = formatDisplayName(person.name);
  storyBody.textContent = person.story || person.note || i18n[lang].storyEmpty;
}

modal.addEventListener("click", (event) => {
  if (event.target.dataset.close) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
});

function applyZoom() {
  treeCanvas.style.transform = `scale(${scale})`;
  treeLines.style.transform = `scale(${scale})`;
  treeZoom.style.width = `${baseSize.width * scale}px`;
  treeZoom.style.height = `${baseSize.height * scale}px`;
  updateMinimap();
}

const actionEntries = [
  ["zoom-in", zoomInBtn],
  ["zoom-out", zoomOutBtn],
  ["zoom-reset", zoomResetBtn],
  ["reset-view", resetViewBtn],
  ["zoom-fit", zoomFitBtn],
  ["focus-elders", focusEldersBtn],
  ["back-top", backTopBtn],
  ["path-toggle", pathToggleBtn],
  ["compact-toggle", compactToggleBtn],
  ["toggle-theme", toggleThemeBtn],
  ["lang-toggle", langToggleBtn],
  ["view-toggle", viewToggle],
  ["export-png", exportPngBtn],
  ["export-pdf", exportPdfBtn],
  ["export-json", exportJsonBtn],
  ["import-json", importJsonBtn],
  ["validate-data", validateDataBtn],
  ["editor-toggle", editorToggle]
];
const actionMap = new Map(actionEntries.filter(([, el]) => el));

function runAction(actionId) {
  const btn = actionMap.get(actionId);
  if (btn) btn.click();
}

document.querySelectorAll(".mobile-actions [data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    runAction(btn.dataset.action);
  });
});

if (mobileActionSelect) {
  mobileActionSelect.addEventListener("change", () => {
    if (mobileActionGo) {
      mobileActionGo.disabled = !mobileActionSelect.value;
    }
  });
}

if (mobileActionGo) {
  mobileActionGo.addEventListener("click", () => {
    const actionId = mobileActionSelect?.value;
    if (!actionId) return;
    runAction(actionId);
    if (mobileActionSelect) mobileActionSelect.value = "";
    mobileActionGo.disabled = true;
  });
}

zoomInBtn.addEventListener("click", () => {
  scale = Math.min(2.2, scale + 0.1);
  applyZoom();
  savePrefs();
  scheduleRender();
});

zoomOutBtn.addEventListener("click", () => {
  scale = Math.max(0.6, scale - 0.1);
  applyZoom();
  savePrefs();
  scheduleRender();
});

zoomResetBtn.addEventListener("click", () => {
  scale = 1;
  applyZoom();
  savePrefs();
  scheduleRender();
});

zoomFitBtn.addEventListener("click", () => {
  fitToScreen();
  savePrefs();
});

if (focusEldersBtn) {
  focusEldersBtn.addEventListener("click", () => {
    const elder = findElderPerson();
    if (elder) focusPerson(elder.id, true);
  });
}

if (backTopBtn) {
  backTopBtn.addEventListener("click", () => {
    treeWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  });
}

if (pathToggleBtn) {
  pathToggleBtn.addEventListener("click", () => {
    pathMode = !pathMode;
    applyLineageHighlight();
    savePrefs();
  });
}

if (compactToggleBtn) {
  compactToggleBtn.addEventListener("click", () => {
    compactMode = !compactMode;
    document.body.classList.toggle("compact", compactMode);
    applyLanguage();
    savePrefs();
  });
}

if (langToggleBtn) {
  langToggleBtn.addEventListener("change", () => {
    lang = langToggleBtn.checked ? "en" : "ms";
    applyLanguage();
    scheduleRender();
    savePrefs();
  });
}

if (controlsToggleBtn) {
  controlsToggleBtn.addEventListener("click", () => {
    controlsCollapsed = !controlsCollapsed;
    document.body.classList.toggle("controls-collapsed", controlsCollapsed);
    applyLanguage();
    savePrefs();
  });
}

if (resetViewBtn) {
  resetViewBtn.addEventListener("click", () => {
    scale = 1;
    applyZoom();
    treeWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    savePrefs();
  });
}

if (clearCacheBtn) {
  clearCacheBtn.addEventListener("click", () => {
    clearSiteCache();
  });
}

if (exportJsonBtn) {
  exportJsonBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(treeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.download = `salasilah-backup-${stamp}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });
}

if (importJsonBtn && importJsonFile) {
  importJsonBtn.addEventListener("click", () => {
    importJsonFile.click();
  });

  importJsonFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const errors = validateTreeData(parsed);
      if (errors.length > 0) {
        validateOutput.textContent = `${i18n[lang].validateErr} ${errors.join(" | ")}`;
        return;
      }
      treeData = parsed;
      storeData();
      rebuildFromData();
      validateOutput.textContent = i18n[lang].validateOk;
    } catch (err) {
      validateOutput.textContent = i18n[lang].importFail;
    } finally {
      importJsonFile.value = "";
    }
  });
}

if (validateDataBtn) {
  validateDataBtn.addEventListener("click", () => {
    const errors = validateTreeData(treeData);
    if (errors.length === 0) {
      validateOutput.textContent = i18n[lang].validateOk;
    } else {
      validateOutput.textContent = `${i18n[lang].validateErr} ${errors.join(" | ")}`;
    }
  });
}

let isPanning = false;
let panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
let mousePanning = false;

treeWrap.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".person-card")) return;
  isPanning = true;
  treeWrap.setPointerCapture(event.pointerId);
  treeWrap.classList.add("is-dragging");
  panStart = {
    x: event.clientX,
    y: event.clientY,
    scrollLeft: treeWrap.scrollLeft,
    scrollTop: treeWrap.scrollTop
  };
  event.preventDefault();
});

treeWrap.addEventListener("pointermove", (event) => {
  if (!isPanning) return;
  if (!treeWrap.hasPointerCapture(event.pointerId)) return;
  const dx = event.clientX - panStart.x;
  const dy = event.clientY - panStart.y;
  treeWrap.scrollLeft = panStart.scrollLeft - dx;
  treeWrap.scrollTop = panStart.scrollTop - dy;
  event.preventDefault();
});

const stopPointerPan = (event) => {
  if (event && treeWrap.hasPointerCapture(event.pointerId)) {
    treeWrap.releasePointerCapture(event.pointerId);
  }
  isPanning = false;
  treeWrap.classList.remove("is-dragging");
};

treeWrap.addEventListener("pointerup", stopPointerPan);
treeWrap.addEventListener("pointercancel", stopPointerPan);

treeWrap.addEventListener("mousedown", (event) => {
  if (event.button !== 0) return;
  if (event.target.closest(".person-card")) return;
  mousePanning = true;
  treeWrap.classList.add("is-dragging");
  panStart = {
    x: event.clientX,
    y: event.clientY,
    scrollLeft: treeWrap.scrollLeft,
    scrollTop: treeWrap.scrollTop
  };
  event.preventDefault();
});

treeWrap.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

window.addEventListener("mousemove", (event) => {
  if (!mousePanning) return;
  const dx = event.clientX - panStart.x;
  const dy = event.clientY - panStart.y;
  treeWrap.scrollLeft = panStart.scrollLeft - dx;
  treeWrap.scrollTop = panStart.scrollTop - dy;
});

window.addEventListener("mouseup", () => {
  if (!mousePanning) return;
  mousePanning = false;
  treeWrap.classList.remove("is-dragging");
});

let scrollStopTimer = null;
treeWrap.addEventListener("scroll", () => {
  updateMinimap();
  if (scrollStopTimer) clearTimeout(scrollStopTimer);
  scrollStopTimer = setTimeout(() => {
    scheduleRender();
  }, 80);
});

window.addEventListener("resize", () => {
  scheduleRender();
  updateMinimap();
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (!query) {
    searchResults.classList.remove("active");
    searchResults.innerHTML = "";
    clearHighlights();
    lastSearchResults = [];
    return;
  }

  const results = treeData.people.filter((person) => person.name.toLowerCase().includes(query));
  searchResults.innerHTML = "";
  lastSearchResults = results;

  if (results.length === 0) {
    const item = document.createElement("div");
    item.className = "search-item";
    item.textContent = i18n[lang].searchNone;
    searchResults.appendChild(item);
  } else {
    results.forEach((person) => {
      const item = document.createElement("div");
      item.className = "search-item";
      item.textContent = formatDisplayName(person.name);
      item.addEventListener("click", () => {
        searchResults.classList.remove("active");
        searchInput.value = formatDisplayName(person.name);
        focusPerson(person.id, true);
      });
      searchResults.appendChild(item);
    });
  }

  searchResults.classList.toggle("active", true);
  highlightMatches(results.map((p) => p.id));
});

searchGoBtn.addEventListener("click", () => {
  if (lastSearchResults.length === 0) return;
  const person = lastSearchResults[0];
  focusPerson(person.id, true);
});

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
}

function highlightMatches(ids) {
  clearHighlights();
  ids.forEach((id) => {
    const el = elementByPersonId.get(id);
    if (el) el.classList.add("highlight");
  });
}

function focusPerson(personId, open = false) {
  const el = elementByPersonId.get(personId);
  const person = peopleById.get(personId);
  if (!person) return;

  if (viewMode !== "tree") {
    viewMode = "tree";
    applyViewMode();
    scheduleRender();
  }

  if (!el) {
    if (!nodeByPersonId.get(personId)) return;
    scheduleRender();
  }

  selectedPersonId = personId;
  updateStoryPanel(person);

  if (open) openModal(person);

  const rect = el.getBoundingClientRect();
  const wrapRect = treeWrap.getBoundingClientRect();
  const scrollLeft = treeWrap.scrollLeft + rect.left - wrapRect.left - wrapRect.width / 2 + rect.width / 2;
  const scrollTop = treeWrap.scrollTop + rect.top - wrapRect.top - wrapRect.height / 2 + rect.height / 2;
  treeWrap.scrollTo({ left: scrollLeft, top: scrollTop, behavior: "smooth" });
  updateUrlState();
}

if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("change", () => {
    const next = toggleThemeBtn.checked ? "dark" : "light";
    app.dataset.theme = next;
    document.body.dataset.theme = next;
    savePrefs();
  });
}

if (viewToggle) {
  viewToggle.addEventListener("click", () => {
    viewMode = viewMode === "tree" ? "timeline" : "tree";
    applyViewMode();
    applyLanguage();
    savePrefs();
    updateUrlState();
  });
}

exportPngBtn.addEventListener("click", async () => {
  if (!window.html2canvas) {
    alert(i18n[lang].exportPngFail);
    return;
  }
  const exportScale = Math.min(3, (window.devicePixelRatio || 1) * 1.5);
  const canvas = await window.html2canvas(treeZoom, { backgroundColor: null, scale: exportScale });
  const link = document.createElement("a");
  link.download = "salasilah-keluarga.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

exportPdfBtn.addEventListener("click", async () => {
  if (!window.html2canvas || !window.jspdf) {
    alert(i18n[lang].exportPdfFail);
    return;
  }

  const exportScale = Math.min(3, (window.devicePixelRatio || 1) * 1.5);
  const canvas = await window.html2canvas(treeZoom, { backgroundColor: null, scale: exportScale });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new window.jspdf.jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });

  const title = treeData.familyName || i18n[lang].appKicker;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.text(title, 40, 60);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  const locale = lang === "en" ? "en-US" : "ms-MY";
  const dateLabel = formatText(i18n[lang].exportDate, { date: new Date().toLocaleDateString(locale) });
  pdf.text(dateLabel, 40, 90);
  pdf.addPage([canvas.width, canvas.height], "landscape");
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("salasilah-keluarga.pdf");
});

window.addEventListener("load", () => {
  runPwaCleanupOnce();
  if (treeData) {
    renderScene();
    applyZoom();
  }
});

function updateMinimap() {
  if (!minimapCanvas || !layoutRoot) return;
  const rect = minimapCanvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const dpr = window.devicePixelRatio || 1;
  minimapCanvas.width = width * dpr;
  minimapCanvas.height = height * dpr;
  const ctx = minimapCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const scaleX = width / baseSize.width;
  const scaleY = height / baseSize.height;
  const miniScale = Math.min(scaleX, scaleY);

  ctx.save();
  ctx.scale(miniScale, miniScale);
  nodesList.forEach((node) => {
    if (!nodeVisible(node)) return;
    const w = node.ownWidth || layoutConfig.cardWidth;
    const h = 80;
    ctx.fillStyle = branchPalette[node.branchId] + "55";
    ctx.fillRect(node.x, node.y, w, h);
  });

  const viewW = treeWrap.clientWidth / scale;
  const viewH = treeWrap.clientHeight / scale;
  const viewX = treeWrap.scrollLeft / scale;
  const viewY = treeWrap.scrollTop / scale;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2 / miniScale;
  ctx.strokeRect(viewX, viewY, viewW, viewH);
  ctx.restore();
}

function fitToScreen() {
  const pad = 24;
  const targetScale = Math.min(
    (treeWrap.clientWidth - pad) / baseSize.width,
    (treeWrap.clientHeight - pad) / baseSize.height
  );
  scale = Math.max(0.5, Math.min(2.2, targetScale));
  applyZoom();
  treeWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
}

function findElderPerson() {
  const elderByRelation = treeData.people.find((p) => {
    const relation = (p.relation || "").toLowerCase();
    return relation.includes("tok") || relation.includes("wan");
  });
  if (elderByRelation) return elderByRelation;

  const firstRootUnion = treeData.unions.find((u) => u.partner1 || u.partner2);
  if (!firstRootUnion) return null;
  return peopleById.get(firstRootUnion.partner1) || peopleById.get(firstRootUnion.partner2) || null;
}

function applyLineageHighlight() {
  document.querySelectorAll(".person-card.path-on").forEach((el) => el.classList.remove("path-on"));
  if (!pathMode || !treeData.selfId) {
    applyLanguage();
    return;
  }
  const ids = getLineageIds(treeData.selfId);
  ids.forEach((id) => {
    const group = elementByPersonId.get(id);
    if (!group) return;
    group.querySelectorAll(".person-card").forEach((card) => card.classList.add("path-on"));
  });
  applyLanguage();
}

function getLineageIds(startId) {
  const result = new Set([startId]);
  let cursor = startId;
  let guard = 0;
  while (guard < 100) {
    guard += 1;
    const parentUnion = treeData.unions.find((u) => u.children.includes(cursor));
    if (!parentUnion) break;
    if (parentUnion.partner1) result.add(parentUnion.partner1);
    if (parentUnion.partner2) result.add(parentUnion.partner2);
    cursor = parentUnion.partner1 || parentUnion.partner2;
    if (!cursor) break;
  }
  return result;
}

function validateTreeData(data) {
  const errors = [];
  if (!data || !Array.isArray(data.people) || !Array.isArray(data.unions)) {
    return [i18n[lang].errStructure];
  }
  const ids = new Set();
  data.people.forEach((person) => {
    if (!person.id) errors.push(i18n[lang].errPersonNoId);
    if (ids.has(person.id)) errors.push(formatText(i18n[lang].errDuplicateId, { id: person.id }));
    ids.add(person.id);
  });

  const childMap = new Map();
  data.unions.forEach((union) => {
    if (!union.id) errors.push(i18n[lang].errUnionNoId);
    if (union.partner1 && !ids.has(union.partner1)) {
      errors.push(formatText(i18n[lang].errPartner1Missing, { id: union.partner1 }));
    }
    if (union.partner2 && !ids.has(union.partner2)) {
      errors.push(formatText(i18n[lang].errPartner2Missing, { id: union.partner2 }));
    }
    (union.children || []).forEach((childId) => {
      if (!ids.has(childId)) errors.push(formatText(i18n[lang].errChildMissing, { id: childId }));
      if (!childMap.has(childId)) childMap.set(childId, []);
      childMap.get(childId).push(union.id);
    });
  });

  childMap.forEach((unions, childId) => {
    if (unions.length > 1) {
      errors.push(formatText(i18n[lang].errChildMultiple, { id: childId, unions: unions.join(", ") }));
    }
  });
  return errors;
}

function syncMobileLabels() {
  if (mobileQuickZoomIn) mobileQuickZoomIn.textContent = zoomInBtn.textContent;
  if (mobileQuickZoomOut) mobileQuickZoomOut.textContent = zoomOutBtn.textContent;
  if (mobileQuickZoomFit) mobileQuickZoomFit.textContent = zoomFitBtn.textContent;
  if (mobileActionLabel) mobileActionLabel.textContent = i18n[lang].mobileActions;

  if (mobileActionSelect) {
    const placeholder = mobileActionSelect.querySelector('option[value=""]');
    if (placeholder) placeholder.textContent = i18n[lang].mobilePick;

    const optionMap = {
      "zoom-reset": zoomResetBtn,
      "reset-view": resetViewBtn,
      "toggle-theme": toggleThemeBtn,
      "lang-toggle": langToggleBtn,
      "export-png": exportPngBtn,
      "export-pdf": exportPdfBtn
    };

    Object.entries(optionMap).forEach(([value, btn]) => {
      const option = mobileActionSelect.querySelector(`option[value="${value}"]`);
      if (option && btn) option.textContent = btn.textContent;
    });
  }
}

function applyLanguage() {
  const t = i18n[lang];
  document.title = t.appKicker;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key && t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key && t[key] !== undefined) el.setAttribute("placeholder", t[key]);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key && t[key] !== undefined) el.setAttribute("title", t[key]);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key && t[key] !== undefined) el.setAttribute("aria-label", t[key]);
  });

  searchInput.placeholder = t.searchPlaceholder;
  if (viewToggle) viewToggle.textContent = viewMode === "timeline" ? t.viewTree : t.viewTimeline;
  if (compactToggleBtn) compactToggleBtn.textContent = compactMode ? t.compactOn : t.compactOff;
  if (pathToggleBtn) pathToggleBtn.textContent = pathMode ? t.pathOn : t.pathOff;
  if (focusEldersBtn) focusEldersBtn.textContent = t.focusElders;
  if (backTopBtn) backTopBtn.textContent = t.backTop;
  zoomFitBtn.textContent = t.fit;
  zoomInBtn.textContent = t.zoomIn;
  zoomOutBtn.textContent = t.zoomOut;
  zoomResetBtn.textContent = t.zoomReset;
  if (exportPngBtn) {
    const label = exportPngBtn.querySelector('[data-i18n="exportPng"]');
    if (label) label.textContent = t.exportPng;
  }
  if (exportPdfBtn) {
    const label = exportPdfBtn.querySelector('[data-i18n="exportPdf"]');
    if (label) label.textContent = t.exportPdf;
  }
  if (exportJsonBtn) exportJsonBtn.textContent = t.exportJson;
  if (importJsonBtn) importJsonBtn.textContent = t.importJson;
  if (validateDataBtn) validateDataBtn.textContent = t.validateData;
  if (editorToggle) editorToggle.textContent = t.editorToggle;
  toggleThemeBtn.checked = app.dataset.theme === "dark";
  langToggleBtn.checked = lang === "en";
  if (controlsToggleBtn) {
    controlsToggleBtn.textContent = controlsCollapsed ? t.controlsToggleOpen : t.controlsToggleClose;
  }

  const branchOptions = branchFilter?.options || [];
  if (branchOptions.length > 0) {
    branchOptions[0].textContent = t.branchAll;
    for (let i = 1; i < branchOptions.length; i += 1) {
      branchOptions[i].textContent = formatText(t.branchName, { n: i });
    }
  }

  if (editorParent?.options?.length) {
    editorParent.options[0].textContent = t.parentNone;
  }

  generationControls?.querySelectorAll(".gen-chip").forEach((chip) => {
    if (chip.dataset.reset) chip.textContent = t.genAll;
  });

  if (!selectedPersonId) {
    storyTitle.textContent = t.storyTitle;
    storyBody.textContent = t.storyEmpty;
  }

  if (modal?.classList.contains("active") && selectedPersonId) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  syncMobileLabels();
  if (minimapHandle) minimapHandle.textContent = t.minimapShow;
}

function minimapScrollTo(clientX, clientY) {
  const rect = minimapCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const scaleX = rect.width / baseSize.width;
  const scaleY = rect.height / baseSize.height;
  const miniScale = Math.min(scaleX, scaleY);
  const targetX = x / miniScale - treeWrap.clientWidth / (2 * scale);
  const targetY = y / miniScale - treeWrap.clientHeight / (2 * scale);
  treeWrap.scrollTo({ left: Math.max(0, targetX * scale), top: Math.max(0, targetY * scale) });
}

minimapCanvas.addEventListener("click", (event) => {
  minimapScrollTo(event.clientX, event.clientY);
});

const minimap = document.getElementById("minimap");
const minimapWrap = document.querySelector(".brand-minimap-wrap");
const minimapHandle = document.getElementById("minimap-handle");
if (minimap) {
  const activate = () => {
    minimap.classList.add("is-active");
  };
  const deactivate = () => {
    minimap.classList.remove("is-active");
  };
  let dragging = false;
  let hideTimer = null;
  let autoHideInterval = null;

  const scheduleHide = () => {
    if (!minimapWrap) return;
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      minimapWrap.classList.add("is-collapsed");
    }, 2500);
  };

  const showMinimap = () => {
    if (!minimapWrap) return;
    minimapWrap.classList.remove("is-collapsed");
    scheduleHide();
  };

  if (minimapWrap) {
    minimapWrap.classList.add("is-collapsed");
    minimapWrap.addEventListener("mouseenter", showMinimap);
    minimapWrap.addEventListener("focusin", showMinimap);
    minimapWrap.addEventListener("touchstart", showMinimap, { passive: true });
    setTimeout(() => minimapWrap.classList.add("is-collapsed"), 50);
  }

  if (minimapHandle) {
    minimapHandle.addEventListener("click", showMinimap);
    minimapHandle.addEventListener("touchstart", showMinimap, { passive: true });
  }

  minimap.addEventListener("pointerdown", (event) => {
    if (!minimapCanvas) return;
    dragging = true;
    minimap.setPointerCapture(event.pointerId);
    activate();
    minimapScrollTo(event.clientX, event.clientY);
    showMinimap();
    event.preventDefault();
  });

  minimap.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    minimapScrollTo(event.clientX, event.clientY);
    showMinimap();
    event.preventDefault();
  });

  const endDrag = (event) => {
    dragging = false;
    deactivate();
    if (event && minimap.hasPointerCapture(event.pointerId)) {
      minimap.releasePointerCapture(event.pointerId);
    }
  };

  minimap.addEventListener("pointerup", endDrag);
  minimap.addEventListener("pointercancel", endDrag);
  minimap.addEventListener("mouseleave", () => {
    if (dragging) endDrag();
  });
  minimap.addEventListener("mouseup", deactivate);

  scheduleHide();
  if (minimapWrap && !autoHideInterval) {
    autoHideInterval = setInterval(() => {
      if (!dragging) minimapWrap.classList.add("is-collapsed");
    }, 3500);
  }
  window.addEventListener("scroll", scheduleHide, true);
  window.addEventListener("touchend", scheduleHide, { passive: true });
}

function restoreFromUrl() {
  if (!GENERATION_FILTER_ENABLED) return;
  const params = new URLSearchParams(window.location.search);
  const focusId = params.get("focus");
  const genParam = params.get("gen");

  if (genParam) {
    const visible = genParam.split(",").map((v) => Number(v.trim())).filter(Boolean);
    hiddenGenerations.clear();
    for (let depth = 1; depth <= maxDepth; depth += 1) {
      if (!visible.includes(depth)) hiddenGenerations.add(depth);
    }
    buildGenerationControls();
  }

  if (focusId && peopleById.has(focusId)) {
    setTimeout(() => {
      focusPerson(focusId, false);
    }, 200);
  }
}

function updateUrlState() {
  const params = new URLSearchParams(window.location.search);
  if (selectedPersonId) params.set("focus", selectedPersonId);

  const visible = [];
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    if (!hiddenGenerations.has(depth)) visible.push(depth);
  }
  if (visible.length !== maxDepth) {
    params.set("gen", visible.join(","));
  } else {
    params.delete("gen");
  }

  history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}
