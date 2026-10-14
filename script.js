"use strict";

// ======================================================
// SELECTED ELEMENTS
// ======================================================

// HEADER
const navLinks = document.querySelectorAll(".nav-link");
const themeBtn = document.getElementById("themeBtn");

// PRESETS
const presetCards = document.querySelectorAll(".preset-card");
const presetsSeeAll = document.querySelector(".presets-see-all");

// IMAGE PREVIEW
const previewImage = document.getElementById("previewImage");
const previewImageWrapper = document.getElementById("previewImageWrapper");

const comparisonLine = document.getElementById("comparisonLine");
const comparisonHandle = document.getElementById("comparisonHandle");

// IMAGE ACTIONS
const imageUpload = document.getElementById("imageUpload");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const compareBtn = document.getElementById("compareBtn");
const downloadImageBtn = document.getElementById("downloadImageBtn");
const resetImageBtn = document.getElementById("resetImageBtn");

// FILTER CONTROLS
const resetAllFiltersBtn = document.getElementById("resetAllFiltersBtn");

const brightnessRange = document.getElementById("brightnessRange");
const brightnessValue = document.getElementById("brightnessValue");

const contrastRange = document.getElementById("contrastRange");
const contrastValue = document.getElementById("contrastValue");

const saturationRange = document.getElementById("saturationRange");
const saturationValue = document.getElementById("saturationValue");

const blurRange = document.getElementById("blurRange");
const blurValue = document.getElementById("blurValue");

const grayscaleRange = document.getElementById("grayscaleRange");
const grayscaleValue = document.getElementById("grayscaleValue");

const sepiaRange = document.getElementById("sepiaRange");
const sepiaValue = document.getElementById("sepiaValue");

const hueRotateRange = document.getElementById("hueRotateRange");
const hueRotateValue = document.getElementById("hueRotateValue");

const opacityRange = document.getElementById("opacityRange");
const opacityValue = document.getElementById("opacityValue");

// HISTOGRAM
const histogramSelect = document.querySelector(".histogram-select");
const histogramChart = document.querySelector(".histogram-chart");
const histogramBars = document.querySelectorAll(".histogram-chart span");

// FILTER STATS
const filterPresetsValue = document.getElementById("filterPresetsValue");

const activeFilterValue = document.getElementById("activeFilterValue");

const exportQualityValue = document.getElementById("exportQualityValue");

// FILTER SUMMARY
const brightnessSummaryValue = document.getElementById(
  "brightnessSummaryValue",
);

const contrastSummaryValue = document.getElementById("contrastSummaryValue");

const saturationSummaryValue = document.getElementById(
  "saturationSummaryValue",
);

const sepiaSummaryValue = document.getElementById("sepiaSummaryValue");

const hueRotateSummaryValue = document.getElementById("hueRotateSummaryValue");

// ======================================================
// STATE
// ======================================================

let presets = [];
let activePreset = "none";

let brightness = 100;
let contrast = 100;
let saturation = 100;
let blurAmount = 0;
let grayscale = 0;
let sepia = 0;
let hueRotate = 0;
let opacity = 100;

let comparisonPosition = 50;
let isComparing = true;

let originalImageSrc = previewImage.src;

let isDraggingComparison = false;

let areAllPresetsVisible = false;

let currentTheme = "dark";

const defaultImageSrc = previewImage.src;

// ======================================================
// LOAD IMAGE
// ======================================================

