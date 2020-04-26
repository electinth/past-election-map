import _ from 'lodash';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

import partyColor, { partyFill } from '../../map/color';
import { isMobile } from '../size';

function D3Map(
  CountryTopoJson,
  viewport, // [w, h, cx, cy, bw, bh]
  push,
  initElectionYear,
  initProvince,
  initScale,
  setTooltips
) {
  let $vis,
    $map,
    $defs,
    $zoneLabel,
    $label,
    $zone,
    $border_country,
    $border_province,
    $border_zone,
    electionYear = initElectionYear,
    province = initProvince;
  const SCALE = initScale;

  const projection = d3
    .geoMercator()
    .translate([viewport[2], viewport[3]])
    .scale([SCALE])
    .center([100.5, 13.8]);

  const path = d3.geoPath(projection);

  const simplifyMinWeight = 1e-5;
  const CountryTopo = tps.presimplify(CountryTopoJson);

  const geo = tps.simplify(CountryTopo, simplifyMinWeight);

  const setVis = vis => {
    $vis = vis;
    $map = $vis.select('#map');
    $defs = $vis.select(`#map-defs`);
    $zoneLabel = $vis.select('#zone-label');
  };

  const setViewport = (vp) => {
    viewport = vp;
    setProvince(province);
  };

  const setElectionYear = year => {
    electionYear = year;
    $zone = $zone
      .data(
        topojson.feature(geo, geo.objects[electionYear]).features,
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('path')
      .call(drawMap);

    labelJoin(false);

    $border_country
      .datum(
        topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
          return a === b;
        })
      )
      .call(updateBorderCountry);

    $border_province
      .datum(
        topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
          return (
            a !== b && a.properties.province_id !== b.properties.province_id
          );
        })
      )
      .call(updateBorderProvince);

    $border_zone
      .datum(
        topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
          return (
            a !== b && a.properties.province_id === b.properties.province_id
          );
        })
      )
      .call(updateBorderZone);
  };

  function labelJoin(delay = true) {
    $label = $label
      .data(
        topojson
          .feature(geo, geo.objects[electionYear])
          .features.filter(
            ({ properties: { province_name } }) => province_name === province
          ),
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('g');
    $label.call(addLabel, delay);
  }

  const setProvince = newProvince => {
    province = newProvince;
    // labelJoin();
    removeLabel();

    $zone
      .transition()
      .delay(500)
      .attr('fill', fillSolid); // pre map-panning

    if (province !== 'ประเทศไทย') {
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
        0.875 / Math.max((b[1][0] - b[0][0]) / viewport[4], (b[1][1] - b[0][1]) / viewport[5]);
      const lonCenter = (b[0][0] + b[1][0]) / 2;
      const latCenter = (b[0][1] + b[1][1]) / 2;
      const center = [lonCenter, latCenter];
      const translate = [
        zoomScale * -center[0] + viewport[2],
        zoomScale * -center[1] + viewport[3]
      ];

      let transform = `translate(${translate[0]}, ${translate[1]}) scale(${zoomScale})`;

      // Province zoom view
      $vis
        .transition()
        .duration(750)
        .attr('transform', transform)
        .on('end', () => {
          $zone.attr('fill', fillFactory($defs, 'normal')(electionYear)(province)); // post map-panning
          updatePatternTransform.call($vis.node(), 'zoom');
          labelJoin();
        });
    } else {
      // Thailand view
      $vis
        .transition()
        .duration(750)
        .attr('transform', '')
        .on('end', () => {
          $zone.attr('fill', fillFactory($defs, 'normal')(electionYear)(province)); // post map-panning
          updatePatternTransform.call($vis.node());
        });
    }
  };

  function getTransform(transform) {
    if (!transform) {
      return {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1
      };
    }
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttributeNS(null, 'transform', transform);
    const matrix = g.transform.baseVal.consolidate().matrix;
    let { a, b, c, d, e, f } = matrix;
    let scaleX, scaleY, skewX;
    if ((scaleX = Math.sqrt(a * a + b * b))) (a /= scaleX), (b /= scaleX);
    if ((skewX = a * c + b * d)) (c -= a * skewX), (d -= b * skewX);
    if ((scaleY = Math.sqrt(c * c + d * d)))
      (c /= scaleY), (d /= scaleY), (skewX /= scaleY);
    if (a * d < b * c) (a = -a), (b = -b), (skewX = -skewX), (scaleX = -scaleX);
    return {
      translateX: e,
      translateY: f,
      rotate: (Math.atan2(b, a) * 180) / Math.PI,
      skewX: (Math.atan(skewX) * 180) / Math.PI,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  // Adapt pattern transform to $vis's to make
  // the pattern looks as if it's fixed size
  function updatePatternTransform(size = 'normal') {
    const $$vis = this;
    const t = d3.select($$vis).attr('transform');
    const tt = getTransform(t);
    // adjust scale for zoom view (thailand view)
    const as = size === 'normal' ? 4 : 1;
    const tInverse = [
      `scale(${1 / tt.scaleX / as},${1 / tt.scaleY / as})`,
      `rotate(45)`
    ].join('');
    $defs.selectAll('pattern').attr('patternTransform', tInverse);
  }

  function getFixedFontSize($$vis, font_size = 10) {
    const t = $$vis.attr('transform');
    const tt = getTransform(t);
    return font_size / tt.scaleX;
  }

  // when select a province, we separate fill rendering into 2 steps:
  // (1.) pre map-panning and (2.) post map-panning.
  // The reason is that if we do it in one step, rendering glitch is seen
  // when we inverse transform pattern.
  function fillSolid({ properties }) {
    const { result, province_name } = properties;
    if (!result) return 'white';
    const winner = result.reduce(function(prev, current) {
      return prev.score > current.score ? prev : current;
    });
    // load fill definitions
    const fillColor = partyColor(electionYear)(winner.party);
    return province === province_name || province === 'ประเทศไทย'
      ? fillColor || 'purple' // = color not found
      : 'gainsboro';
  }

  function setTooltipContent({ properties }) {
    if (province !== properties.province_name) {
      setTooltips([properties.province_name]);
    } else {
      if (!properties.result) {
        return setTooltips([
          `${province} เขต ${properties.zone_id}\nการเลือกตั้งเป็นโมฆะ`,
          properties.zone_detail
        ]);
      }

      const rankings = _.orderBy(properties.result, ['score'], ['desc']);
      const winners = rankings.slice(0, properties.quota || 1).map(r => r.party);
      let winnerText = winners[0];
      if (properties.quota > 1) {
        winnerText = _.map(_.groupBy(winners), (list, party) => `${party} ×${list.length}`).join("  ");
      }
      setTooltips([
        `${province} เขต ${properties.zone_id}\n${winnerText}`,
        properties.zone_detail
      ]);
    }
  }

  function drawMap($zone) {
    $zone = $zone
      .attr(
        'class',
        d => `zone province-${d.properties.province_id} zone-${d.properties.id}`
      )
      .attr('d', path)
      .on('click', ({ properties: { province_name } }) => {
        if (isMobile()) {
          // On mobile, no-op when click current province
          province_name === province
            ? null
            : push(`/${electionYear.slice(-4)}/${province_name}`)
        } else {
          province_name === province
            ? push(`/${electionYear.slice(-4)}`)
            : push(`/${electionYear.slice(-4)}/${province_name}`)
        }
      })
      .on('mouseenter', setTooltipContent)
      .attr('fill', fillFactory($defs, 'normal')(electionYear)(province));

    updatePatternTransform.call(
      $vis.node(),
      province !== 'ประเทศไทย' ? 'zoom' : 'normal'
    );
  }

  function removeLabel() {
    if (!$label) return;
    $label.selectAll('circle').remove();
    $label.selectAll('text').remove();
  }

  function addLabel($label, delay = true) {
    $label.selectAll('circle').remove();
    $label.selectAll('text').remove();

    $label.attr('class', 'zone-label');

    const polylabelPosition = polylabelPositionFactory(projection);
    // Smaller font size for large province like Bangkok
    const labelData = $label.data();
    const fontSize = isMobile()
      ? labelData.length < 10 ? 16 : labelData.length < 16 ? 12 : 8
      : labelData.length < 10 ? 20 : labelData.length < 16 ? 16 : 12;

    $label
      .append('circle')
      .attr('cx', polylabelPosition('x'))
      .attr('cy', polylabelPosition('y'))
      .attr('r', geo => {
        return getFixedFontSize($vis, fontSize);
      })
      .attr('fill', 'var(--color-white)')
      .attr('stroke-width', 1)
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('opacity', 0)
      .transition()
      .delay(delay ? 500 : 0)
      .attr('opacity', 1);

    $label
      .append('text')
      .text(({ properties: { zone_id } }) => zone_id)
      .attr('x', polylabelPosition('x'))
      .attr('y', polylabelPosition('y'))
      .attr('font-size', geo => {
        return getFixedFontSize($vis, fontSize);
      })
      .attr('dominant-baseline', 'middle')
      .attr('opacity', 0)
      .transition()
      .delay(delay ? 500 : 0)
      .attr('opacity', 1);
  }

  function updateBorderCountry($country) {
    $country
      .attr('class', 'country-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '1.2')
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke');
  }

  function updateBorderProvince($province) {
    $province

      .attr('class', 'province-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '0.6')
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke');
  }

  function updateBorderZone($zone) {
    $zone
      .attr('class', 'zone-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '0.1')
      .attr('stroke', 'black')
      .attr('vector-effect', 'non-scaling-stroke');
  }

  const render = year => {
    electionYear = year;
    $zone = $map
      .selectAll('path.zone')
      .data(
        topojson
          .feature(geo, geo.objects[electionYear])
          .features.filter(
            ({ properties: { province_name } }) => province_name === province
          ),
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('path')
      .attr('class', 'zone-group');

    $zone.call(drawMap);

    // only draw label when needed.
    // 1. change province
    // 2. change election year in provincial view
    $label = $zoneLabel
      .selectAll('g')
      .data(
        topojson.feature(geo, geo.objects[electionYear]).features,
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('g');

    // Prepare for border drawing
    const $border = d3.select('#border');

    // Country border
    $border_country = $border.append('path').datum(
      topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
        return a === b;
      })
    );

    $border_country.call(updateBorderCountry);

    // Province borders
    $border_province = $border.append('path').datum(
      topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
        return a !== b && a.properties.province_id !== b.properties.province_id;
      })
    );

    $border_province.call(updateBorderProvince);

    // Zone borders
    $border_zone = $border.append('path').datum(
      topojson.mesh(geo, geo.objects[electionYear], function(a, b) {
        return a !== b && a.properties.province_id === b.properties.province_id;
      })
    );

    $border_zone.call(updateBorderZone);
  };

  return { render, setVis, setElectionYear, setProvince, setViewport };
}

function fillFactory($defs, isMobile, uid = '') {
  return electionYear => {
    return province =>
      function({ properties }) {
        const { result: candidates, province_name, quota } = properties;
        if (!candidates) {
          return province === province_name || province === 'ประเทศไทย'
            ? 'white'
            : 'gainsboro';
        }

        const sortedCandidates = _.orderBy(candidates, ['score'], ['desc']);
        const winners = sortedCandidates.slice(0, quota);
        const winnerParty = winners[0].party;
        const totalWinnerParty = winners.filter(w => w.party === winnerParty)
          .length;

        // load fill definitions
        const fillOptions = partyFill(electionYear, isMobile, uid)(
          winnerParty,
          totalWinnerParty,
          quota
        );
        if (fillOptions.type === 'pattern') {
          $defs.call(fillOptions.createPattern);
        }
        return province === province_name || province === 'ประเทศไทย'
          ? fillOptions.fill || 'purple' // = color not found
          : 'gainsboro';
      };
  };
}

function polylabelPositionFactory(projection) {
  return axis => {
    return ({ properties: { labelLat: lat, labelLon: lon } }) => {
      const [x, y] = projection([lon, lat]);

      return axis === 'x' ? x : y;
    };
  };
}

function fontSizeFactory(path) {
  return geo => {
    const [[x0, y0], [x1, y1]] = path.bounds(geo); // adjust font size according to zone bound
    const yRange = y1 - y0;
    const xRange = x1 - x0;
    return d3.min([yRange, xRange]);
  };
}

export { fillFactory, polylabelPositionFactory, fontSizeFactory };
export default D3Map;
