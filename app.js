(() => {
  const center = [32.88, -97.05];
  const layerNames = {
    diabetes: "Diabetes burden",
    svi: "Social vulnerability",
    clinics: "Clinics & care",
    shortage: "Shortage areas",
    specialty: "Specialty access",
  };
  const layerColors = {
    diabetes: ["#8eb7a6", "#e4a264", "#d27768"],
    svi: ["#9fc7bd", "#9d8bc7", "#7460a9"],
    shortage: ["#f0ca83", "#dd985d", "#c76a57"],
    specialty: ["#98c9c2", "#5ba69e", "#357c79"],
  };
  const demoAreas = [
    { name: "Northwest sample area", center: [32.94, -97.34], radius: 4800, burden: 0.35, svi: 0.72, shortage: 0.55, specialty: 0.35, filters: ["high-need", "limited-access"] },
    { name: "Northeast sample area", center: [32.98, -96.73], radius: 4300, burden: 0.78, svi: 0.43, shortage: 0.75, specialty: 0.72, filters: ["high-need", "limited-access"] },
    { name: "Central sample area", center: [32.78, -96.81], radius: 3900, burden: 0.55, svi: 0.82, shortage: 0.35, specialty: 0.58, filters: ["high-need", "care-nearby"] },
    { name: "Southwest sample area", center: [32.69, -97.31], radius: 4600, burden: 0.82, svi: 0.65, shortage: 0.85, specialty: 0.32, filters: ["high-need", "limited-access"] },
    { name: "Southeast sample area", center: [32.70, -96.72], radius: 4100, burden: 0.68, svi: 0.89, shortage: 0.65, specialty: 0.48, filters: ["high-need", "limited-access"] },
    { name: "Mid-cities sample area", center: [32.83, -97.10], radius: 3700, burden: 0.38, svi: 0.35, shortage: 0.25, specialty: 0.82, filters: ["care-nearby"] },
    { name: "North sample area", center: [33.08, -96.80], radius: 4300, burden: 0.25, svi: 0.22, shortage: 0.15, specialty: 0.88, filters: ["care-nearby"] },
    { name: "West sample area", center: [32.75, -97.48], radius: 4000, burden: 0.48, svi: 0.52, shortage: 0.58, specialty: 0.42, filters: ["limited-access"] },
  ];
  const demoClinics = [
    { name: "Sample clinic — Dallas", position: [32.80, -96.84] },
    { name: "Sample clinic — Fort Worth", position: [32.75, -97.33] },
    { name: "Sample clinic — Plano", position: [33.02, -96.70] },
    { name: "Sample clinic — Arlington", position: [32.74, -97.10] },
    { name: "Sample clinic — Irving", position: [32.86, -96.96] },
  ];
  const activeLayers = new Set(["diabetes"]);
  const activeFilters = new Set();

  if (!window.L) {
    document.getElementById("map").innerHTML =
      '<div class="map-error">The map could not load. Check your internet connection and refresh to try again.</div>';
    return;
  }

  const map = L.map("map", { zoomControl: false, preferCanvas: true }).setView(center, 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const areaLayer = L.layerGroup().addTo(map);
  const clinicLayer = L.layerGroup();
  const markers = [];
  let toastTimer;

  function areaColor(value, palette) {
    const colors = layerColors[palette];
    if (value < 0.34) return colors[0];
    if (value < 0.67) return colors[1];
    return colors[2];
  }

  function showToast(message) {
    const toast = document.getElementById("map-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function activeDataLayer() {
    return ["diabetes", "svi", "shortage", "specialty"].find((layer) => activeLayers.has(layer));
  }

  function renderAreas() {
    areaLayer.clearLayers();
    const dataLayer = activeDataLayer();
    const visibleAreas = demoAreas.filter((area) =>
      Array.from(activeFilters).every((filter) => area.filters.includes(filter)),
    );

    visibleAreas.forEach((area) => {
      if (dataLayer) {
        const value = area[dataLayer];
        const circle = L.circle(area.center, {
          radius: area.radius,
          color: areaColor(value, dataLayer),
          weight: 1,
          opacity: 0.65,
          fillColor: areaColor(value, dataLayer),
          fillOpacity: 0.3 + value * 0.2,
        });
        circle.bindPopup(`<strong>${area.name}</strong><br>${layerNames[dataLayer]}: illustrative demo value`);
        areaLayer.addLayer(circle);
      }
    });

    markers.forEach(({ marker, area }) => {
      marker.setOpacity(visibleAreas.includes(area) ? 1 : 0.25);
    });
    document.getElementById("visible-count").textContent = String(visibleAreas.length);
    document.getElementById("legend-layer").textContent = dataLayer
      ? layerNames[dataLayer]
      : "Select an area layer";
    document.querySelector(".legend-swatch").style.background = dataLayer
      ? `linear-gradient(90deg, ${layerColors[dataLayer].join(", ")})`
      : "#d9e2df";
  }

  function toggleLayer(layer, enabled) {
    if (enabled) activeLayers.add(layer);
    else activeLayers.delete(layer);

    if (layer === "clinics") {
      if (enabled) clinicLayer.addTo(map);
      else map.removeLayer(clinicLayer);
      document.querySelector(".clinics-legend").classList.toggle("is-visible", enabled);
    }

    renderAreas();
    if (enabled && !["clinics", ...Object.keys(layerColors)].includes(layer)) {
      showToast("This layer is ready for research data.");
    }
  }

  demoClinics.forEach((clinic, index) => {
    const marker = L.marker(clinic.position, {
      icon: L.divIcon({
        className: "",
        html: '<span class="sample-marker">+</span>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    });
    marker.bindPopup(`<strong>${clinic.name}</strong><br><small>Illustrative placeholder location</small>`);
    clinicLayer.addLayer(marker);
    markers.push({ marker, area: demoAreas[[2, 5, 6, 5, 5][index]] });
  });

  document.querySelectorAll(".layer-row").forEach((button) => {
    button.addEventListener("click", () => {
      const layer = button.dataset.layer;
      const enabled = button.getAttribute("aria-pressed") !== "true";
      if (enabled && Object.hasOwn(layerColors, layer)) {
        Object.keys(layerColors).forEach((otherLayer) => {
          activeLayers.delete(otherLayer);
          const otherButton = document.querySelector(`[data-layer="${otherLayer}"]`);
          otherButton.setAttribute("aria-pressed", "false");
          otherButton.classList.remove("is-active");
        });
      }
      button.setAttribute("aria-pressed", String(enabled));
      button.classList.toggle("is-active", enabled);
      toggleLayer(layer, enabled);
    });
  });

  document.getElementById("reset-layers").addEventListener("click", () => {
    activeLayers.clear();
    activeLayers.add("diabetes");
    activeFilters.clear();
    document.querySelectorAll(".layer-row").forEach((button) => {
      const enabled = button.dataset.layer === "diabetes";
      button.setAttribute("aria-pressed", String(enabled));
      button.classList.toggle("is-active", enabled);
    });
    document.querySelectorAll(".filter-chip").forEach((button) => button.setAttribute("aria-pressed", "false"));
    map.removeLayer(clinicLayer);
    document.querySelector(".clinics-legend").classList.remove("is-visible");
    updateFilterCount();
    renderAreas();
    showToast("Map layers and filters reset.");
  });

  function updateFilterCount() {
    document.getElementById("filter-count").textContent = `${activeFilters.size} active`;
  }

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      const enabled = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(enabled));
      if (enabled) activeFilters.add(filter);
      else activeFilters.delete(filter);
      updateFilterCount();
      renderAreas();
      if (enabled) showToast(`Showing areas matching all selected filters.`);
    });
  });

  const searchInput = document.getElementById("map-search");
  function searchPlace() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query || "dfw dallas fort worth".includes(query) || query.includes("dallas") || query.includes("fort worth")) {
      map.setView(center, query ? 11 : 10);
      return;
    }
    const place = {
      plano: [33.0198, -96.6989],
      irving: [32.814, -96.9489],
      arlington: [32.7357, -97.1081],
      garland: [32.9126, -96.6389],
      denton: [33.2148, -97.1331],
      frisco: [33.1507, -96.8236],
      mckinney: [33.1972, -96.6397],
      "grand prairie": [32.746, -96.9978],
    }[query];
    if (place) {
      map.setView(place, 12);
      showToast(`Showing ${query.replace(/\b\w/g, (character) => character.toUpperCase())}.`);
    } else {
      showToast("Try Dallas, Fort Worth, Plano, Irving, Arlington, or Denton.");
    }
  }

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchPlace();
    if (event.key === "Escape") {
      searchInput.value = "";
      searchPlace();
    }
  });
  document.getElementById("locate-dfw").addEventListener("click", () => map.setView(center, 10));
  document.getElementById("clear-search").addEventListener("click", () => {
    searchInput.value = "";
    map.setView(center, 10);
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
    }
  });

  renderAreas();
})();
