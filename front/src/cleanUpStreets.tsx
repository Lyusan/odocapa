import Streets from './component/data/fullStreets.json';
import { getArrondissements, HIGHWAYS_TYPES, isAtLeastOneCoordInPolygons } from './helper/map';
import * as fs from 'fs';
console.log("toto")
let filteredStreets = (Streets as any).features.filter((s: any) => HIGHWAYS_TYPES.includes(s.properties.highway || ""))
        .filter((s: any) => (s.properties.noname || "") !== "yes")
        .filter((street: any) => isAtLeastOneCoordInPolygons(street.geometry.coordinates as [number, number][], getArrondissements().map(a => a.polygon)));
const resMap: Record<string, { name: string, polylines: [number, number][][] }> = {};
filteredStreets.forEach((street: any) => {
    const streetName = street.properties.name
    if (!resMap[streetName])
        resMap[streetName] = { name: streetName, polylines: [] }
    if (street.geometry.type === "Polygon")
        resMap[streetName].polylines.push((street.geometry.coordinates[0] as [number, number][]).map(a => [a[1], a[0]]));
    if (street.geometry.type === "LineString")
        resMap[streetName].polylines.push((street.geometry.coordinates as [number, number][]).map(a => [a[1], a[0]]));
});
console.log(JSON.stringify(Object.values(resMap)));
// fs.writeFile('./test.json', JSON.stringify(Object.values(resMap)), (err: any) => {
//     if (err) {
//         console.error(err);
//     }
// });