import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';

import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';
import Overview from './Overview';
import partyColor from '../../map/color';
import PartyList from './PartyList';

const ProvincialLeft = () => {
  const { province: paramProvince } = useParams();
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    console.log('paramProvince', paramProvince);
    setProvince(paramProvince);
  }, [paramProvince]);
  return (
    <>
      <h1>This is Provincial Left</h1>
    </>
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
      <h1 className="provincial-view--header">จำนวน {numDistricts} เขต</h1>
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
  const districtWinners = provincialProps.map(({ zone_id, result }) => {
    if (!result) return 'การเลือกตั้งเป็นโมฆะ';
    const winner = result.reduce(function(prev, current) {
      return prev.score > current.score ? prev : current;
    });
    return { zone_id, ...winner };
  });

  return (
    <ul className="provincial-view--list">
      {districtWinners.map(({ zone_id, ...winner }) => (
        <li key={zone_id} className="provincial-view--list-item">
          <div>
            <span
              style={{
                display: 'inline-block',
                width: '1rem',
                height: '1rem',
                marginRight: '0.5rem',
                backgroundColor: partyColor(electionYear)(winner.party)
              }}
            ></span>
            <b>เขต {zone_id}</b> {winner.party}
          </div>
          <div>
            {winner.title} {winner.first_name} {winner.last_name}
          </div>
        </li>
      ))}
    </ul>
  );
};

export { ProvincialLeft, ProvincialRight };
