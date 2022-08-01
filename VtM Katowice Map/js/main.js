let map = L.map('map').setView([50.270908, 19.039993], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 25,
    attribution: '© OpenStreetMap'
}).addTo(map);

async function dataFetch (url) {
  const res = await fetch(url);
  const data = await res.json();
  console.dir(data);
  return data;
}

let geoKatowice = dataFetch('js/map-data.geojson').then(data => {
  let geojsonData = L.geoJSON(data, {
    style: style,
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.title) {
        layer.bindPopup(feature.properties.title);
      } 
      if (layer.feature.geometry.type === 'Polygon') {
        layer.on({
          mouseover: e => {
            layer.setStyle({
              weight: 2,
              color: '#fff'
            })
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          },
          mouseout: e => {
            geojsonData.resetStyle(e.target)
          }
        });
      }
    }
  }).addTo(map)
});

function style(feature) {
  return {
      fillColor: feature.properties.fill,
      color: feature.properties.fill
  };
}