import * as React from 'react';

const { useState } = React;

import { MAP_Z_INDEX, CONTROLS_Z_INDEX } from './constants';

import { Overlay } from './components';

import { CreateEvent } from './features/create-event';

import { map } from './features/map';

const { useRef, useEffect } = React;

mapboxgl.accessToken = process.env.MAPBOX_GL_KEY;

export const App: React.FunctionComponent = () => {
  const mapBoxContainerRef = useRef<HTMLDivElement | undefined>();

  const [mapMounted, setMapMounted] = useState(false);

  useEffect(() => {
    map.setMap(
      new mapboxgl.Map({
        container: mapBoxContainerRef.current!,
        center: [34, 5],
        zoom: 10,
        style: 'mapbox://styles/mapbox/streets-v11',
      })
    );
    setMapMounted(true);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Overlay level={MAP_Z_INDEX} ref={mapBoxContainerRef} />
      <Overlay level={CONTROLS_Z_INDEX} style={{ pointerEvents: 'none' }}>
        {mapMounted && <CreateEvent />}
      </Overlay>
    </div>
  );
};