function loadImage(event) {
  const file = event.target.files[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  previewImage.src = imageUrl;
  originalImageSrc = imageUrl;

  resetFilters();
  updateImageComparison();
}

// ======================================================
// APPLY IMAGE FILTERS
// ======================================================

function applyImageFilters() {
  previewImage.style.filter = `
     brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
    blur(${blurAmount}px) 
    grayscale(${grayscale}%)
    sepia(${sepia}%)
    hue-rotate(${hueRotate}deg)  
    opacity(${opacity}%) 
    `;
}

// ======================================================
// UPDATE FILTER VALUES
// ======================================================

function updateFilterValues() {
  brightness = Number(brightnessRange.value);
  contrast = Number(contrastRange.value);
  saturation = Number(saturationRange.value);
  blurAmount = Number(blurRange.value);
  grayscale = Number(grayscaleRange.value);
  sepia = Number(sepiaRange.value);
  hueRotate = Number(hueRotateRange.value);
  opacity = Number(opacityRange.value);

  brightnessValue.textContent = `${brightness}%`;
  contrastValue.textContent = `${contrast}%`;
  saturationValue.textContent = `${saturation}%`;
  blurValue.textContent = `${blurAmount}px`;
  grayscaleValue.textContent = `${grayscale}%`;
  sepiaValue.textContent = `${sepia}%`;
  hueRotateValue.textContent = `${hueRotate}°`;
  opacityValue.textContent = `${opacity}%`;

  applyImageFilters();
  updateFilterSummary();
}

// ======================================================
// UPDATE RANGE PROGRESS
// ======================================================

function updateRangeProgress(range) {
  const min = Number(range.min);
  const max = Number(range.max);
  const value = Number(range.value);

  const progress = ((value - min) / (max - min)) * 100;

  range.style.setProperty("--range-progress", `${progress}%`);
}

// ======================================================
// RESET FILTERS
// ======================================================

function resetFilters() {
  brightnessRange.value = 100;
  contrastRange.value = 100;
  saturationRange.value = 100;
  blurRange.value = 0;
  grayscaleRange.value = 0;
  sepiaRange.value = 0;
  hueRotateRange.value = 0;
  opacityRange.value = 100;

  activePreset = "none";

  updateFilterValues();

  const ranges = [
    brightnessRange,
    contrastRange,
    saturationRange,
    blurRange,
    grayscaleRange,
    sepiaRange,
    hueRotateRange,
    opacityRange,
  ];

  ranges.forEach((range) => {
    updateRangeProgress(range);
  });

  updatePresetActiveState();
  updateFilterStats();
}

// ======================================================
// APPLY PRESET
// ======================================================

function applyPreset(preset) {
  if (preset === "none") {
    brightnessRange.value = 100;
    contrastRange.value = 100;
    saturationRange.value = 100;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 0;
    hueRotateRange.value = 0;
    opacityRange.value = 100;
  }

  if (preset === "cinematic") {
    brightnessRange.value = 90;
    contrastRange.value = 115;
    saturationRange.value = 90;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 8;
    hueRotateRange.value = 0;
    opacityRange.value = 100;
  }

  if (preset === "vibrant") {
    brightnessRange.value = 105;
    contrastRange.value = 108;
    saturationRange.value = 155;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 0;
    hueRotateRange.value = 0;
    opacityRange.value = 100;
  }

  if (preset === "vintage") {
    brightnessRange.value = 102;
    contrastRange.value = 95;
    saturationRange.value = 80;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 45;
    hueRotateRange.value = 0;
    opacityRange.value = 100;
  }

  if (preset === "black-white") {
    brightnessRange.value = 100;
    contrastRange.value = 112;
    saturationRange.value = 100;
    blurRange.value = 0;
    grayscaleRange.value = 100;
    sepiaRange.value = 0;
    hueRotateRange.value = 0;
    opacityRange.value = 100;
  }

  if (preset === "moody") {
    brightnessRange.value = 78;
    contrastRange.value = 120;
    saturationRange.value = 75;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 0;
    hueRotateRange.value = 0;
    opacityRange.value = 100;
  }

  if (preset === "sunset") {
    brightnessRange.value = 105;
    contrastRange.value = 100;
    saturationRange.value = 135;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 28;
    hueRotateRange.value = 352;
    opacityRange.value = 100;
  }

  if (preset === "cool-tone") {
    brightnessRange.value = 102;
    contrastRange.value = 105;
    saturationRange.value = 95;
    blurRange.value = 0;
    grayscaleRange.value = 0;
    sepiaRange.value = 0;
    hueRotateRange.value = 18;
    opacityRange.value = 100;
  }

  activePreset = preset;

  updateFilterValues();

  const ranges = [
    brightnessRange,
    contrastRange,
    saturationRange,
    blurRange,
    grayscaleRange,
    sepiaRange,
    hueRotateRange,
    opacityRange,
  ];

  ranges.forEach((range) => {
    updateRangeProgress(range);
  });

  updatePresetActiveState();
  updateFilterStats();
}

// ======================================================
// PRESET ACTIVE STATE
// ======================================================

function updatePresetActiveState() {
  presetCards.forEach((card) => {
    card.classList.remove("active");

    if (card.dataset.preset === activePreset) {
      card.classList.add("active");
    }
  });
}

function updatePresetVisibility() {
  presetCards.forEach((card, index) => {
    if (index >= 4) {
      card.hidden = !areAllPresetsVisible;
    }
  });

  if (areAllPresetsVisible) {
    presetsSeeAll.innerHTML = `
      Show less 
      <i class="bi bi-arrow-left"></i>
    `;
  } else {
    presetsSeeAll.innerHTML = `
      See all
      <i class="bi bi-arrow-right"></i>
    `;
  }
}

function togglePresetVisibility() {
  areAllPresetsVisible = !areAllPresetsVisible;

  updatePresetVisibility();
}

// ======================================================
// IMAGE COMPARISON
// ======================================================

function updateImageComparison() {
  previewImageWrapper.style.backgroundImage = `url("${originalImageSrc}")`;
  previewImageWrapper.style.backgroundSize = "cover";
  previewImageWrapper.style.backgroundPosition = "center";

  if (!isComparing) {
    previewImage.style.clipPath = "none";
    comparisonLine.style.display = "none";
    return;
  }

  previewImage.style.clipPath = `inset(0 0 0 ${comparisonPosition}%)`;

  comparisonLine.style.display = "block";
  comparisonLine.style.left = `${comparisonPosition}%`;
}

function startImageComparison() {
  isDraggingComparison = true;
}

function moveImageComparison(event) {
  if (!isDraggingComparison) return;

  const wrapperRect = previewImageWrapper.getBoundingClientRect();

  const mousePosition = event.clientX - wrapperRect.left;

  const position = (mousePosition / wrapperRect.width) * 100;

  comparisonPosition = Math.max(0, Math.min(100, position));

  updateImageComparison();
}

function stopImageComparison() {
  isDraggingComparison = false;
}

function toggleImageComparison() {
  isComparing = !isComparing;

  updateImageComparison();
}

// ======================================================
// RESET IMAGE
// ======================================================

function resetImage() {
  previewImage.src = defaultImageSrc;
  originalImageSrc = defaultImageSrc;

  comparisonPosition = 50;
  isComparing = true;

  resetFilters();
  updateImageComparison();

  imageUpload.value = "";
}

// ======================================================
// DOWNLOAD IMAGE
// ======================================================

function downloadImage() {
  const canvas = document.createElement("canvas");

  const context = canvas.getContext("2d");

  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;

  context.filter = `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
    blur(${blurAmount}px)
    grayscale(${grayscale}%)
    sepia(${sepia}%)
    hue-rotate(${hueRotate}deg)
    opacity(${opacity}%)
  `;

  context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

  const imageUrl = canvas.toDataURL("image/png");

  const downloadLink = document.createElement("a");

  downloadLink.href = imageUrl;
  downloadLink.download = "filtered-image.png";

  downloadLink.click();
}

// ======================================================
// HISTOGRAM
// ======================================================

function updateHistogram() {
  const selectedColor = histogramSelect.value;

  histogramBars.forEach((bar) => {
    if (selectedColor === "rgb") {
      bar.style.background = "";

      return;
    }

    if (selectedColor === "red") {
      bar.style.background = "linear-gradient(180deg, #ef4444, #b91c1c)";
    }

    if (selectedColor === "green") {
      bar.style.background = "linear-gradient(180deg, #10b981, #047857)";
    }

    if (selectedColor === "blue") {
      bar.style.background = "linear-gradient(180deg, #3b82f6, #1d4ed8)";
    }
  });
}

// ======================================================
// FILTER STATS
// ======================================================

function updateFilterStats() {
  const presetNames = {
    none: "None",
    custom: "Custom",
    cinematic: "Cinematic",
    vibrant: "Vibrant",
    vintage: "Vintage",
    "black-white": "Black & White",
    moody: "Moody",
    sunset: "Sunset",
    "cool-tone": "Cool Tone",
  };

  filterPresetsValue.textContent = presetCards.length;
  activeFilterValue.textContent = presetNames[activePreset];
  exportQualityValue.textContent = "High (4K)";
}

// ======================================================
// FILTER SUMMARY
// ======================================================

function updateFilterSummary() {
  const brightnessDifference = brightness - 100;
  const contrastDifference = contrast - 100;
  const saturationDifference = saturation - 100;

  brightnessSummaryValue.textContent = `${brightnessDifference > 0 ? "+" : ""}${brightnessDifference}%`;

  contrastSummaryValue.textContent = `${contrastDifference > 0 ? "+" : ""}${contrastDifference}%`;

  saturationSummaryValue.textContent = `${saturationDifference > 0 ? "+" : ""}${saturationDifference}%`;

  sepiaSummaryValue.textContent = `${sepia > 0 ? "+" : ""}${sepia}%`;

  hueRotateSummaryValue.textContent = `${hueRotate}°`;
}

// ======================================================
// THEME
// ======================================================

function loadTheme() {
  const storedTheme = localStorage.getItem("imageFilterStudioTheme");

  if (storedTheme) {
    currentTheme = storedTheme;
  }

  applyTheme();
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme();

  localStorage.setItem("imageFilterStudioTheme", currentTheme);
}

// ======================================================
// NAVIGATION
// ======================================================

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    navLinks.forEach((navLink) => {
      navLink.classList.remove("active");
    });

    link.classList.add("active");
  });
});

