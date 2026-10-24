# DFW Health Atlas

A responsive, interactive map prototype for exploring diabetes burden, social vulnerability, clinic locations, shortage areas, and specialty access across Dallas–Fort Worth.

## Run locally

Open `index.html` in a browser, or serve the repository root with any static web server, for example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Prototype notes

- Map tiles are provided by OpenStreetMap and require an internet connection.
- Layer geometry and clinic pins are illustrative demo placeholders. They are not measured data or actual clinic locations.
- Diabetes burden, SVI, shortage-area, and specialty-access overlays can be replaced with the researched geography and measures when available. The current sample metrics are only used to demonstrate layer interaction.
- The layer controls are independently switchable. Quick filters combine using AND logic; reset restores the initial diabetes layer and clears filters.
