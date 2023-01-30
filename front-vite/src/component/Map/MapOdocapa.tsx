import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import maplibregl, { LngLatBounds, Map, NavigationControl } from 'maplibre-gl';
import { isArray } from 'lodash';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Categorie, CategorieValue } from '../../type/Categorie';
import { Street } from '../../type/Street';

function usePrevious<Type>(value: Type) {
  const ref = useRef<Type>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const MapOdocapa = forwardRef(
  (
    {
      streets,
      selectedStreet,
      categorie,
      categoryValues,
      onStreetSelect,
      onStreetHover,
    }: {
      streets: Street[];
      selectedStreet: Street | null;
      categorie: Categorie;
      categoryValues: CategorieValue[];
      onStreetSelect: (streetId: string | null) => void;
      onStreetHover: (streetId: string | null) => void;
    },
    ref,
  ) => {
    const [map, setMap] = useState<Map | null>(null);
    const [sources, setSources] = useState<Record<string, any>>([]);
    const [layers, setLayers] = useState<Record<string, any>>([]);
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [isHover, setIsHover] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
    const [lng] = useState(2.3414597583844996);
    const [lat] = useState(48.863833404882456);
    const [zoom, setZoom] = useState(12.2);
    const [lineWidth, setLineWidth] = useState(3);
    useImperativeHandle(ref, () => ({
      zoomOnStreet(street: Street) {
        if (!map || !mapLoaded) return;
        const { coords } = street;
        const coordinates = isArray(coords.coordinates[0][0])
          ? coords.coordinates.reduce((acc: any, curr: any) => [...acc, ...curr], [])
          : coords.coordinates;
        const bounds = coordinates.reduce(
          (acc: any, coord: any) => acc.extend(coord),
          new LngLatBounds(coordinates[0], coordinates[0]),
        );
        map.fitBounds(bounds, {
          padding: 500,
          offset: [-250, 0],
        });
      },
    }));

    useEffect(() => {
      onStreetHover(hoverId);
    }, [hoverId]);

    useEffect(() => {
      let width;
      if (zoom > 16) width = 6;
      else if (zoom > 14) width = 4;
      else if (zoom > 12) width = 2;
      else width = 1;
      setLineWidth(width);
    }, [zoom]);

    useEffect(() => {
      if (!mapContainer) return;
      const newMap = new maplibregl.Map({
        container: mapContainer as any,
        style:
          'https://api.maptiler.com/maps/20706454-fc6c-49c0-9fc0-fcf0b6edc591/style.json?key=XlWtABb3aLD9Vbldwh22',
        center: [lng, lat],
        zoom,
        maxBounds: [
          [lng - 0.3, lat - 0.3],
          [lng + 0.3, lat + 0.3],
        ],
      });
      setMap(newMap);
      newMap.on('load', () => setMapLoaded(true));
      newMap.on('zoom', () => setZoom(newMap.getZoom()));
      newMap.on('click', 'layer-all', (e) => {
        onStreetSelect(e.features?.[0].properties?.ID);
      });
      newMap.on('mousemove', 'layer-all', (e) => {
        const currentId = e.features?.[0].properties?.ID;
        if (currentId && currentId !== hoverId) {
          setHoverId(currentId);
        }
      });
      newMap.on('mouseleave', 'layer-all', () => {
        setHoverId(null);
      });
      newMap.addControl(new NavigationControl({ visualizePitch: true }), 'top-left');
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
      newSources.all = {
        name: 'source-all',
        source: {
          type: 'FeatureCollection',
          features: [] as any,
        },
      };
      newLayers.all = {
        id: 'layer-all',
        type: 'line',
        source: 'source-all',
        options: {
          clickTolerance: 10,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#000000',
          'line-width': lineWidth * 6,
          'line-opacity': 0,
        },
      };

      if (categoryValues.length > 1) {
        streets.forEach((street) => {
          newSources.all.source.features.push({
            type: 'Feature',
            id: street.id,
            properties: { ID: street.id },
            geometry: street.coords,
          });
          const currentCat = categorie.categorize(street)?.primary;
          if (!categoryValues.find((e) => e.name === currentCat?.name)) return;
          if (currentCat) {
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
                options: {
                  clickTolerance: 10,
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': currentCat.color,
                  'line-width': lineWidth,
                },
                'line-width-transition': {
                  duration: 30000,
                  delay: 0,
                },
              };
            }

            newSources[currentCat.name].source.features.push({
              type: 'Feature',
              id: street.id,
              properties: { ID: street.id },
              geometry: street.coords,
            });
          }
        });
      } else if (categoryValues.length === 1) {
        streets.forEach((street) => {
          newSources.all.source.features.push({
            type: 'Feature',
            id: street.id,
            properties: { ID: street.id },
            geometry: street.coords,
          });
          const categorizationResult = categorie.categorize(street);
          let type: string | null;
          let opacity = 1;
          const categoryValue = categoryValues[0];
          if (!categorizationResult) type = null;
          else if (categorizationResult.primary?.name === categoryValue.name) {
            type = 'primary';
          } else if (categorizationResult.secondary.find((cv) => cv.name === categoryValue.name)) {
            opacity = 0.5;
            type = 'secondary';
          } else if (categorizationResult.tertiary.find((cv) => cv.name === categoryValue.name)) {
            opacity = 0.15;
            type = 'tertiary';
          } else type = null;
          if (!type) return;
          if (!newSources[type]) {
            newSources[type] = {
              name: `source-${type}`,
              source: {
                type: 'FeatureCollection',
                features: [] as any,
              },
            };
          }
          if (!newLayers[type]) {
            newLayers[type] = {
              id: `layer-${type}`,
              type: 'line',
              source: `source-${type}`,

              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': categoryValue.color,
                'line-width': lineWidth,
                'line-opacity': opacity,
              },
            };
          }
          newSources[type].source.features.push({
            type: 'Feature',
            id: street.id,
            properties: { ID: street.id },
            geometry: street.coords,
          });
        });
      }
      Object.values(newSources).forEach((s) => {
        map.addSource(s.name, {
          type: 'geojson',
          data: s.source,
        });
      });
      Object.entries(newLayers).forEach(([, l]) => {
        map.addLayer(l);
      });

      setLayers(newLayers);
      setSources(newSources);
    }, [streets, categorie, categoryValues, lineWidth, mapLoaded]);

    useEffect(() => {
      // console.log(mouseHoverInfo);
      let newIsHover = false;
      if (!map) return;
      if (hoverId) map.getCanvas().style.cursor = 'pointer';
      else map.getCanvas().style.cursor = '';
      if (isHover) {
        map.removeLayer('layer-plain-hover');
        map.removeLayer('layer-border-hover');
        map.removeSource('source-hover');
      }
      const street = streets.find((s) => s.id === hoverId);
      if (street) {
        const categoryValue = categorie.categorize(street);
        const source = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                id: street.id,
                properties: { ID: street.id },
                geometry: street.coords,
              },
            ],
          },
        };
        const layerPlain = {
          id: 'layer-border-hover',
          type: 'line',
          source: 'source-hover',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': categoryValue?.primary?.color || '#FFFFFF',
            'line-width': lineWidth * 1.5,
            'line-opacity': 1,
          },
        };
        const layerBorder = {
          id: 'layer-plain-hover',
          type: 'line',
          source: 'source-hover',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#777777',
            'line-gap-width': lineWidth * 1.5,
            'line-width': lineWidth * 1,
            'line-opacity': 1,
          },
        };
        map.addSource('source-hover', source as any);
        map.addLayer(layerBorder as any);
        map.addLayer(layerPlain as any);
        newIsHover = true;
      }
      if (isHover !== newIsHover) setIsHover(newIsHover);
    }, [hoverId]);

    useEffect(() => {
      let newIsSelected = false;
      if (!map) return;
      if (isSelected) {
        map.removeLayer('layer-plain-selected');
        map.removeLayer('layer-border-selected');
        map.removeSource('source-selected');
      }
      if (selectedStreet) {
        const categoryValue = categorie.categorize(selectedStreet);
        const source = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                id: selectedStreet.id,
                properties: { ID: selectedStreet.id },
                geometry: selectedStreet.coords,
              },
            ],
          },
        };
        const layerPlain = {
          id: 'layer-border-selected',
          type: 'line',
          source: 'source-selected',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': categoryValue?.primary?.color || '#FFFFFF',
            'line-width': lineWidth * 1.5,
            'line-opacity': 1,
          },
        };
        const layerBorder = {
          id: 'layer-plain-selected',
          type: 'line',
          source: 'source-selected',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#111111',
            'line-gap-width': lineWidth * 1.5,
            'line-width': lineWidth * 1,
            'line-opacity': 1,
          },
        };
        map.addSource('source-selected', source as any);
        map.addLayer(layerBorder as any);
        map.addLayer(layerPlain as any);
        newIsSelected = true;
      }
      if (isSelected !== newIsSelected) setIsSelected(newIsSelected);
    }, [selectedStreet, categorie, categoryValues, zoom]);
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
