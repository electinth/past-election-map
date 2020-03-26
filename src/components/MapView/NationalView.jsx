import React, { useContext, useEffect, useState } from 'react';
import MapContext from '../../map/context';
import _ from 'lodash';

const NationalLeft = () => {
  return <></>;
};
const NationalRight = () => {
  const { setProvince, CountryTopoJson, electionYear } = useContext(MapContext);
  const [nationalProps, setNationalProps] = useState([]);
  console.log('national view');
  console.log(electionYear);

  useEffect(() => {
    setProvince('ประเทศไทย');
  }, []);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const nationalProps = CountryTopoJson.objects[electionYear].geometries.map(
      geo => geo.properties
    );
    console.log(nationalProps);
    setNationalProps(nationalProps);
  }, [CountryTopoJson, electionYear]);

  const numCandidate = nationalProps.length;
  const byParty = _.groupBy(nationalProps, ({ result }) => {
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
    <div className="national-view">
      <h1 className="national-view--header">จำนวน {numCandidate} เขต</h1>
      <ul className="national-view--candidate-list">
        {byPartySorted.map(({ party, candidate }) => (
          <li key={party} className="national-view--candidate-list-item">
            {party}: {candidate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { NationalLeft, NationalRight };
