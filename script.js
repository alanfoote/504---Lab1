mapboxgl.accessToken = 'pk.eyJ1IjoiYWZvb3RlIiwiYSI6ImNrNzJwbDNnMzA0dDEzbW9ua3V0dHVxajAifQ.FlxlFZJiRJyfh5eEwStItQ'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: [-103.30011, 29.27185],
zoom: 13, // starting zoom
pitch: 75,
bearing: 135,});
map.on('load', () => {
        map.addSource('trails', {
        type: 'geojson',
        data: 'BigBendTrails.geojson' // note, you'll have to change this if your data file is saved under a different name or not in an enclosing folder named 'data'
    });

    map.addLayer({
      'id': 'trails-layer',
      'type': 'line',
      'source': 'trails',
      'paint': {
          'line-width': 1,
          'line-color': ['match', ['get', 'TRLCLASS'],
              'Class 1: Minimally Developed', 'red',
              'Class 2: Moderately Developed', 'orange',
              'Class 3: Developed', 'yellow',
              /*else,*/ 'blue'
          ]
      }
    });
    map.addSource('bounds', {
        type: 'geojson',
        data: 'BigBendBounds.geojson'
});

    map.addLayer({
      'id': 'boundary-layer',
      'type': 'line',
      'source': 'bounds',
      'paint': {
          'line-width': 4,
          'line-color': 'black',
          'line-opacity': .6
      }
    });
});

    map.on('click', 'trails-layer', (e) => {
    const coordinates = e.lngLat;
     let feature = e.features[0].properties;
     const description = "<b>Trail name: </b>" + feature.TRLNAME + "<br><b>Trailclass:</b> " + feature.TRLCLASS + "<br><b>Trail length: </b>" + feature.Miles.toFixed(2) + " miles";

     new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

    map.on('mouseenter', 'trails-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
});

    map.on('mouseenter', 'trails-layer', () => {
      map.getCanvas().style.cursor = '';
});
    map.on('load', function () {
    map.addSource('mapbox-dem', {
      "type": "raster-dem",
      "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
      "tileSize": 512,
      "maxzoom": 14
});

map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.2});
map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 50
        }
    });
  });

const navControl = new mapboxgl.NavigationControl({
    visualizePitch: true,
    showCompass: true
});
map.addControl(navControl, 'top-right');



const scale = new mapboxgl.ScaleControl({
maxWidth: 100,
unit: 'imperial'
});
map.addControl(scale);

scale.setUnit('meters');

map.addControl(new mapboxgl.FullscreenControl());

document.getElementById('fly').addEventListener('click', () => {
// Fly to a random location by offsetting the point -74.50, 40
// by up to 5 degrees.
map.flyTo({
center: [-103.30011, 29.27185],
zoom: 13, // starting zoom
pitch: 75,
bearing: 135,
essential: true // this animation is considered essential with respect to prefers-reduced-motion
});
});
