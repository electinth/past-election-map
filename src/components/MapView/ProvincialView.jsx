import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';

import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';
import Overview from './Overview';
import PartyList from './PartyList';
import StackedBar from './StackedBar';

import { NovoteDisplay } from './NationalView';
import ProvinceAreaCompare from './ProvincialViewDetail/ProvinceAreaCompare.jsx';

const ProvincialLeft = () => {
  const { province: paramProvince } = useParams();
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    console.log('paramProvince', paramProvince);
    setProvince(paramProvince);
  }, [paramProvince]);
  return <ProvinceAreaCompare />;
};

const ProvincialRight = () => {
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);
  const [provincialProps, setProvincialProps] = useState([]);
  const [partyView, setPartyView] = useState(true);
  const numDistricts = provincialProps.length;
  let isNovote;
  console.log('ProvincialRight');
  console.log(electionYear);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    const provincialProps = CountryTopoJson.objects[electionYear].geometries
      .filter(geo => geo.properties.province_name === province)
      .map(geo => geo.properties);

    provincialProps.sort((a, b) => a.zone_id - b.zone_id);
    setProvincialProps(provincialProps);
  }, [CountryTopoJson, province, electionYear]);

  const byParty = _.groupBy(provincialProps, ({ result }) => {
    if (!result) {
      isNovote = true;
      return 'การเลือกตั้งเป็นโมฆะ';
    }
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
      <h1 className="provincial-view--header">
        จำนวน {numDistricts} เขต {numDistricts} คน
      </h1>
      {isNovote ? (
        <NovoteDisplay />
      ) : (
        <>
          <div className="provincial-view--toggle">
            <button
              className={`provincial-view--toggle-button ${partyView &&
                'active'}`}
              onClick={() => setPartyView(true)}
            >
              ดูพรรค
            </button>
            <button
              className={`provincial-view--toggle-button ${!partyView &&
                'active'}`}
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
        </>
      )}
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
