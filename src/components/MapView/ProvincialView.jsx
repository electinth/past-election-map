import React, { useContext, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';
import Overview from './Overview';
import partyColor from '../../map/color';
import PartyList from './PartyList';
import StackedBar from './StackedBar';

import ProvinceAreaCompare from './ProvincialViewDetail/ProvinceAreaCompare.jsx';

const ProvincialLeft = () => {
  const { province: paramProvince } = useParams();
  const { province, setProvince, electionYear, CountryTopoJson } = useContext(
    MapContext
  );
  const compareRef = useRef(null);

  useEffect(() => {
    console.log('paramProvince', paramProvince);
    setProvince(paramProvince);
  }, [paramProvince]);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const simplifyMinWeight = 1e-5;
    const CountryTopo = tps.presimplify(CountryTopoJson);
    const geo = tps.simplify(CountryTopo, simplifyMinWeight);

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
    console.log(data);
    function fill({ properties: { result, province_name } }) {
      if (!result) return 'white';
      const winner = result.reduce(function(prev, current) {
        return prev.score > current.score ? prev : current;
      });
      return province === province_name || province === 'ประเทศไทย'
        ? partyColor(electionYear)(winner.party) || 'purple' // = color not found
        : 'gainsboro';
    }
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
      .attr('fill', fill)
      .attr('stroke-width', '1')
      .attr('stroke', 'black');
  }, [compareRef, CountryTopoJson, province]);
  // return <ProvinceAreaCompare />;
  return (
    <div className="compare">
      <svg width="100%" height="60vh">
        <g className="compare-province" ref={compareRef}>
          <g className="election-2550"></g>
          <g className="election-2554"></g>
          <g className="election-2557"></g>
          <g className="election-2562"></g>
        </g>
      </svg>
    </div>
  );
};

const ProvincialRight = () => {
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);
  const [provincialProps, setProvincialProps] = useState([]);
  const [partyView, setPartyView] = useState(true);
  const numDistricts = provincialProps.length;

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    const provincialProps = CountryTopoJson.objects[electionYear].geometries
      .filter(geo => geo.properties.province_name === province)
      .map(geo => geo.properties);

    provincialProps.sort((a, b) => a.zone_id - b.zone_id);
    setProvincialProps(provincialProps);
  }, [CountryTopoJson, province, electionYear]);

  const byParty = _.groupBy(provincialProps, ({ result }) => {
    if (!result) return 'การเลือกตั้งเป็นโมฆะ';
    const winner = result.reduce(function(prev, current) {
      return prev.score > current.score ? prev : current;
    });
    return winner.party;
  });
  let byPartySorted = [];
  for (let [party, winnerResult] of Object.entries(byParty)) {
    byPartySorted.push({ party, candidate: winnerResult.length });
  }
  byPartySorted.sort((a, b) => b.candidate - a.candidate);

  return (
    <div className="provincial-view">
      <h1 className="provincial-view--header">{numDistricts} เขต</h1>
      <div className="provincial-view--toggle">
        <button
          className={`provincial-view--toggle-button ${partyView && 'active'}`}
          onClick={() => setPartyView(true)}
        >
          ดูพรรค
        </button>
        <button
          className={`provincial-view--toggle-button ${!partyView && 'active'}`}
          onClick={() => setPartyView(false)}
        >
          ดูผู้ชนะ
        </button>
        <span
          className="provincial-view--toggle-active"
          style={{ left: !partyView && '50%' }}
        ></span>
      </div>
      {partyView ? (
        <PartyList byPartySorted={byPartySorted} />
      ) : (
        <Winner provincialProps={provincialProps} />
      )}
      <Overview waffleData={byPartySorted} />
    </div>
  );
};

const Winner = ({ provincialProps }) => {
  const { electionYear } = useContext(MapContext);
  const [winners, setWinners] = useState([]);
  console.log('propdelay', electionYear, provincialProps);

  useEffect(() => {
    const districtWinners = provincialProps.map(({ zone_id, result }) => {
      if (!result)
        return {
          zone_id,
          winner: 'การเลือกตั้งเป็นโมฆะ',
          summary: {
            winner: { party: 'การเลือกตั้งเป็นโมฆะ', ratio: 0 },
            runnerUp: {
              party: 'การเลือกตั้งเป็นโมฆะ',
              ratio: 0
            },
            rest: { party: 'อื่นๆ', ratio: 0 }
          }
        };
      result.sort((a, b) => b.score - a.score);
      const [winner, runnerUp] = result;
      const totalScore = result.reduce((total, cur) => (total += cur.score), 0);
      const restScore = totalScore - winner.score - runnerUp.score;
      const summary = {
        winner: { party: winner.party, ratio: winner.score / totalScore },
        runnerUp: {
          party: runnerUp.party,
          ratio: runnerUp.score / totalScore
        },
        rest: { party: 'อื่นๆ', ratio: restScore / totalScore }
      };
      return { zone_id, winner, summary };
    });
    setWinners(districtWinners);
  }, [electionYear, provincialProps]);

  const percentageFormat = d3.format('.2%');
  return (
    <ul className="provincial-view--list">
      {winners.map(({ zone_id, winner, summary }) => (
        <li key={zone_id + electionYear} className="provincial-view--list-item">
          <div>
            {' '}
            <b>เขต {zone_id}</b>
          </div>
          <div className="provincial-view--list-item__winner">
            <span
              style={{
                display: 'inline-block',
                width: '1rem',
                height: '1rem',
                marginRight: '0.5rem',
                backgroundColor: partyColor(electionYear)(winner.party)
              }}
            ></span>
            {winner.title} {winner.first_name} {winner.last_name},{' '}
            {winner.party}, {percentageFormat(summary.winner.ratio)}
          </div>
          <StackedBar data={summary} />
        </li>
      ))}
    </ul>
  );
};

export { ProvincialLeft, ProvincialRight };
