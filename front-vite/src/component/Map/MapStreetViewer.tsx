import React, { useEffect, useState } from 'react';
import maplibregl, { Map, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapStreetViewerProp {
  coords: [number, number][][];
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
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
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

    const fixedCoords: [number, number][][] = coords.map((coord) => coord.map((e) => [e[1], e[0]]));
    const newLayers: string[] = [];
    const newSources: string[] = [];
    fixedCoords.forEach((coord, index) => {
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              properties: {},
              coordinates: coord,
            },
          },
        ],
      };
      map.addSource(`LineString-${index}`, {
        type: 'geojson',
        data: geojson,
      });
      map.addLayer({
        id: `LineString-${index}`,
        type: 'line',
        source: `LineString-${index}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#DC2626',
          'line-width': 4,
        },
      });
      newLayers.push(`LineString-${index}`);
      newSources.push(`LineString-${index}`);
    });
    const coordinates = fixedCoords.reduce((acc, curr) => [...acc, ...curr], []);
    const bounds = coordinates.reduce(
      (acc, coord) => acc.extend(coord),
      new LngLatBounds(coordinates[0], coordinates[0]),
    );

    map.fitBounds(bounds, {
      padding: 100,
    });
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
