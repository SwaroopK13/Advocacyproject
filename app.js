(() => {
  const center = [32.88, -97.05];
  const layerNames = {
    diabetes: "Diabetes burden",
    svi: "Social vulnerability",
    clinics: "Clinics & care",
    shortage: "Shortage areas",
    specialty: "Specialty access",
  };
  const summaryLayers = ["diabetes", "svi", "shortage", "specialty"];
  const layerFacts = {
    diabetes: {
      headline: "12.1%",
      label: "Adult diabetes prevalence · Dallas County",
      details: [
        "Parkland Diabetes Registry: 54,056 patients in 2021 and 74,282 in 2024 (+37.4%).",
      ],
      caveat:
        "County-level estimate only; tract-level values are not in the research PDF. Registry enrollment is not county prevalence.",
      source: "CDC PLACES 2023–2024, as reported by RHT Compass; Parkland registry figures in the research brief.",
    },
    svi: {
      headline: "0.89",
      label: "Overall SVI percentile · Dallas County",
      details: [
        "Socioeconomic status: 0.93",
        "Household composition and disability: 0.72",
        "Minority status and language: 0.97",
        "Housing type and transportation: 0.72",
      ],
      caveat:
        "County-level percentiles do not show within-county variation. Tract-level SVI values are not included.",
      source: "CDC/ATSDR SVI 2022, as reported by RHT Compass.",
    },
    shortage: {
      headline: "Boundary data not provided",
      label: "No shortage areas are drawn",
      details: [
        "The brief points to HRSA and Texas DSHS primary-care designations as sources for official boundaries.",
        "Primary-care shortage status does not establish an eye-care specialist shortage.",
      ],
      caveat: "No designation records or boundary geometry were included in the research PDF.",
      source: "Texas DSHS Health Professional Shortage Area Designations.",
    },
    specialty: {
      headline: "13%",
      label: "Adults without reliable transportation · Dallas County",
      details: [
        "Distance to the nearest verified eye-care provider: not calculated.",
        "Provider counts by tract, travel times, and confirmed AI screening locations: not established.",
      ],
      caveat: "County-level transportation statistic only; it does not measure tract-level specialty-care access.",
      source: "Texas Health Resources 2025 Community Health Needs Assessment, as summarized in the research PDF.",
    },
    clinics: {
      headline: "6 locations",
      label: "Research-listed healthcare facilities",
      details: [
        "3 retina specialty clinics and 3 community health centers.",
        "AI-based diabetic eye screening availability is unverified at every location.",
      ],
      caveat: "Marker positions are approximate address points from the U.S. Census Geocoder.",
      source: "Facility names and addresses from the research PDF; coordinates geocoded with the U.S. Census Geocoder.",
    },
  };
  const facilities = [
    {
      name: "Retina Center of Texas",
      address: "12222 N Central Expy, Suite 250, Dallas, TX 75243",
      position: [32.915553722799, -96.766886379761],
      type: "Retina specialty clinic",
      category: "specialty",
      detail: "Provides care for diabetic retinopathy and other retinal conditions.",
    },
    {
      name: "Retina Specialists",
      address: "10740 N Central Expy, Suite 100, Dallas, TX 75231",
      position: [32.893856995433, -96.768663372336],
      type: "Retina specialty clinic",
      category: "specialty",
      detail: "Provides medical and surgical retinal care, including diabetic retinopathy.",
    },
    {
      name: "Retina of North Texas",
      address: "11615 Forest Central Dr, Suite 308, Dallas, TX 75243",
      position: [32.907175582769, -96.767176601088],
      type: "Retina specialty clinic",
      category: "specialty",
      detail: "Treats diabetic retinopathy and other retinal conditions.",
    },
    {
      name: "HHM Health at South Dallas",
      address: "3639 Holmes St, Dallas, TX 75215",
      position: [32.756479168474, -96.773393705889],
      type: "Community health center",
      category: "community",
      detail: "Community-based healthcare.",
    },
    {
      name: "LBU Community Clinic, West Dallas",
      address: "809 Singleton Blvd, Dallas, TX 75212",
      position: [32.778608846664, -96.836452415411],
      type: "Community health center",
      category: "community",
      detail: "Primary and preventive healthcare services.",
    },
    {
      name: "Texas Native Health",
      address: "1283 Record Crossing Rd, Dallas, TX 75235",
      position: [32.815810725137, -96.861117170878],
      type: "Community health center",
      category: "community",
      detail: "Community-based health services.",
    },
  ];
  const activeLayers = new Set(["diabetes"]);

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

  const clinicLayer = L.layerGroup();
  let toastTimer;

  function showToast(message) {
    const toast = document.getElementById("map-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function activeDataLayer() {
    if (activeLayers.has("clinics")) return "clinics";
    return summaryLayers.find((layer) => activeLayers.has(layer));
  }

  function addTextElement(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }

  function renderResearchCard() {
    const card = document.getElementById("research-content");
    const layer = activeDataLayer();
    card.replaceChildren();

    if (!layer) {
      addTextElement(card, "p", "research-empty", "Select a layer to view the available research data.");
      return;
    }

    const facts = layerFacts[layer];
    addTextElement(card, "strong", "research-metric", facts.headline);
    addTextElement(card, "p", "research-label", facts.label);

    if (facts.details.length) {
      const details = document.createElement("ul");
      details.className = "research-details";
      facts.details.forEach((detail) => addTextElement(details, "li", "", detail));
      card.append(details);
    }

    addTextElement(card, "p", "research-caveat", facts.caveat);
    addTextElement(card, "p", "research-source", `Source: ${facts.source}`);
  }

  function renderMapState() {
    const clinicsVisible = activeLayers.has("clinics");
    document.getElementById("visible-count").textContent = clinicsVisible ? String(facilities.length) : "0";
    document.getElementById("legend-layer").textContent = layerNames[activeDataLayer()] || "Select a layer";
    renderResearchCard();
  }

  function toggleLayer(layer, enabled) {
    if (enabled) activeLayers.add(layer);
    else activeLayers.delete(layer);

    if (layer === "clinics") {
      if (enabled) clinicLayer.addTo(map);
      else map.removeLayer(clinicLayer);
      document.querySelector(".clinics-legend").classList.toggle("is-visible", enabled);
    }

    renderMapState();
  }

  facilities.forEach((facility) => {
    const marker = L.marker(facility.position, {
      icon: L.divIcon({
        className: "",
        html: `<span class="facility-marker facility-marker--${facility.category}" aria-hidden="true">${facility.category === "specialty" ? "+" : "●"}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    });
    marker.bindPopup(
      `<strong>${facility.name}</strong><br><small>${facility.type}</small><br>${facility.address}<br>${facility.detail}<br><small>AI screening availability: Unknown</small>`,
    );
    clinicLayer.addLayer(marker);
  });

  document.querySelectorAll(".layer-row").forEach((button) => {
    button.addEventListener("click", () => {
      const layer = button.dataset.layer;
      const enabled = button.getAttribute("aria-pressed") !== "true";
      if (enabled && summaryLayers.includes(layer)) {
        summaryLayers.forEach((otherLayer) => {
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
    document.querySelectorAll(".layer-row").forEach((button) => {
      const enabled = button.dataset.layer === "diabetes";
      button.setAttribute("aria-pressed", String(enabled));
      button.classList.toggle("is-active", enabled);
    });
    map.removeLayer(clinicLayer);
    document.querySelector(".clinics-legend").classList.remove("is-visible");
    renderMapState();
    showToast("Map layers reset.");
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

  renderMapState();
})();
