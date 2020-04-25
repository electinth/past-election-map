import React, { useRef, useEffect, useContext, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import BeatLoader from 'react-spinners/BeatLoader';

import D3Map from './D3Map';
import MapContext from '../../map/context';
import { withRouter } from 'react-router-dom';
import { isMobile } from '../size';

let w = innerWidth,
  h = innerHeight;

let map;

const ZoneDetailText = styled.p`
  max-width: 240px;
  font-size: 1.2rem;
  font-family: 'Noto Sans Thai';
  white-space: normal;
  pointer-events: none;
`;

function getElementWidth(selector) {
  const selection = d3.select(selector);
  if (selection.node()) {
    return +selection.style('width').slice(0, -2) || 0;
  }
  return 0;
}

/**
 *
 * @param {*} w
 * @param {*} h
 * @return {Array} 0 = width, 1 = height, 2 = center X, 3 = center Y
 */
function getViewport(w, h) {
  if (isMobile()) {
    return [
      w,
      h,
      w / 2,
      (h - 320) / 2
    ];
  } else {
    const barLeft = getElementWidth('.bar__left');
    const barRight = getElementWidth('.bar__right');
    return [
      w - barLeft - barRight,
      h,
      barLeft + (w - barLeft - barRight) / 2,
      h / 2
    ];
  }
}

const Map = props => {
  const visRef = useRef();
  const tooltipZoneRef = useRef();
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);
  const [tooltips, setTooltips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tooltipsStyles, setTooltipStyles] = useState({
    left: null,
    top: null,
    opacity: 0
  });

  useEffect(() => {
    setLoading(true);
    if (CountryTopoJson.length === 0) return;

    const viewport = getViewport(w, h);

    // center map in viewport excluding left & right bars
    map = D3Map(
      CountryTopoJson,
      ...getViewport(w, h),
      props.history.push,
      electionYear,
      province,
      setTooltips
    );
    const $gVis = d3.select(visRef.current);
    map.setVis($gVis);
    map.render(electionYear);
    setLoading(false);
  }, [CountryTopoJson]);

  // Auto re-layout map when window resizing
  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      // throttle event
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!map) return;
        map.setViewport(...getViewport(innerWidth, innerHeight));
      }, 150);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!electionYear) return;
    map.setElectionYear(electionYear);
  }, [electionYear, CountryTopoJson]);

  useEffect(() => {
    if (!map) return;
    map.setProvince(province);
  }, [province, CountryTopoJson]);

  return (
    <figure className="viz-layer">
      <div
        className="tooltips"
        style={{ ...tooltipsStyles, pointerEvents: 'none' }}
      >
        {tooltips[0]}
        <ZoneDetailText ref={tooltipZoneRef}>{tooltips[1]}</ZoneDetailText>
      </div>
      <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
        <BeatLoader size={25} color={'white'} loading={loading} />
      </div>
      <svg width={w} height={h}>
        <g id="vis" ref={visRef}>
          <defs id={`map-defs`}></defs>
          <g
            id="map"
            onMouseMove={e => {
              const offset = tooltipZoneRef.current.offsetHeight;
              setTooltipStyles({
                top: e.clientY - 100 - offset,
                left: e.clientX,
                overflow: 'hidden',
                transform: 'translate(-50%, 0%)',
                opacity: 1
              });
            }}
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
