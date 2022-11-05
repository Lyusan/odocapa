import L from 'leaflet';
import Arrondissements from '../data/arrondissements.json';
import Streets from '../data/streets.json';
import FullStreets from '../data/fullStreets.json';

export const HIGHWAYS_TYPES = [
  'motorway',
  'trunk',
  'primary',
  'secondary',
  'tertiary',
  'residential',
  'unclassified',
];

// Ray Casting algorithm from Ray Casting
// https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
export function isCoordInPolygon(coord: [number, number], poly: L.Polygon) {
  const polyPoints = poly.getLatLngs()[0] as L.LatLng[];
  const x = coord[1];
  const y = coord[0];
  let inside = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    const xi = polyPoints[i].lat;
    const yi = polyPoints[i].lng;
    const xj = polyPoints[j].lat;
    const yj = polyPoints[j].lng;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export function isAtLeastOneCoordInPolygons(coords: [number, number][], polys: L.Polygon[]) {
  let res = false;
  coords.forEach((coord) => {
    polys.forEach((poly) => {
      if (isCoordInPolygon(coord, poly)) res = true;
    });
  });
  return res;
}

export function getArrondissements(): { name: string; polygon: L.Polygon }[] {
  const arrondissements: any = [];
  Arrondissements.features
    .filter((a) => a.properties.type === 'boundary')
    .forEach((arrondissement) => {
      const polygon = L.polygon(
        (arrondissement as any).geometry.coordinates[0].map((l: any) => [l[1], l[0]]),
      );
      arrondissements.push({ name: arrondissement.properties.name || '', polygon });
    });
  return arrondissements;
}

export interface TtTt {
  name: string;
  coords: [number, number][][];
  polylines: L.Polyline[];
}
export interface ToTo {
  name: string;
  polylines: [number, number][][];
}

export function getStreets(): TtTt[] {
  return (Streets as ToTo[]).map((street) => ({
    name: street.name,
    coords: street.polylines,
    polylines: street.polylines.map((polyline) => L.polyline(polyline, { color: 'green' })),
  }));
}

export function cleanUpStreets() {
  const filteredStreets = (FullStreets as any).features
    .filter((s: any) => HIGHWAYS_TYPES.includes(s.properties.highway || ''))
    .filter((s: any) => (s.properties.noname || '') !== 'yes')
    .filter((street: any) =>
      isAtLeastOneCoordInPolygons(
        street.geometry.coordinates as [number, number][],
        getArrondissements().map((a) => a.polygon),
      ));
  const resMap: Record<string, ToTo> = {};
  filteredStreets.forEach((street: any) => {
    const streetName = street.properties.name;
    if (!resMap[streetName]) resMap[streetName] = { name: streetName, polylines: [] };
    if (street.geometry.type === 'Polygon') {
      resMap[streetName].polylines.push(
        (street.geometry.coordinates[0] as [number, number][]).map((a) => [a[1], a[0]]),
      );
    }
    if (street.geometry.type === 'LineString') {
      resMap[streetName].polylines.push(
        (street.geometry.coordinates as [number, number][]).map((a) => [a[1], a[0]]),
      );
    }
  });
}
