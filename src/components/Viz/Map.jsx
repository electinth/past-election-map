import React, { useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';

import D3Map from './D3Map';
import MapContext from '../../map/context';
import { withRouter } from 'react-router-dom';

const w = innerWidth,
  h = innerHeight;

let map;
const Map = props => {
  const visRef = useRef();
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    console.log('First useEffect');
    map = D3Map(
      CountryTopoJson,
      w,
      h,
      props.history.push,
      electionYear,
      province
    );
    const $gVis = d3.select(visRef.current);
    map.setVis($gVis);
    map.render(electionYear);
  }, [CountryTopoJson]);

  useEffect(() => {
    if (!map) return;
    if (!electionYear) return;
    map.setElectionYear(electionYear);
  }, [electionYear, CountryTopoJson]);

  useEffect(() => {
    if (!map) return;
    console.log('Province Changed');
    map.setProvince(province);
  }, [province, CountryTopoJson]);

  return (
    <svg width={w} height={h}>
      <g id="vis" ref={visRef}>
        <g id="map"></g>
        <g id="border" style={{ pointerEvents: 'none' }}></g>
      </g>
    </svg>
  );
};

export default withRouter(Map);
