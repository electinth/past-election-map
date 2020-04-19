import * as d3 from 'd3';
import fs from 'fs';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';
import polylabel from 'polylabel';
import CountryTopoJson from './topo/thailand-election.topo.json';

const simplifyMinWeight = 1e-5;
const CountryTopo = tps.presimplify(CountryTopoJson);

const geo = tps.simplify(CountryTopo, simplifyMinWeight);

function makePolylabelProps(year) {
  const data = topojson.feature(CountryTopoJson, CountryTopoJson.objects[year])
    .features;

  data.forEach(({ properties, geometry }) => {
    // console.log(properties);
    let lon, lat;
    [lon, lat] = polylabel(geometry.coordinates);
    if ([lat, lon].includes(NaN)) {
      console.log(year, properties.province_name, properties.zone_id);
      console.log(geometry.coordinates);
      // console.log(biggestPart(geometry.coordinates));
      [lon, lat] = polylabel([biggestPart(geometry.coordinates)]);
      function biggestPart(coordinates) {
        let coords = coordinates[0];
        if (coords.length == 1) {
          //find the biggest part in each province
          var max_length = -1;
          var max_i = -1;
          for (var i = 0; i < coordinates.length; i++) {
            if (max_length < coordinates[i][0].length) {
              max_length = coordinates[i][0].length;
              max_i = i;
            }
          }
          coords = coordinates[max_i][0];
        }
        return coords;
      }
    }

    Object.assign(properties, { labelLat: lat, labelLon: lon });
  });
}

console.log('Add label position...');
makePolylabelProps('election-2562');
makePolylabelProps('election-2557');
makePolylabelProps('election-2554');
makePolylabelProps('election-2550');
fs.writeFileSync(
  './topo/thailand-election.topo.json',
  JSON.stringify(CountryTopoJson)
);
console.log('[done] Add label position');

// console.log(CountryTopoJson.objects['election-2562'].geometries[0].properties);
