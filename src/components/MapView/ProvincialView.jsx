import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';

import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';

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
    console.log('Provincial');
    const provincialProps = CountryTopoJson.objects[electionYear].geometries
      .filter(geo => geo.properties.province_name === province)
      .map(geo => geo.properties);

    console.log(provincialProps);
    provincialProps.sort((a, b) => a.zone_id - b.zone_id);
    setProvincialProps(provincialProps);
  }, [CountryTopoJson, province, electionYear]);

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
        <Party provincialProps={provincialProps} />
      ) : (
        <Winner provincialProps={provincialProps} />
      )}
    </div>
  );
};

const Winner = ({ provincialProps }) => {
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
            เขต {zone_id}: {winner.party}
          </div>
          <div>
            {winner.title} {winner.first_name} {winner.last_name}
          </div>
        </li>
      ))}
    </ul>
  );
};

const Party = ({ provincialProps }) => {
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
  console.log(byPartySorted);
  return (
    <ul className="provincial-view--list">
      {byPartySorted.map(({ party, candidate }) => (
        <li key={party} className="provincial-view--list-item">
          {party}: {candidate}
        </li>
      ))}
    </ul>
  );
};

export { ProvincialLeft, ProvincialRight };
