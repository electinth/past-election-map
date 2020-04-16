import _ from 'lodash';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

import {
  fillFactory,
  polylabelPositionFactory,
  fontSizeFactory
} from '../../Viz/D3Map';

import partyColor, { partyFill } from '../../../map/color';

function D3Compare(CountryTopoJson, $compare, $defs) {
  const simplifyMinWeight = 5e-4;
  const CountryTopo = tps.presimplify(CountryTopoJson);
  const geo = tps.simplify(CountryTopo, simplifyMinWeight);

  const handleProvinceChange = province => {
    const data = Object.entries(geo.objects)
      .map(([_, g]) => {
        const { type, geometries } = g;
        const provinceGeometries = geometries.filter(
          geometry => geometry.properties.province_name === province
        );
        return {
          type,
          geometries: provinceGeometries
        };
      })
      .map(d => topojson.feature(geo, d));

    const marginTop = 50,
      marginBottom = 20,
      marginH = 25;
    const w = 130 - marginH * 2,
      h = 200 - marginTop - marginBottom;
    const b = d3.geoBounds(data[0]);
    const longest = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]);
    const lonCenter = (b[0][0] + b[1][0]) / 2;
    const latCenter = (b[0][1] + b[1][1]) / 2;
    const SCALE = 6500 / longest;
    const projection = d3
      .geoMercator()
      .translate([marginH + w / 2, marginTop + h / 2])
      .scale([SCALE])
      .center([lonCenter, latCenter]);
    const path = d3.geoPath(projection);
    const $gElection = $compare.data(data).join('svg');

    window.d3 = d3;

    const $path = $gElection
      .selectAll('path')
      .data(d => d.features)
      .join('path')
      .attr('class', 'zone')
      .attr('d', path)
      .attr('stroke-width', '0.6')
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke')
      .each(function(d) {
        const year = this.parentElement.getAttribute('data-election-year');

        d3.select(this).attr(
          'fill',
          fillFactory($defs, 'compare')(year)(province)
        );
      });

    const polylabelPosition = polylabelPositionFactory(projection);
    const fontSize = fontSizeFactory(path);
    const $circle = $gElection
      .selectAll('circle')
      .data(d => d.features)
      .join('circle')
      .attr('class', 'label-bg')
      .attr('cx', polylabelPosition('x'))
      .attr('cy', polylabelPosition('y'))
      .attr('r', geo => {
        const size = fontSize(geo);
        return size / 5;
      })
      .attr('fill', 'var(--color-white)')
      .attr('stroke-width', 0.2)
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke')
      .raise();

    const $label = $gElection
      .selectAll('text.zone-label')
      .data(d => d.features)
      .join('text')
      .attr('class', 'zone-label')
      .text(({ properties: { zone_id } }) => zone_id)
      .attr('x', polylabelPosition('x'))
      .attr('y', polylabelPosition('y'))
      .attr('font-size', geo => fontSize(geo) / 5)
      .attr('dominant-baseline', 'middle')
      .raise();
  };

  const render = year => {};

  return { render, handleProvinceChange };
}

export default D3Compare;
