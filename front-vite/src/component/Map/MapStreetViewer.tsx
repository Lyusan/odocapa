import React, { useEffect, useState } from 'react';
import maplibregl, { Map, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import StreetButton from '../StreetButton';

interface MapStreetViewerProp {
  coords: any;
}

export default function MapStreetViewer({ coords }: MapStreetViewerProp) {
  const [map, setMap] = useState<Map | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [layers, setLayers] = useState<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [lng] = useState(2.3414597583844996);
  const [lat] = useState(48.863833404882456);
  const [zoom] = useState(10);

  useEffect(() => {
    if (!mapContainer) return;
    const newMap = new maplibregl.Map({
      container: mapContainer as any,
      style:
        'https://api.maptiler.com/maps/edb1ce65-8001-42f2-91f8-c6ed05e05658/style.json?key=XlWtABb3aLD9Vbldwh22',
      center: [lng, lat],
      zoom,
    });
    setMap(newMap);
    newMap.on('load', () => setMapLoaded(true));
  }, [mapContainer]);

  useEffect(() => {
    if (!map || !mapLoaded) return;
    try {
      layers.forEach((l) => map.removeLayer(l));
      sources.forEach((s) => map.removeSource(s));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    const newLayers: string[] = [];
    const newSources: string[] = [];
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: coords,
        },
      ],
    };
    map.addSource(`LineString`, {
      type: 'geojson',
      data: geojson,
    });
    map.addLayer({
      id: `LineString`,
      type: 'line',
      source: `LineString`,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#DC2626',
        'line-width': 4,
      },
    });
    newLayers.push(`LineString`);
    newSources.push(`LineString`);
    // const coordinates = fixedCoords.reduce((acc, curr) => [...acc, ...curr], []);
    // const bounds = coordinates.reduce(
    //   (acc, coord) => acc.extend(coord),
    //   new LngLatBounds(coordinates[0], coordinates[0]),
    // );

    // map.fitBounds(bounds, {
    //   padding: 100,
    // });
    setLayers(newLayers);
    setSources(newSources);
  }, [coords, mapLoaded]);

  return (
    <div
      ref={(el) => {
        setMapContainer(el);
      }}
      className="w-full h-full"
    />
  );
}
