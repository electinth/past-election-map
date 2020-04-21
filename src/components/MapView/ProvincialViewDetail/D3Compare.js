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
  const getProvinceFeature = (topo, object_name, province_name) => {
    const { type, geometries } = topo.objects[object_name];
    const provinceGeometries = geometries.filter(
      geometry => geometry.properties.province_name === province_name
    );
    return topojson.feature(topo, {
      type,
      geometries: provinceGeometries
    });
  };

  const handleProvinceChange = province => {
    // adaptive simplification
    // the larger province, the more simlified
    const pf = getProvinceFeature(
      CountryTopoJson,
      `election-${_.last(compareYears)}`,
      province
    );
    const pb = d3.geoBounds(pf);
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
      getProvinceFeature(geo, `election-${electionYear}`, province)
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
    const $gElection = $compare.data(data).join('svg');

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

        d3.select(this)
          .attr('fill', fillFactory($defs, 'compare')(year)(province))
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

  function setTooltipContent({ properties }) {
    if (!properties) {
      setTooltips([properties.province_name]);
    } else {
      if (!properties.result)
        return setTooltips(['การเลือกตั้งเป็นโมฆะ', properties.zone_detail]);
      const winner = properties.result.reduce(function(prev, current) {
        return prev.score > current.score ? prev : current;
      });
      setTooltips([winner.party, properties.zone_detail]);
    }
  }

  function handleOnMouseLeave() {
    setTooltips([]);
  }

  const render = year => {};

  return { render, handleProvinceChange };
}

export default D3Compare;
