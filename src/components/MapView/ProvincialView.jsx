import React, { useContext, useEffect, useState } from 'react';
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
    <>
      <h1>จำนวน {numDistricts}</h1>
      <button>set view</button>
      <Winner provincialProps={provincialProps} />
    </>
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
    <ul>
      {districtWinners.map(({ zone_id, ...winner }) => (
        <li key={zone_id}>
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

export { ProvincialLeft, ProvincialRight };
