import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

import partyColor from '../../../map/color';
import MapContext from '../../../map/context';
import {
  fillFactory,
  polylabelPositionFactory,
  fontSizeFactory
} from '../../Viz/D3Map';

const Container = styled.div`
  height: 520px;
  width: 350px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 10px 6px 6px 6px;
  border: 1px solid #979797;
`;

const Title = styled.h1`
  font-family: 'The MATTER';
  font-size: 3rem;
  text-align: center;
  color: #000000;
`;

const SeeMore = styled.button`
  height: 53px;
  width: 263px;
  border: 1px solid #333333;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  margin: 0 auto;
  font-family: 'The MATTER';
  font-size: 2rem;
  color: black;
  display: block;
  margin: auto;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

let geo, $defs;
const ProvinceAreaCompare = () => {
  const { province, CountryTopoJson } = useContext(MapContext);

  const compareRef = useRef(null);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const simplifyMinWeight = 1e-5;
    const CountryTopo = tps.presimplify(CountryTopoJson);
    geo = tps.simplify(CountryTopo, simplifyMinWeight);
    $defs = d3.select(`#map-defs-compare`);
  }, [CountryTopoJson]);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const $compare = d3.select(compareRef.current);

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

    const w = $compare.node().parentElement.parentElement.offsetWidth,
      h = 0.75 * $compare.node().parentElement.parentElement.offsetHeight;
    const b = d3.geoBounds(data[0]);
    const longest = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]);

    const SCALE = 6500 / longest;
    const center = d3.geoCentroid(data[0]);
    const projection = d3
      .geoMercator()
      .translate([w / 4, h / 4])
      .scale([SCALE])
      .center(center);
    const path = d3.geoPath(projection);

    const $gElection = $compare
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d, i) => {
        const x = ((i % 2) * w) / 2;
        const y = i >= 2 ? h / 2 : 0;
        return `translate(${x}, ${y})`;
      });

    const $path = $gElection
      .selectAll('path')
      .data(d => d.features)
      .join('path')
      .attr('class', 'zone')
      .attr('d', path)
      .attr('s', console.log)
      // .attr('fill', fillFactory($defs)(electionYear)(province))
      .attr('stroke-width', '1')
      .attr('stroke', 'black')
      .each(function(d) {
        const year = this.parentElement.className.baseVal;
        console.log(year, d3.select(this));
        d3.select(this).attr('fill', fillFactory($defs)(year)(province));
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
      .raise();

    const $label = $gElection
      .selectAll('text')
      .data(d => d.features)
      .join('text')
      .attr('class', 'zone-label')
      .text(({ properties: { zone_id } }) => zone_id)
      .attr('x', polylabelPosition('x'))
      .attr('y', polylabelPosition('y'))
      .attr('font-size', geo => fontSize(geo) / 5)
      .attr('dominant-baseline', 'middle')
      .raise();
  }, [compareRef, CountryTopoJson, province]);

  return (
    <Container>
      <Title>เปรียบเทียบ 4 ปี</Title>
      <svg width="100%" height="calc(100% - 130px)">
        <defs id={`map-defs-compare`}></defs>
        <g className="compare-province" ref={compareRef}>
          <g className="election-2562"></g>
          <g className="election-2557"></g>
          <g className="election-2554"></g>
          <g className="election-2550"></g>
        </g>
      </svg>
      <Link to={`/compare/${province}`} style={{ textDecoration: 'none' }}>
        <SeeMore>ดูเพิ่มเติม</SeeMore>
      </Link>
    </Container>
  );
};

export default ProvinceAreaCompare;
