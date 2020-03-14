import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

function D3Map(CountryTopoJson, w, h, push) {
  let $svg, $map, electionYear;
  const SCALE = 2250;

  const projection = d3
    .geoMercator()
    .translate([w / 2, h / 2])
    .scale([SCALE])
    .center([100.5, 13.8]);

  const path = d3.geoPath(projection);

  const color = d3
    .scaleThreshold()
    .domain(d3.range(0, 10))
    .range(d3.schemeDark2);

  const simplifyMinWeight = 1e-5;
  const CountryTopo = tps.presimplify(CountryTopoJson);

  const geo = tps.simplify(CountryTopo, simplifyMinWeight);

  const setSVG = svg => {
    $svg = svg;
    $map = $svg.select('#map');
  };

  const setElectionYear = year => {
    electionYear = year;
    render(electionYear);
  };

  const render = year => {
    console.log('d3', year);
    $map
      .selectAll('path.zone')
      .data(topojson.feature(geo, geo.objects[year]).features)
      .enter()
      .append('path')
      .attr(
        'class',
        d => `zone province-${d.properties.province_id} zone-${d.properties.id}`
      )
      .attr('d', path)
      .attr('fill', d => color(d.properties.province_id % 10))
      .on('click', ({ properties: { province_name } }) =>
        push(`/province/${province_name}`)
      );
  };

  return { render, setSVG, setElectionYear };
}

export default D3Map;
