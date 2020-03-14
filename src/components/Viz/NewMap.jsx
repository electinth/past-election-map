import React, { useRef, useEffect, useContext } from 'react';
import * as d3 from 'd3';

import D3Map from './D3Map';
import MapContext from '../../map/context';
import { withRouter } from 'react-router-dom';

const w = 400,
  h = 700;

const NewMap = props => {
  const svgRef = useRef();
  const { electionYear, CountryTopoJson } = useContext(MapContext);
  const map = D3Map(CountryTopoJson, w, h, props.history.push);

  useEffect(() => {
    const $svg = d3.select(svgRef.current);
    map.setSVG($svg);
    map.render(electionYear);
  }, []);

  return (
    <svg id="vis" ref={svgRef} width={w} height={h}>
      <g id="map"></g>
      <g id="border"></g>
    </svg>
  );
};

export default withRouter(NewMap);
