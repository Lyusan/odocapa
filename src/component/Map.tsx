import '../App.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import Arrondissements from './arrondissements.json';
import Streets from './streets.json';
import "../../node_modules/leaflet/dist/leaflet.css"

const highwaysTypes = ["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "unclassified"];
interface IProps {
  onStreetClick: (streetName: string) => void;
}

interface IState {
  map?: L.Map;
}
// Ray Casting algorithm from Ray Casting
// https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
function isCoordInPolygon(coord: [number, number], poly: L.Polygon) {
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

function isAtLeastOneCoordInPolygons(coords: [number, number][], polys: L.Polygon[]) {
  for (let coord of coords)
      for (let poly of polys)
        if (isCoordInPolygon(coord, poly)) return true;
  return false;
};

function Map({ onStreetClick }: IProps) {

  const [map, setMap] = useState<(L.Map | null)>(null);
  const [zoom, setZoom] = useState<number>(12);
  const [streets, setStreets] = useState<L.Polyline[]>([]);
  const [arrondissements, setArrondissements] = useState<L.Polygon[]>([]);
  const [mode, setMode] = useState<"polyline" | "polygon">("polygon");

  useEffect(() => {
    var container: any = L.DomUtil.get("map");

    if (container?._leaflet_id === null) return;
    if (container != null) {
      container._leaflet_id = null;
    }

    var map = L.map("map", {
      zoomDelta: 0.5,
      zoomSnap: 0
    }).setView([48.863833404882456, 2.3414597583844996], zoom);
    setMap(map);

    const bounds = new L.LatLngBounds(
      new L.LatLng(48.863833404882456, 2.3414597583844996),
      new L.LatLng(48.87, 2.35)
    );
    var Stamen_Toner = L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 18,
        minZoom: 12,
        maxBounds: bounds,
        maxBoundsViscosity: 0,
        ext: "png"
      } as any
    );
    map.addLayer(Stamen_Toner);


    const arrondissements: L.Polygon[] = [];
    for (let arrondissement of Arrondissements.features.filter(a => a.properties.type === "boundary")) {
      var polygon = L.polygon((arrondissement as any).geometry.coordinates[0].map((l: any) => [l[1], l[0]])).addTo(map);
      polygon.on("click", () => onStreetClick(arrondissement.properties.name || ""))
      arrondissements.push(polygon);
    }
    setArrondissements(arrondissements);


    let filteredStreets = (Streets as any).features.filter((s: any) => highwaysTypes.includes(s.properties.highway || ""))
      .filter((s: any) => (s.properties.noname || "") !== "yes")
      // .filter((s: any, n: number) => n < 100)
      .filter((street: any) => isAtLeastOneCoordInPolygons(street.geometry.coordinates as [number, number][], arrondissements));
    const streets: L.Polyline[] = [];

    for (let street of filteredStreets) {
      const color = Math.random() > 0.8 ? "red" : "blue";
      var polyline = L.polyline((street.geometry.coordinates as [number, number][]).map(a => [a[1], a[0]]), { color });
      polyline.on("click", () => onStreetClick(street.properties.name || ""))
      streets.push(polyline);
    }
    setStreets(streets);

    map.on("zoom", (e) => {
      setZoom(map.getZoom());
    })


  }, []);

  useEffect(() => {
    const newMode = zoom < 14 ? "polygon" : "polyline";
    if (mode === newMode) return;
    setMode(newMode);
    if (newMode === "polygon") {
      streets.forEach((e) => e.remove());
      arrondissements.forEach((e) => e.addTo(map as L.Map));
    }
    else {
      arrondissements.forEach((e) => e.remove());
      streets.forEach((e) => e.addTo(map as L.Map));
    }
  });

  return (
    <>
      <div id="map" className='Map'></div>
    </>
  );

}

export default Map;
