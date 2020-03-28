import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';
import { party62 } from '../../map/color';
import polylabel from 'polylabel';

function D3Map(
  CountryTopoJson,
  w,
  h,
  push,
  initElectionYear,
  initProvince,
  setTooltips
) {
  let $vis,
    $map,
    $zoneLabel,
    $gZone,
    $gLabel,
    $zone,
    $currentZoneLabel,
    $border_country,
    $border_province,
    $border_zone,
    electionYear = initElectionYear,
    province = initProvince;
  const SCALE = 2250;

  const projection = d3
    .geoMercator()
    .translate([w / 2, h / 2])
    .scale([SCALE])
    .center([100.5, 13.8]);

  const path = d3.geoPath(projection);

  const simplifyMinWeight = 1e-5;
  const CountryTopo = tps.presimplify(CountryTopoJson);

  const geo = tps.simplify(CountryTopo, simplifyMinWeight);

  const setVis = vis => {
    $vis = vis;
    console.log('setVis', $vis);
    $map = $vis.select('#map');
    $zoneLabel = $vis.select('#zone-label');
  };

  const setElectionYear = year => {
    electionYear = year;
    // TODOs update MAP;
    $gZone = $gZone
      .data(
        topojson.feature(geo, geo.objects[electionYear]).features,
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('g')
      .call(drawMap);

    $gLabel = $gLabel
      .data(
        topojson.feature(geo, geo.objects[electionYear]).features,
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('g');

    $currentZoneLabel = $gLabel.filter(
      ({ properties: { province_name } }) => province_name === province
    );

    $currentZoneLabel.call(addLabel);

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

  const setProvince = newProvince => {
    province = newProvince;
    $currentZoneLabel
      .selectAll('text')
      .transition()
      .delay(500)
      .attr('opacity', 0)
      .remove();
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
        0.875 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
      const centroid = path.centroid(selection);
      const translate = [
        zoomScale * -centroid[0] + w / 2,
        zoomScale * -centroid[1] + h / 2
      ];

      let transform = `translate(${translate[0]}, ${translate[1]}) scale(${zoomScale})`;

      $vis
        .transition()
        .duration(750)
        .attr('transform', transform);

      console.log('setProvince', $currentZoneLabel);
      $currentZoneLabel = $gLabel.filter(
        ({ properties: { province_name } }) => province_name === province
      );

      $currentZoneLabel.call(addLabel);
    } else {
      $vis
        .transition()
        .duration(750)
        .attr('transform', '');
    }

    $zone
      .transition()
      .delay(500)
      .attr('fill', fill);
  };

  function fill({ properties: { result, province_name } }) {
    if (!result) return 'white';
    const winner = result.reduce(function(prev, current) {
      return prev.score > current.score ? prev : current;
    });
    return province === province_name || province === 'ประเทศไทย'
      ? party62(winner.party) || 'purple'
      : 'gainsboro';
  }

  function setTooltipContent({ properties }) {
    if (province !== properties.province_name) {
      setTooltips(properties.province_name);
    } else {
      if (!properties.result) return setTooltips('การเลือกตั้งเป็นโมฆะ');
      const winner = properties.result.reduce(function(prev, current) {
        return prev.score > current.score ? prev : current;
      });
      setTooltips(winner.party);
    }
  }

  function drawMap($gZone) {
    $zone = $gZone
      .selectAll('path')
      .data(d => [d])
      .join('path')
      .attr(
        'class',
        d => `zone province-${d.properties.province_id} zone-${d.properties.id}`
      )
      .attr('d', path)
      .on('click', ({ properties: { province_name } }) =>
        province_name === province
          ? push(`/${electionYear}`)
          : push(`/${electionYear}/${province_name}`)
      )
      .on('mouseenter', setTooltipContent)
      .attr('fill', fill);
  }

  function addLabel($currentZoneLabel) {
    const $label = $currentZoneLabel
      .selectAll('text')
      .data(d => [d])
      .join('text')
      .attr('class', 'zone-label')
      .text(({ properties: { zone_id } }) => zone_id)
      .attr('x', polylabelPosition('x'))
      .attr('y', polylabelPosition('y'))
      .attr('font-size', fontSize)
      .attr('opacity', 0)
      .transition()
      .delay(500)
      .attr('opacity', 1);
    function polylabelPosition(axis) {
      return ({ geometry: { coordinates } }) => {
        const [lon, lat] = polylabel(coordinates);
        const [x, y] = projection([lon, lat]);

        return axis === 'x' ? x : y;
      };
    }

    function fontSize(geo) {
      const [[x0, y0], [x1, y1]] = path.bounds(geo); // adjust font size according to zone bound
      const yRange = y1 - y0;
      const xRange = x1 - x0;
      return d3.min([yRange, xRange]) / 2.5;
    }
  }

  function updateBorderCountry($country) {
    $country
      .attr('class', 'country-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '1.2')
      .attr('stroke', 'black');
  }

  function updateBorderProvince($province) {
    $province

      .attr('class', 'province-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '0.6')
      .attr('stroke', 'black');
  }

  function updateBorderZone($zone) {
    $zone
      .attr('class', 'zone-border')
      .attr('d', path)
      .attr('fill', 'transparent')
      .attr('stroke-width', '0.1')
      .attr('stroke', 'black');
  }

  const render = year => {
    console.log('D3Map Render Function', year);
    electionYear = year;
    $gZone = $map
      .selectAll('g.zone-group')
      .data(
        topojson.feature(geo, geo.objects[electionYear]).features,
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('g')
      .attr('class', 'zone-group');

    $gZone.call(drawMap);

    // only draw label when needed.
    // 1. change province
    // 2. change election year in provincial view
    $gLabel = $zoneLabel
      .selectAll('g.text-group')
      .data(
        topojson.feature(geo, geo.objects[electionYear]).features,
        ({ properties: { id } }) => `${electionYear} ${id}`
      )
      .join('g')
      .attr('class', 'text-group');

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

  return { render, setVis, setElectionYear, setProvince };
}

export default D3Map;