// ======================================================
// EVENT LISTENERS
// ======================================================

const filterRanges = [
  brightnessRange,
  contrastRange,
  saturationRange,
  blurRange,
  grayscaleRange,
  sepiaRange,
  hueRotateRange,
  opacityRange,
];

filterRanges.forEach((range) => {
  range.addEventListener("input", () => {
    updateFilterValues();
    updateRangeProgress(range);

    activePreset = "custom";

    updatePresetActiveState();
    updateFilterStats();
  });
});

presetCards.forEach((card) => {
  card.addEventListener("click", () => {
    applyPreset(card.dataset.preset);
  });
});

resetAllFiltersBtn.addEventListener("click", resetFilters);
resetFiltersBtn.addEventListener("click", resetFilters);

imageUpload.addEventListener("change", loadImage);

downloadImageBtn.addEventListener("click", downloadImage);

histogramSelect.addEventListener("change", updateHistogram);

themeBtn.addEventListener("click", toggleTheme);

comparisonHandle.addEventListener("pointerdown", startImageComparison);

document.addEventListener("pointermove", moveImageComparison);

document.addEventListener("pointerup", stopImageComparison);

compareBtn.addEventListener("click", toggleImageComparison);

resetImageBtn.addEventListener("click", resetImage);

// ======================================================
// INIT APP
// ======================================================

function initApp() {
  loadTheme();

  updateFilterValues();

  const ranges = [
    brightnessRange,
    contrastRange,
    saturationRange,
    blurRange,
    grayscaleRange,
    sepiaRange,
    hueRotateRange,
    opacityRange,
  ];

  ranges.forEach((range) => {
    updateRangeProgress(range);
  });

  updatePresetActiveState();
  updateFilterStats();
  updateImageComparison();
  updatePresetVisibility();
}

initApp();
