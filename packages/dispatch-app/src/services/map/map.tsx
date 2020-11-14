class MyMap {
  map: mapboxgl.Map;

  setMap(map: mapboxgl.Map) {
    this.map = map;
  }

  getMap() {
    if (!this.map) throw new Error('map not set!');
    return this.map;
  }

  addPin({ lat, lon }: { lat: number; lon: number }) {
    const map = this.getMap();
    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lon, lat])
      .addTo(map);
    console.log(lat, lon);
    map.setCenter({ lat, lon });
    map.setZoom(15);
    return marker;
  }
}

const map = new MyMap();

export { map };
