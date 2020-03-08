import React, { useEffect, useContext } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';
// import CountryTopoJson from '../../data/thailand-election.topo.json';
import { withRouter } from 'react-router-dom';
import MapContext from '../../map/context.jsx';

const Map = props => {
  const { electionYear, CountryTopoJson } = useContext(MapContext);
  // Default topojson layer

  // Precompute simplify topojson
  const simplifyMinWeight = 1e-5;
  const ContryTopo = tps.presimplify(CountryTopoJson);

  // mock color scheme
  const color = d3
    .scaleThreshold()
    .domain(d3.range(0, 10))
    .range(d3.schemeDark2);

  let active;
  let $svg;
  let path;
  let w, h, SCALE;
  useEffect(() => {
    w = innerWidth;
    h = innerHeight;
    SCALE = 2250;

    const projection = d3
      .geoMercator()
      .translate([0, 0])
      .scale([SCALE]);

    const bkk = projection([100.5, 13.7]);

    projection.translate([-bkk[0] + w / 2, -bkk[1] + h / 2]);

    path = d3.geoPath(projection);

    $svg = d3
      .select('#vis')
      .attr('width', w)
      .attr('height', Math.max(800, h));

    const $map = d3.select('#map');

    // simplify topology on the fly
    // @see https://bl.ocks.org/maryzam/5f0db76db6bceb00aae4b04a69bcb43d
    const geo = tps.simplify(ContryTopo, simplifyMinWeight);

    // Election zones
    const $path = $map
      .selectAll('path.zone')
      .data(topojson.feature(geo, geo.objects[electionYear]).features)
      .enter()
      .append('path')
      .attr(
        'class',
        d => `zone province-${d.properties.province_id} zone-${d.properties.id}`
      )
      .attr('d', path)
      .attr('fill', function(d) {
        return color(d.properties.province_id % 10);
      })
      .attr('cursor', 'pointer')
      .on('click', click);

    // Prepare for border drawing
    const $border = d3.select('#border');

    // Country border
    const $border_country = $border
      .append('path')
      .datum(
        topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
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
        topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
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
        topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
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
  }, []);

  function click(d, i, N) {
    EnterProvincialView(d);
    if (active === d) return reset();
    $svg.selectAll('.active').classed('active', false);
    d3.select(this).classed('active', (active = d));

    const b = path.bounds(d);
    const scale =
      0.75 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
    const centroid = path.centroid(d);
    const translate = [
      scale * (-centroid[0] + w / 2),
      scale * (-centroid[1] + h / 2)
    ];

    let transform = `translate(${translate[0]}, ${translate[1]}) scale(${scale})`;

    $svg
      .transition()
      .duration(750)
      .attr('transform', transform);
  }

  function reset() {
    props.history.push('/');

    $svg.selectAll('.active').classed('active', (active = false));
    $svg
      .transition()
      .duration(750)
      .attr('transform', '');
  }

  function EnterProvincialView({ properties: { province_name } }) {
    const province = province_name
      .toLowerCase()
      .split(' ')
      .join('');
    const path = `/province/${province}`;
    props.history.push(path);
  }

  return (
    <svg id="vis">
      <g id="map"></g>
      <g id="border" style={{ pointerEvents: 'none' }}></g>
    </svg>
  );
};

export default withRouter(Map);
