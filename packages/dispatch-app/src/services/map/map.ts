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

  setCurrentEventPin({ lat, lon }: { lat: number; lon: number }) {
    const map = this.getMap();
    if (this.markers.currentEvent) {
      this.markers.currentEvent.remove();
    }
    const marker = new mapboxgl.Marker({ color: 'red', draggable: true })
      .setLngLat([lon, lat])
      .addTo(map);
    map.setCenter({ lat, lon });
    map.setZoom(15);
    this.markers.currentEvent = marker;
    return marker;
  }

  updateUserPins(
    users: Array<{
      id: number;
      location: { latitude: number; longitude: number };
    }>
  ) {
    console.log('updating user pins', users);
    const unseenUsers = { ...this.markers.users };
    console.log('unseen users', unseenUsers);
    users.forEach((user) => {
      console.log('handle setting pin for user with id', user.id);
      if (this.markers.users[user.id]) {
        console.log('already has pin for user with id', user.id);

        this.markers.users[user.id].setLngLat({
          lat: user.location.latitude,
          lon: user.location.longitude,
        });
      } else {
        console.log('do not have pin for user with id', user.id);

        this.markers.users[user.id] = new mapboxgl.Marker({
          color: 'blue',
        })
          .setLngLat([user.location.longitude, user.location.latitude])
          .addTo(this.getMap());
      }
      delete unseenUsers[user.id];
    });

    console.log('pin set for all new locations, unseen remaining', unseenUsers);
    // Clean up users object and dangling pins
    Object.keys(unseenUsers).forEach((id) => {
      this.markers.users[(id as unknown) as number].remove();
      delete this.markers.users[id];
    });
  }

  removeUserPins() {
    Object.keys(this.markers.users).forEach((id) => {
      this.markers.users[id].remove();
      delete this.markers.users[id];
    });
  }

  hasCurrentEventPin() {
    return !!this.markers.currentEvent;
  }
}

const map = new MyMap();

export { map };
