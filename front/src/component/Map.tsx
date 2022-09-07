import '../App.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import "../../node_modules/leaflet/dist/leaflet.css"
import {  getArrondissements, getStreets } from '../helper/map';

interface IProps {
  onStreetClick: (streetName: string) => void;
}

interface IState {
  map?: L.Map;
}

function Map({ onStreetClick }: IProps) {

  const [map, setMap] = useState<(L.Map | null)>(null);
  const [zoom, setZoom] = useState<number>(12);
  const [streets, setStreets] = useState<L.Polyline[]>([]);
  const [arrondissementsPolygons, setArrondissementsPolygons] = useState<L.Polygon[]>([]);
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



    const arrondissements = getArrondissements();
    arrondissements.forEach(({name, polygon}) => {
      polygon.on("click", () => onStreetClick(name)).addTo(map)
    });
    const arrondissementsPolygons = arrondissements.map(({polygon}) => polygon); 
    setArrondissementsPolygons(arrondissementsPolygons);

    // let filteredStreets = (Streets as any).features.filter((s: any) => HIGHWAYS_TYPES.includes(s.properties.highway || ""))
    //   .filter((s: any) => (s.properties.noname || "") !== "yes")
    //   .filter((street: any) => isAtLeastOneCoordInPolygons(street.geometry.coordinates as [number, number][], arrondissementsPolygons));
    // const streets: L.Polyline[] = [];

    // for (let street of filteredStreets) {
    //   const color = Math.random() > 0.8 ? "red" : "blue";
    //   var polyline = L.polyline((street.geometry.coordinates as [number, number][]).map(a => [a[1], a[0]]), { color });
    //   polyline.on("click", () => onStreetClick(street.properties.name || ""))
    //   streets.push(polyline);
    // }
    const streets: L.Polyline[] = [];
    getStreets().forEach(street => {
      const color = Math.random() > 0.8 ? "red" : "blue";
      street.polylines.forEach(polyline => {
        polyline.on("click", () => onStreetClick(street.name || "")).setStyle({color});
        streets.push(polyline);
      });
    });
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
      arrondissementsPolygons.forEach((e) => e.addTo(map as L.Map));
    }
    else {
      arrondissementsPolygons.forEach((e) => e.remove());
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
