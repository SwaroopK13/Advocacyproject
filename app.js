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
    "california-svi": {
      headline: "58 counties",
      label: "Population-weighted SVI overall mean",
      details: [
        "Higher values indicate greater modeled social vulnerability.",
        "County summaries combine 2022 census tract SVI scores.",
      ],
      caveat: "County averages are not tract-level maps and should not be used alone to identify individuals or neighborhoods.",
      source: "CDC/ATSDR Social Vulnerability Index 2022, ACS 2018–2022.",
    },
    "california-clinics": {
      headline: "3,133 locations",
      label: "HRSA health center sites in California",
      details: [
        "2,729 permanent, 309 mobile, and 95 seasonal or school-related entries.",
        "Screening fields are mostly unknown; no duplicate removal was applied.",
      ],
      caveat: "Coordinates and screening details come from the workbook. Locations and availability should be independently verified.",
      source: "California Healthcare Locations workbook; HRSA health center data.",
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
  const californiaSvi = {
    "06001": 0.406, "06003": 0.519, "06005": 0.382, "06007": 0.519, "06009": 0.377,
    "06011": 0.704, "06013": 0.378, "06015": 0.526, "06017": 0.269, "06019": 0.653,
    "06021": 0.667, "06023": 0.558, "06025": 0.788, "06027": 0.485, "06029": 0.614,
    "06031": 0.625, "06033": 0.604, "06035": 0.471, "06037": 0.593, "06039": 0.682,
    "06041": 0.274, "06043": 0.518, "06045": 0.666, "06047": 0.730, "06049": 0.578,
    "06051": 0.407, "06053": 0.603, "06055": 0.479, "06057": 0.299, "06059": 0.444,
    "06061": 0.236, "06063": 0.454, "06065": 0.508, "06067": 0.487, "06069": 0.472,
    "06071": 0.575, "06073": 0.446, "06075": 0.400, "06077": 0.563, "06079": 0.373,
    "06081": 0.328, "06083": 0.535, "06085": 0.352, "06087": 0.428, "06089": 0.496,
    "06091": 0.487, "06093": 0.560, "06095": 0.418, "06097": 0.407, "06099": 0.599,
    "06101": 0.646, "06103": 0.609, "06105": 0.574, "06107": 0.692, "06109": 0.462,
    "06111": 0.440, "06113": 0.454, "06115": 0.575,
  };
  let currentRegion = "dfw";
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
  const californiaClinicLayer = L.layerGroup();
  let californiaClinicCount = 0;
  const californiaClinicRenderer = L.canvas({ padding: 0.5 });
  fetch("data/california-healthcare-locations.json")
    .then((response) => {
      if (!response.ok) throw new Error(`California locations request failed: ${response.status}`);
      return response.json();
    })
    .then((locations) => {
      locations.forEach((facility) => {
        const eye = (facility.eye || "").toLowerCase();
        const reported = eye && !eye.includes("unknown") && !eye.includes("not verified");
        const setting = (facility.locationType || "").toLowerCase();
        const radius = setting.includes("mobile") || setting.includes("seasonal") ? 3.5 : 4.5;
        const marker = L.circleMarker([facility.lat, facility.lon], {
          renderer: californiaClinicRenderer,
          radius,
          color: "#ffffff",
          weight: 0.8,
          fillColor: reported ? "#c86d5a" : "#34877f",
          fillOpacity: 0.78,
        });
        const website = facility.website
          ? `<br><a href="${facility.website.startsWith("http") ? facility.website : `https://${facility.website}`}" target="_blank" rel="noreferrer">Website</a>`
          : "";
        const phone = facility.phone ? `<br>${facility.phone}` : "";
        marker.bindPopup(
          `<strong>${facility.name}</strong><br><small>${facility.locationType || facility.type}</small><br>${facility.address}, ${facility.city}, CA ${facility.zip}${phone}${website}<br><small>Diabetic eye/retinal care: ${facility.eye || "Unknown"}</small><br><small>AI-assisted screening: ${facility.ai || "Unknown"}</small><br><small>Source coordinates; screening availability not independently verified.</small>`,
        );
        californiaClinicLayer.addLayer(marker);
      });
      californiaClinicCount = locations.length;
      if (currentRegion === "california" && activeLayers.has("clinics")) renderMapState();
    })
    .catch((error) => {
      console.error(error);
      showToast("California healthcare locations could not be loaded.");
    });
  const californiaSviLayer = L.geoJson(null, {
    style(feature) {
      const value = californiaSvi[feature.properties.GEOID];
      return {
        fillColor: sviColor(value),
        fillOpacity: value == null ? 0.2 : 0.72,
        color: "#ffffff",
        opacity: 0.9,
        weight: 0.8,
      };
    },
    onEachFeature(feature, countyLayer) {
      const value = californiaSvi[feature.properties.GEOID];
      const score = value == null ? "Not available" : value.toFixed(3);
      countyLayer.bindPopup(
        `<strong>${feature.properties.NAME}</strong><br><small>Population-weighted overall SVI: ${score}</small><br><small>CDC/ATSDR SVI 2022</small>`,
      );
      countyLayer.on({
        mouseover(event) {
          event.target.setStyle({ weight: 2, color: "#4d6d65", fillOpacity: 0.88 });
        },
        mouseout(event) {
          californiaSviLayer.resetStyle(event.target);
        },
      });
    },
  });
  fetch("data/california-counties.geojson")
    .then((response) => {
      if (!response.ok) throw new Error(`County boundary request failed: ${response.status}`);
      return response.json();
    })
    .then((geojson) => californiaSviLayer.addData(geojson))
    .catch((error) => {
      console.error(error);
      showToast("California county boundaries could not be loaded.");
    });
  let toastTimer;

  function showToast(message) {
    const toast = document.getElementById("map-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function activeDataLayer() {
    if (activeLayers.has("clinics")) {
      return currentRegion === "california" ? "california-clinics" : "clinics";
    }
    if (currentRegion === "california" && activeLayers.has("svi")) return "california-svi";
    return summaryLayers.find((layer) => activeLayers.has(layer));
  }

  function sviColor(value) {
    if (value == null) return "#cbd6d2";
    if (value < 0.25) return "#d7e9df";
    if (value < 0.50) return "#91bea7";
    if (value < 0.75) return "#e3c06f";
    return "#bd625b";
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
    const californiaSviVisible = currentRegion === "california" && activeLayers.has("svi");
    document.getElementById("visible-count").textContent =
      clinicsVisible
        ? String(currentRegion === "california" ? californiaClinicCount : facilities.length)
        : californiaSviVisible ? "58" : "0";
    document.getElementById("visible-label").textContent =
      clinicsVisible ? "provider sites" : californiaSviVisible ? "county areas" : "active areas";
    document.getElementById("legend-layer").textContent =
      currentRegion === "california" && activeLayers.has("svi")
        ? "California SVI"
        : currentRegion === "california" && activeLayers.has("clinics")
          ? "California clinics"
        : layerNames[activeDataLayer()] || "Select a layer";
    document.getElementById("svi-legend").classList.toggle("is-visible", californiaSviVisible);
    document.getElementById("clinic-legend").classList.toggle(
      "is-visible",
      currentRegion === "california" && clinicsVisible,
    );
    renderResearchCard();
  }

  function toggleLayer(layer, enabled) {
    if (enabled) activeLayers.add(layer);
    else activeLayers.delete(layer);

    if (layer === "svi" && currentRegion === "california") {
      if (enabled) californiaSviLayer.addTo(map);
      else map.removeLayer(californiaSviLayer);
    } else if (layer === "svi") {
      map.removeLayer(californiaSviLayer);
    }

    if (layer === "clinics") {
      if (enabled && currentRegion === "california") californiaClinicLayer.addTo(map);
      else if (enabled) clinicLayer.addTo(map);
      else {
        map.removeLayer(clinicLayer);
        map.removeLayer(californiaClinicLayer);
      }
      document.querySelector(".clinics-legend").classList.toggle(
        "is-visible",
        enabled && currentRegion !== "california",
      );
      document.getElementById("clinic-legend").classList.toggle(
        "is-visible",
        enabled && currentRegion === "california",
      );
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

  document.querySelectorAll(".region-button").forEach((button) => {
    button.addEventListener("click", () => {
      currentRegion = button.dataset.region;
      document.querySelectorAll(".region-button").forEach((regionButton) => {
        const enabled = regionButton.dataset.region === currentRegion;
        regionButton.setAttribute("aria-pressed", String(enabled));
        regionButton.classList.toggle("is-active", enabled);
      });

      activeLayers.clear();
      map.removeLayer(clinicLayer);
      map.removeLayer(californiaClinicLayer);
      map.removeLayer(californiaSviLayer);

      if (currentRegion === "california") {
        activeLayers.add("svi");
        californiaSviLayer.addTo(map);
        map.setView([37.25, -119.5], 6);
        document.querySelector(".intro p").textContent =
          "Explore 2022 county-level Social Vulnerability Index values across California.";
        document.querySelector('[data-layer="clinics"] .layer-copy small').textContent =
          "3,133 HRSA-listed locations";
        document.getElementById("region-name").textContent = "California";
        document.getElementById("region-detail").textContent = "United States";
      } else {
        activeLayers.add("diabetes");
        map.setView(center, 10);
        document.querySelector(".intro p").textContent =
          "Explore the available Dallas County health indicators and research-listed care locations.";
        document.querySelector('[data-layer="clinics"] .layer-copy small').textContent =
          "6 research-listed locations";
        document.getElementById("region-name").textContent = "Dallas–Fort Worth";
        document.getElementById("region-detail").textContent = "Texas, United States";
      }

      document.querySelectorAll(".layer-row").forEach((layerButton) => {
        const enabled = layerButton.dataset.layer === (currentRegion === "california" ? "svi" : "diabetes");
        layerButton.setAttribute("aria-pressed", String(enabled));
        layerButton.classList.toggle("is-active", enabled);
      });
      document.querySelector(".clinics-legend").classList.remove("is-visible");
      document.getElementById("clinic-legend").classList.remove("is-visible");
      renderMapState();
      showToast(currentRegion === "california" ? "Showing California county SVI." : "Showing Dallas–Fort Worth.");
    });
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
    activeLayers.add(currentRegion === "california" ? "svi" : "diabetes");
    document.querySelectorAll(".layer-row").forEach((button) => {
      const enabled = button.dataset.layer === (currentRegion === "california" ? "svi" : "diabetes");
      button.setAttribute("aria-pressed", String(enabled));
      button.classList.toggle("is-active", enabled);
    });
    map.removeLayer(clinicLayer);
    map.removeLayer(californiaClinicLayer);
    if (currentRegion === "california") californiaSviLayer.addTo(map);
    else map.removeLayer(californiaSviLayer);
    document.querySelector(".clinics-legend").classList.remove("is-visible");
    document.getElementById("clinic-legend").classList.remove("is-visible");
    renderMapState();
    showToast("Map layers reset.");
  });

  const searchInput = document.getElementById("map-search");
  function searchPlace() {
    const query = searchInput.value.trim().toLowerCase();
    if (currentRegion === "california") {
      const californiaPlace = {
        california: [37.25, -119.5],
        sacramento: [38.5816, -121.4944],
        "los angeles": [34.0522, -118.2437],
        "san francisco": [37.7749, -122.4194],
        "san diego": [32.7157, -117.1611],
        fresno: [36.7378, -119.7871],
        oakland: [37.8044, -122.2712],
        "san jose": [37.3382, -121.8863],
      }[query];
      if (!query || californiaPlace) {
        map.setView(californiaPlace || [37.25, -119.5], query ? 9 : 6);
        if (query) showToast(`Showing ${query.replace(/\b\w/g, (character) => character.toUpperCase())}.`);
        return;
      }
      showToast("Try Los Angeles, Sacramento, San Francisco, San Diego, Fresno, or San Jose.");
      return;
    }
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
  document.getElementById("locate-dfw").addEventListener("click", () => {
    map.setView(currentRegion === "california" ? [37.25, -119.5] : center, currentRegion === "california" ? 6 : 10);
  });
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
