let map = L.map('map').setView([50.270908, 19.039993], 12);

function style(feature) {
  return {
      fillColor: feature.properties.fill,
      color: feature.properties.fill
  };
}

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 25,
    attribution: '© OpenStreetMap'
}).addTo(map);


let geoJsonData = fetch('js/map-data.geojson')
  .then(res => res.json())
  .then(data => L.geoJSON(data, {
    style: style,
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.title) {
        layer.bindPopup(feature.properties.title);
      }
    }
  }).addTo(map));
