import _ from 'lodash';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

import {
  fillFactory,
  polylabelPositionFactory,
  fontSizeFactory
} from '../../Viz/D3Map';

function D3Compare(
  CountryTopoJson,
  compareYears,
  $compare,
  $defs,
  dimension,
  initScale,
  setTooltips = () => {}
) {
  const getZoneFeature = (topo, object_name, province_name) => {
    const { type, geometries } = topo.objects[object_name];
    const provinceGeometries = geometries.filter(
      geometry => geometry.properties.province_name === province_name
    );
    return topojson.feature(topo, {
      type,
      geometries: provinceGeometries
    });
  };

  const getProvinceFeature = (topo, object_name, province_name) => {
    const { type, geometries } = topo.objects[object_name];
    const provinceGeometries = geometries.filter(
      geometry => geometry.properties.province_name === province_name
    );
    return topojson.mesh(
      topo,
      {
        type,
        geometries: provinceGeometries
      },
      function(a, b) {
        return a === b;
      }
    );
  };

  const handleProvinceChange = province => {
    // adaptive simplification
    // the larger province, the more simlified
    const zf = getZoneFeature(
      CountryTopoJson,
      `election-${_.last(compareYears)}`,
      province
    );
    const pb = d3.geoBounds(zf);
    const size = Math.max(pb[1][0] - pb[0][0], pb[1][1] - pb[0][1]);
    const simplifyScale = d3
      .scaleLinear()
      .domain([0.3, 2.9])
      .range([1e-5, 5e-4]);

    const simplifyMinWeight = simplifyScale(size);
    const CountryTopo = tps.presimplify(CountryTopoJson);
    const geo = tps.simplify(CountryTopo, simplifyMinWeight);

    // province's geojson features for all years
    const data = compareYears.map(electionYear =>
      getZoneFeature(geo, `election-${electionYear}`, province)
    );
    const b = d3.geoBounds(_.last(data));

    const longest = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]);
    const lonCenter = (b[0][0] + b[1][0]) / 2;
    const latCenter = (b[0][1] + b[1][1]) / 2;
    const SCALE = initScale / longest;
    const projection = d3
      .geoMercator()
      .translate([
        dimension.marginLeft + dimension.w / 2,
        dimension.marginTop + dimension.h / 2
      ])
      .scale([SCALE])
      .center([lonCenter, latCenter]);
    const path = d3.geoPath(projection);

    const provinceBoundarydata = compareYears.map(electionYear =>
      getProvinceFeature(geo, `election-${electionYear}`, province)
    );
    const $gProvince = $compare.data(provinceBoundarydata).join();
    $gProvince
      .selectAll('path.province')
      .data(d => [d])
      .join('path')
      .attr('class', 'province')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '3')
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke');

    const $gElection = $compare.data(data).join('svg');

    const $path = $gElection
      .selectAll('path.zone')
      .data(d => d.features)
      .join('path')
      .attr('class', 'zone')
      .attr('d', path)
      .attr('stroke-width', '0.6')
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke')
      .each(function(d) {
        const year = this.parentElement.getAttribute('data-election-year');

        d3.select(this)
          .attr('fill', fillFactory($defs, 'small', 'compare')(year)(province))
          .on('mouseleave', handleOnMouseLeave)
          .on('mouseenter', setTooltipContent);
      });

    const polylabelPosition = polylabelPositionFactory(projection);
    const fontSize = fontSizeFactory(path);
    const $circle = $gElection
      .selectAll('circle.label-bg')
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
      .style('pointer-events', 'none')
      .raise();

    const $label = $gElection
      .selectAll('text.zone-label')
      .data(d => d.features)
      .join('text')
      .attr('class', 'zone-label')
      .text(({ properties: { zone_id } }) => zone_id)
      .attr('x', polylabelPosition('x'))
      .attr('y', d => {
        const y = polylabelPosition('y')(d);
        const em = fontSize(d) / 5;
        return y + 0.25 * em;
      })
      .attr('font-size', geo => fontSize(geo) / 5)
      .style('pointer-events', 'none')
      .raise();
  };

  function setTooltipContent({ properties }) {
    if (!properties) {
      setTooltips([properties.province_name]);
    } else {
      const province = properties.province_name;

      if (!properties.result) {
        return setTooltips([
          `${province} เขต ${properties.zone_id}\nการเลือกตั้งเป็นโมฆะ`,
          properties.zone_detail
        ]);
      }

      const rankings = _.orderBy(properties.result, ['score'], ['desc']);
      const winners = rankings
        .slice(0, properties.quota || 1)
        .map(r => r.party);
      let winnerText = winners[0];
      if (properties.quota > 1) {
        winnerText = _.map(
          _.groupBy(winners),
          (list, party) => `${party} ×${list.length}`
        ).join('  ');
      }
      setTooltips([
        `${province} เขต ${properties.zone_id}\n${winnerText}`,
        properties.zone_detail
      ]);
    }
  }

  function handleOnMouseLeave() {
    setTooltips([]);
  }

  const render = year => {};

  return { render, handleProvinceChange };
}

export default D3Compare;
