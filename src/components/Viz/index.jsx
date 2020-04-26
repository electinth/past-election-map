import React, { useRef, useEffect, useContext, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import BeatLoader from 'react-spinners/BeatLoader';

import D3Map from './D3Map';
import MapContext from '../../map/context';
import { withRouter } from 'react-router-dom';
import { isMobile, device } from '../size';

const sitenavHeight = 60;
const w = innerWidth;
const h = innerHeight - sitenavHeight;

let map;

const ZoneDetailTitle = styled.div`
  white-space: pre-wrap;
`;

const ZoneDetailText = styled.p`
  min-width: 180px;
  max-width: 240px;
  font-size: 1.2rem;
  font-family: 'Noto Sans Thai';
  white-space: normal;
  pointer-events: none;
`;

const Loader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media ${device.tablet} {
    top: calc(6rem + ((100vh - 36rem) / 2));
  }
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
 * @return {Array} 0 = width, 1 = height,
 *  2 = center X, 3 = center Y
 *  4 = bound W, 5 = bound H
 */
function getViewport(w, h) {
  if (isMobile()) {
    return [
      w,
      h,
      w / 2,
      // height - detail panel - site nav
      (h - 320) / 2,
      Math.max(w - 80, 200),
      Math.max(h - 320 - 80, 200)
    ];
  } else {
    const barLeft = getElementWidth('.bar__left');
    const barRight = getElementWidth('.bar__right');
    return [
      w - barLeft - barRight,
      h,
      barLeft + (w - barLeft - barRight) / 2,
      h / 2,
      Math.max(w - 80, 200),
      Math.max(h - 80, 200)
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

    // center map in viewport excluding left & right bars
    map = D3Map(
      CountryTopoJson,
      getViewport(w, h),
      props.history.push,
      electionYear,
      province,
      isMobile() ? 1500 : 2250,
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
        map.setViewport(getViewport(innerWidth, innerHeight));
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
        <ZoneDetailTitle>{tooltips[0]}</ZoneDetailTitle>
        <ZoneDetailText ref={tooltipZoneRef}>{tooltips[1]}</ZoneDetailText>
      </div>
      <Loader>
        <BeatLoader size={25} color={'white'} loading={loading} />
      </Loader>
      <svg width={w} height={h}>
        <g id="vis" ref={visRef}>
          <defs id={`map-defs`}></defs>
          <g
            id="map"
            onMouseMove={e => {
              const offset = tooltipZoneRef.current.offsetHeight;
              const top = e.clientY - 120 - offset;

              if (top > 80) {
                setTooltipStyles({
                  top: e.clientY - 120 - offset,
                  left: e.clientX,
                  overflow: 'hidden',
                  transform: 'translate(-50%, -50%)',
                  opacity: 1
                });
              } else {
                // flip to lower position
                setTooltipStyles({
                  top: e.clientY + 0 - offset,
                  left: e.clientX,
                  overflow: 'hidden',
                  transform: 'translate(-50%, 50%)',
                  opacity: 1
                });
              }
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
