import React, { useContext, useEffect, useState } from 'react';
import MapContext from '../../map/context';

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
  }, [CountryTopoJson]);

  const numCandidate = nationalProps.length;

  return (
    <>
      <h1>จำนวน {numCandidate} เขต</h1>
    </>
  );
};

export { NationalLeft, NationalRight };
