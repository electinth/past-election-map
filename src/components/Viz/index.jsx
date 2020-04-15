import React, { useRef, useEffect, useContext, useState } from 'react';
import * as d3 from 'd3';

import D3Map from './D3Map';
import MapContext from '../../map/context';
import { withRouter } from 'react-router-dom';

let w = innerWidth,
  h = innerHeight;

let map;

function getElementWidth(selector) {
  const selection = d3.select(selector);
  if (selection.node()) {
    return +selection.style('width').slice(0, -2);
  }
  return 0;
}

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

    const barLeft = getElementWidth('.bar__left');
    const barRight = getElementWidth('.bar__right');

    // center map in viewport excluding left & right bars
    map = D3Map(
      CountryTopoJson,
      w - barLeft - barRight,
      h,
      barLeft + (w - barLeft - barRight) / 2,
      h / 2,
      props.history.push,
      electionYear,
      province,
      setTooltips
    );
    const $gVis = d3.select(visRef.current);
    map.setVis($gVis);
    map.render(electionYear);
  }, [CountryTopoJson]);

  // Auto re-layout map when window resizing
  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      console.log('resize');
      // throttle event
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!map) return;

        w = innerWidth,
        h = innerHeight;
        const barLeft = getElementWidth('.bar__left');
        const barRight = getElementWidth('.bar__right');

        map.setViewport(
          w - barLeft - barRight,
          h,
          barLeft + (w - barLeft - barRight) / 2,
          h / 2
        );
      }, 150);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

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
          <defs id={`map-defs`}></defs>
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
