import topojson from './topo/thailand-election.topo.json';
import fs from 'fs';
import { csvParse } from 'd3';

function toNumber(d) {
  return {
    ...d,
    id: +d.id,
    zone: +d.zone,
    candidate_no: +d.candidate_no,
    score: +d.score
  };
}

function merge() {
  const [/* res48, */ res50, res54, res62] = [
    // csvParse(
    //   fs.readFileSync('./csv/candidate_result_2548.csv').toString(),
    //   toNumber
    // ),
    csvParse(
      fs.readFileSync('./csv/candidate_result_2550.csv').toString(),
      toNumber
    ),
    csvParse(
      fs.readFileSync('./csv/candidate_result_2554.csv').toString(),
      toNumber
    ),
    csvParse(
      fs.readFileSync('./csv/candidate_result_2562.csv').toString(),
      toNumber
    )
  ];
  const mergePair = [
    { geo: topojson.objects['election-2550'].geometries, results: res50 },
    { geo: topojson.objects['election-2554'].geometries, results: res54 },
    { geo: topojson.objects['election-2562'].geometries, results: res62 }
  ];

  for (let { geo, results } of mergePair) {
    for (let { properties } of geo) {
      properties.result = [];
      for (let result of results) {
        if (
          properties.province_name === result.province &&
          properties.zone_id === result.zone
        ) {
          properties.result.push(result);
        }
      }
    }
  }

  console.log(
    topojson.objects['election-2550'].geometries.filter(
      ({ properties }) => properties.province_name === 'นครราชสีมา'
    )
  );

  fs.writeFileSync('./topo/thailand-election.topo.json', JSON.stringify(topojson));
}

console.log('Merge candidate results...');
merge();
console.log('[done] Merge candidate results');
