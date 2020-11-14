class MyMap {
  map: mapboxgl.Map;

  markers: {
    currentEvent?: mapboxgl.Marker;
    users: { [id: number]: mapboxgl.Marker };
  } = {
    users: {},
  };

  setMap(map: mapboxgl.Map) {
    this.map = map;
  }

  getMap() {
    if (!this.map) throw new Error('map not set!');
    return this.map;
  }

  addCurrentEventPin({ lat, lon }: { lat: number; lon: number }) {
    return this.addPin({ lat, lon, type: 'event' });
  }

  hasCurrentEventPin() {
    return !!this.markers.currentEvent;
  }

  private addPin({
    lat,
    lon,
    type,
  }: {
    lat: number;
    lon: number;
    type: 'event' | 'user';
  }) {
    const map = this.getMap();
    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lon, lat])
      .addTo(map);
    map.setCenter({ lat, lon });
    map.setZoom(15);
    if (type === 'event') {
      this.markers.currentEvent = marker;
    }
    return marker;
  }
}

const map = new MyMap();

export { map };
