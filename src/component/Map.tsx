import '../App.css';
import L, { LatLngTuple } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import OverPassData from './DataFull.json';
import "../../node_modules/leaflet/dist/leaflet.css"


interface IProps {
}

interface IState {
  map?: L.Map;
}


class Map extends React.Component<IProps, IState> {

    // constructor(props: IProps) {
    //     super(props);
    //     this.state = { map: undefined };
    // }

    componentDidMount() {
        var container: any = L.DomUtil.get("map");

        if (container?._leaflet_id === null) return;
        if (container != null) {
            container._leaflet_id = null;
        }

        const data: any =  OverPassData;
        const nodes: Record<number, LatLngTuple> = {};
        const ways: Record<string, { name: string, parts: LatLngTuple[] }> = {};
        for (let el of data.elements) {
            if (el.type === "node") nodes[el.id] = [el.lat as number, el.lon as number];
            else if (ways[el.tags?.name as string]) ways[el.tags?.name as string].parts.push(el.nodes as LatLngTuple);
            else ways[el.tags?.name as string] = { name: el.tags?.name as string, parts: [el.nodes as LatLngTuple] };
        }
          
          var map = L.map("map").setView([48.863833404882456, 2.3414597583844996], 12);
          
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
          
          for (let way of Object.values(ways)) {
            const color = Math.random() > 0.8 ? "red" : "blue";
            for (let part of way.parts) {
              var latlngs = part.map((id) => nodes[id]);
              var polyline = L.polyline(latlngs, { color }).addTo(map);
            }
          }
    }

    render() {
        return (
            <div>
                <div id="map" className='Map'></div>
            </div>
        );
    }
}

export default Map;
