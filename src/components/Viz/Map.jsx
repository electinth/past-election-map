import React, { useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';

import D3Map from './D3Map';
import MapContext from '../../map/context';
import { withRouter } from 'react-router-dom';

const w = 400,
  h = 700;

let map;
const Map = props => {
  const svgRef = useRef();
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);

  useEffect(() => {
    console.log('First useEffect');
    map = D3Map(
      CountryTopoJson,
      w,
      h,
      props.history.push,
      electionYear,
      province
    );
    const $svg = d3.select(svgRef.current);
    map.setSVG($svg);
    map.render(electionYear);
  }, []);

  useEffect(() => {
    if (!map) return;
    console.log('Province Changed');
    map.setProvince(province);
  }, [province]);

  return (
    <svg id="vis" ref={svgRef} width={w} height={h}>
      <g id="map"></g>
      <g id="border" style={{ pointerEvents: 'none' }}></g>
    </svg>
  );
};

export default withRouter(Map);
