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
import partyColor from '../../map/color';
import peopleLogo from '../../images/people-white.svg';

const ProvincialLeft = () => {
  const { province: paramProvince } = useParams();
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    setProvince(paramProvince);
  }, [paramProvince]);
  return <ProvinceAreaCompare />;
};

const ProvincialRight = () => {
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);
  const [provincialProps, setProvincialProps] = useState([]);
  const [partyView, setPartyView] = useState(true);
  const numDistricts = provincialProps.length;
  const isNovote = electionYear === 'election-2557';

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    const provincialProps = CountryTopoJson.objects[electionYear].geometries
      .filter(geo => geo.properties.province_name === province)
      .map(geo => geo.properties);

    provincialProps.sort((a, b) => a.zone_id - b.zone_id);
    setProvincialProps(provincialProps);
  }, [CountryTopoJson, province, electionYear]);
  const numCandidate = provincialProps.reduce((acc, cur) => {
    return acc + cur.quota;
  }, 0);
  let byParty = {};
  provincialProps.map(cur => {
    if (!cur.result) {
      byParty['noresult'] = 'No vote';
      return;
    }
    cur.result
      .sort((a, b) => b.score - a.score)
      .slice(0, cur.quota)
      .map(person => {
        if (!(person.party in byParty)) {
          byParty[person.party] = [person];
        } else {
          byParty[person.party] = [...byParty[person.party], person];
        }
      });
  });

  let byPartySorted = [];
  for (let [party, winnerResult] of Object.entries(byParty)) {
    byPartySorted.push({ party, candidate: winnerResult.length });
  }
  byPartySorted.sort((a, b) => b.candidate - a.candidate);

  return (
    <div className="provincial-view">
      <h1 className="provincial-view--header">
        จำนวน {numDistricts} เขต {numCandidate} คน
      </h1>
      {isNovote ? (
        <NovoteDisplay view={'nationView'} />
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
              style={{ verticalAlign: 'center' }}
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
          <Overview waffleData={byPartySorted} view={'provinceView'} />
        </>
      )}
    </div>
  );
};

const Winner = ({ provincialProps }) => {
  const { electionYear } = useContext(MapContext);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const districtWinners = provincialProps.map(
      ({ zone_id, result, quota }) => {
        if (!result) return;
        result.sort((a, b) => b.score - a.score);
        const winnerResultArray = result
          .sort((a, b) => b.score - a.score)
          .slice(0, quota);
        const totalScore = result.reduce(
          (total, cur) => (total += cur.score),
          0
        );
        winnerResultArray.map(val => {
          val.ratio = val.score / totalScore;
        });
        return { zone_id, winnerResultArray, result, quota };
      }
    );
    setWinners(districtWinners);
  }, [electionYear, provincialProps]);

  const percentageFormat = d3.format('.2%');
  return (
    <ul className="provincial-view--list">
      {winners.map(({ zone_id, winnerResultArray, result, quota }) => (
        <li key={zone_id + electionYear} className="provincial-view--list-item">
          <div>
            {' '}
            <b className="provincial-view--list-zone">เขต {zone_id}</b>
          </div>
          {winnerResultArray.map(winner => (
            <div
              className="provincial-view--list-item__winner"
              key={winner.first_name + winner.party}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '1rem',
                  height: '1rem',
                  marginRight: '0.5rem',
                  backgroundColor: partyColor(electionYear)(winner.party)
                }}
              ></span>
              {winner.first_name} {winner.last_name}, พรรค{winner.party},{' '}
              <span style={{ fontFamily: 'Noto Sans Medium' }}>
                {percentageFormat(winner.ratio)}
              </span>
            </div>
          ))}
          <StackedBar data={result} zoneQuota={quota} />
        </li>
      ))}
    </ul>
  );
};

export { ProvincialLeft, ProvincialRight };
