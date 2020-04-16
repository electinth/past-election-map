import * as d3 from 'd3';
import fs from 'fs';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';
import polylabel from 'polylabel';
import CountryTopoJson from './thailand-election.topo.json';

const simplifyMinWeight = 1e-5;
const CountryTopo = tps.presimplify(CountryTopoJson);

const geo = tps.simplify(CountryTopo, simplifyMinWeight);

function makePolylabelProps(year) {
  const data = topojson.feature(CountryTopoJson, CountryTopoJson.objects[year])
    .features;

  data.forEach(({ properties, geometry }) => {
    console.log(properties);
    let lon, lat;
    if (properties.province_name === 'สกลนคร' && year === 'election-2554') {
      [lon, lat] = d3.geoCentroid(geometry);
    } else {
      [lon, lat] = polylabel(geometry.coordinates);
    }

    Object.assign(properties, { labelLat: lat, labelLon: lon });
  });
}

makePolylabelProps('election-2562');
makePolylabelProps('election-2557');
makePolylabelProps('election-2554');
makePolylabelProps('election-2550');
fs.writeFileSync(
  './thailand-election.topo.json',
  JSON.stringify(CountryTopoJson)
);

// console.log(CountryTopoJson.objects['election-2562'].geometries[0].properties);
