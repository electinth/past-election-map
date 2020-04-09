import React, { useRef, useEffect, useContext, useState } from 'react';
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
  const [tooltips, setTooltips] = useState('');
  const [tooltipsStyles, setTooltipStyles] = useState({
    left: null,
    top: null,
    opacity: 0
  });

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    console.log('First useEffect');
    map = D3Map(
      CountryTopoJson,
      w,
      h,
      props.history.push,
      electionYear,
      province,
      setTooltips
    );
    const $gVis = d3.select(visRef.current);
    console.log($gVis);
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
    <figure className="viz-layer">
      <div className="tooltips" style={tooltipsStyles}>
        {tooltips}
      </div>
      <svg width={w} height={h}>
        <g id="vis" ref={visRef}>
          <g
            id="map"
            onMouseMove={e =>
              setTooltipStyles({
                top: e.clientY - 100,
                left: e.clientX,
                transform: 'translateX(-50%)',
                opacity: 1
              })
            }
            onMouseLeave={() =>
              setTooltipStyles({
                top: null,
                left: null,
                opacity: 0
              })
            }
          ></g>
          <g id="border" style={{ pointerEvents: 'none' }}></g>
          <g id="zone-label" style={{ pointerEvents: 'none' }}></g>
        </g>
      </svg>
    </figure>
  );
};

export default withRouter(Map);
