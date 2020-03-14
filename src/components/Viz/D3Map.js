import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

function D3Map(CountryTopoJson, w, h, push, initElectionYear, initProvince) {
  console.log('Shoiuld run only once');
  let $svg = null,
    $map,
    electionYear = initElectionYear,
    province = initProvince;
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
    console.log('setSVG', $svg);
    $map = $svg.select('#map');
  };

  const setElectionYear = year => {
    electionYear = year;
    // TODOs update MAP;
    console.log('set Election Year', $svg);
  };

  const setProvince = newProvince => {
    province = newProvince;
    console.log($svg);
    if (province !== 'ประเทศไทย') {
      // Reset
      console.log('setProvince', electionYear);

      const selection = {
        type: 'FeatureCollection',
        features: topojson
          .feature(geo, geo.objects[electionYear])
          .features.filter(
            ({ properties: { province_name } }) => province_name === province
          )
      };

      const b = path.bounds(selection);
      const zoomScale =
        0.75 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
      const centroid = path.centroid(selection);
      const translate = [
        zoomScale * (-centroid[0] + w / 2),
        zoomScale * (-centroid[1] + h / 2)
      ];

      let transform = `translate(${translate[0]}, ${translate[1]}) scale(${zoomScale})`;

      $svg
        .transition()
        .duration(750)
        .attr('transform', transform);
    } else {
      // Zoom that province
      $svg
        .transition()
        .duration(750)
        .attr('transform', '');
    }
  };

  const render = year => {
    console.log('D3Map Render Function', year);
    electionYear = year;
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
        province_name === province
          ? push('/')
          : push(`/${electionYear}/${province_name}`)
      );

    // Prepare for border drawing
    const $border = d3.select('#border');

    // Country border
    const $border_country = $border
      .append('path')
      .datum(
        topojson.mesh(geo, geo.objects[year], function(a, b) {
          return a === b;
        })
      )
      .attr('class', 'country-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '1.2')
      .attr('stroke', 'white');

    // Province borders
    const $border_province = $border
      .append('path')
      .datum(
        topojson.mesh(geo, geo.objects[year], function(a, b) {
          return (
            a !== b && a.properties.province_id !== b.properties.province_id
          );
        })
      )
      .attr('class', 'province-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '0.6')
      .attr('stroke', 'white');

    // Zone borders
    const $border_zone = $border
      .append('path')
      .datum(
        topojson.mesh(geo, geo.objects[year], function(a, b) {
          return (
            a !== b && a.properties.province_id === b.properties.province_id
          );
        })
      )
      .attr('class', 'zone-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '0.1')
      .attr('stroke', 'white');
  };

  return { render, setSVG, setElectionYear, setProvince };
}

export default D3Map;
