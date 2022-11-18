import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import maplibregl, { LngLatBounds, Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SuperStreet } from '../../type/Street';
import { Categorie } from '../../type/Categorie';

const MapOdocapa = forwardRef(
  (
    {
      streets,
      categorie,
      onStreetSelect,
    }: {
      streets: SuperStreet[];
      categorie: Categorie;
      onStreetSelect: (streetId: string) => void;
    },
    ref,
  ) => {
    const [map, setMap] = useState<Map | null>(null);
    const [sources, setSources] = useState<Record<string, any>>([]);
    const [layers, setLayers] = useState<Record<string, any>>([]);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
    const [lng] = useState(2.3414597583844996);
    const [lat] = useState(48.863833404882456);
    const [zoom] = useState(12.2);
    useImperativeHandle(ref, () => ({
      zoomOnStreet(street: SuperStreet) {
        if (!map || !mapLoaded) return;
        const coords: [number, number][][] = JSON.parse(street.coords);
        const fixedCoords: [number, number][][] = coords.map((coord) =>
          coord.map((e) => [e[1], e[0]]),
        );
        const coordinates = fixedCoords.reduce((acc, curr) => [...acc, ...curr], []);
        const bounds = coordinates.reduce(
          (acc, coord) => acc.extend(coord),
          new LngLatBounds(coordinates[0], coordinates[0]),
        );

        map.fitBounds(bounds, {
          padding: 100,
          offset: [-100, 0],
        });
      },
    }));

    useEffect(() => {
      if (!mapContainer) return;
      const newMap = new maplibregl.Map({
        container: mapContainer as any,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'],
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
            },
          ],
        },
        center: [lng, lat],
        zoom,
        maxBounds: [
          [lng - 0.3, lat - 0.3],
          [lng + 0.3, lat + 0.3],
        ],
      });
      setMap(newMap);
      newMap.on('load', () => setMapLoaded(true));
    }, [mapContainer]);

    useEffect(() => {
      if (!map || !mapLoaded) return;
      try {
        Object.values(layers).forEach((l) => map.removeLayer(l.id));
        Object.values(sources).forEach((s) => map.removeSource(s.name));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }

      const newLayers: Record<string, any> = {};
      const newSources: Record<string, any> = {};
      streets.forEach((street) => {
        const currentCat = categorie.categorize(street);
        if (!currentCat) return;
        if (!newSources[currentCat.name]) {
          newSources[currentCat.name] = {
            name: `source-${currentCat.name}`,
            source: {
              type: 'FeatureCollection',
              features: [] as any,
            },
          };
        }
        if (!newLayers[currentCat.name]) {
          newLayers[currentCat.name] = {
            id: `layer-${currentCat.name}`,
            type: 'line',
            source: `source-${currentCat.name}`,

            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': currentCat.color,
              'line-width': 5,
            },
          };
        }
        const fixedCoords: [number, number][][] = JSON.parse(street.coords).map(
          (coord: [number, number][][]) => coord.map((e) => [e[1], e[0]]),
        );

        fixedCoords.forEach((coord) => {
          newSources[currentCat.name].source.features.push({
            type: 'Feature',
            id: street.id,
            properties: { ID: street.id },
            geometry: {
              type: 'LineString',
              coordinates: coord,
            },
          });
        });
      });
      Object.values(newSources).forEach((s) => {
        map.addSource(s.name, {
          type: 'geojson',
          data: s.source,
        });
      });
      Object.values(newLayers).forEach((l) => {
        map.addLayer(l);
        map.on('click', l.id, (e) => {
          onStreetSelect(e.features?.[0].properties?.ID);
        });
        map.on('mouseenter', l.id, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', l.id, () => {
          map.getCanvas().style.cursor = '';
        });
      });
      setLayers(newLayers);
      setSources(newSources);
    }, [streets, categorie, mapLoaded]);

    return (
      <div
        ref={(el) => {
          setMapContainer(el);
        }}
        className="w-full h-screen"
      />
    );
  },
);

export default MapOdocapa;
