# Regional Health Atlas

A responsive, interactive map prototype for exploring Dallas–Fort Worth health indicators and California county social vulnerability.

## Run locally

Open `index.html` in a browser, or serve the repository root with any static web server, for example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Data notes

- Map tiles are provided by OpenStreetMap and require an internet connection.
- The research summary includes Dallas County-level diabetes prevalence (12.1%), SVI percentiles, and transportation information, plus six listed healthcare facilities. It does not provide tract-level measure tables or shortage-area boundary files.
- County-level metrics are shown as summaries, not as tract-level shaded areas. Quick filters remain unavailable until tract-level records are added.
- Facility markers use approximate address points returned by the U.S. Census Geocoder. The research brief does not confirm AI-based diabetic eye screening at any facility.
- Primary-care shortage boundaries, tract-level diabetes and SVI data, and calculated specialty-care travel distances require the corresponding source datasets before those spatial layers can be mapped.
- Reset restores the diabetes summary and hides the clinic markers.
- California mode provides population-weighted county SVI overall means from the CDC/ATSDR SVI 2022 dataset. County boundaries are bundled locally and require no external geospatial API.
- California mode also maps SVI by census tract: 9,041 tracts have a score and 68 population-zero tracts are shown as unavailable. Tract boundaries are simplified for web display and bundled locally.
- California mode includes 3,133 HRSA health center locations from the supplied workbook. Most screening fields remain unknown; markers and popups are clearly labeled as unverified source data rather than confirmed care claims.
