import L from 'leaflet';
import Arrondissements from '../component/data/arrondissements.json';
import Streets from '../component/data/streets.json';
import FullStreets from '../component/data/fullStreets.json';

export const HIGHWAYS_TYPES = [
    "motorway",
    "trunk",
    "primary",
    "secondary",
    "tertiary",
    "residential",
    "unclassified"
];


// Ray Casting algorithm from Ray Casting
// https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
export function isCoordInPolygon(coord: [number, number], poly: L.Polygon) {
    var polyPoints = poly.getLatLngs()[0] as L.LatLng[];
    var x = coord[1], y = coord[0];
    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

export function isAtLeastOneCoordInPolygons(coords: [number, number][], polys: L.Polygon[]) {
    for (let coord of coords)
        for (let poly of polys)
            if (isCoordInPolygon(coord, poly)) return true;
    return false;
};

export function getArrondissements(): { name: string, polygon: L.Polygon }[] {
    const arrondissements = [];
    for (let arrondissement of Arrondissements.features.filter(a => a.properties.type === "boundary")) {
        var polygon = L.polygon((arrondissement as any).geometry.coordinates[0].map((l: any) => [l[1], l[0]]));
        arrondissements.push({ name: arrondissement.properties.name || "", polygon });
    }
    return arrondissements;
}

export interface TtTt { name: string, polylines: L.Polyline[] };
export interface ToTo { name: string, polylines: [number, number][][] }

export function getStreets(): TtTt[] {
    return (Streets as ToTo[]).map((street) => {
        return {
            name: street.name,
            polylines: street.polylines.map(polyline => L.polyline(polyline, { color: "green" }))
        }
    });
}

export function cleanUpStreets() {
    console.log("toto")
    let filteredStreets = (FullStreets as any).features.filter((s: any) => HIGHWAYS_TYPES.includes(s.properties.highway || ""))
            .filter((s: any) => (s.properties.noname || "") !== "yes")
            .filter((street: any) => isAtLeastOneCoordInPolygons(street.geometry.coordinates as [number, number][], getArrondissements().map(a => a.polygon)));
    const resMap: Record<string, ToTo> = {};
    filteredStreets.forEach((street: any) => {
        const streetName = street.properties.name
        if (!resMap[streetName])
            resMap[streetName] = { name: streetName, polylines: [] }
        if (street.geometry.type === "Polygon")
            resMap[streetName].polylines.push((street.geometry.coordinates[0] as [number, number][]).map(a => [a[1], a[0]]));
        if (street.geometry.type === "LineString")
            resMap[streetName].polylines.push((street.geometry.coordinates as [number, number][]).map(a => [a[1], a[0]]));
    });
    console.log(Object.values(resMap));
}
