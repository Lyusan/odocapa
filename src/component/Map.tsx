import '../App.css';
import L, { LatLngTuple } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import OverPassData from './DataFull.json';
import Arrondissements from './arrondissements.json';
import "../../node_modules/leaflet/dist/leaflet.css"


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
  const [arrondissements, setArrondissements] = useState<L.Polygon[]>([]);
  const [mode, setMode] = useState<"polyline" | "polygon">("polygon"); 

  useEffect(() => {
    var container: any = L.DomUtil.get("map");

    if (container?._leaflet_id === null) return;
    if (container != null) {
      container._leaflet_id = null;
    }

    const data: any = OverPassData;
    const nodes: Record<number, LatLngTuple> = {};
    const ways: Record<string, { name: string, parts: LatLngTuple[] }> = {};
    for (let el of data.elements) {
      if (el.type === "node") nodes[el.id] = [el.lat as number, el.lon as number];
      else if (ways[el.tags?.name as string]) ways[el.tags?.name as string].parts.push(el.nodes as LatLngTuple);
      else ways[el.tags?.name as string] = { name: el.tags?.name as string, parts: [el.nodes as LatLngTuple] };
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

    const streets: L.Polyline[] = [];
    for (let way of Object.values(ways)) {
      console.log(way.name);
      const color = Math.random() > 0.8 ? "red" : "blue";
      for (let part of way.parts) {
        var latlngs = part.map((id) => nodes[id]);
        var polyline = L.polyline(latlngs, { color });
        polyline.on("click", () => onStreetClick(way.name))
        streets.push(polyline);
      }
    }
    setStreets(streets);
    const arrondissements: L.Polygon[] = [];
    for (let arrondissement of Arrondissements.features.filter(a => a.properties.type === "boundary")) {
      var polygon = L.polygon((arrondissement as any).geometry.coordinates[0].map((l: any) => [l[1], l[0]])).addTo(map);
      polygon.on("click", () => onStreetClick(arrondissement.properties.name || ""))
      arrondissements.push(polygon);
    }
    setArrondissements(arrondissements);

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
