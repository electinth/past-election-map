import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';

import ProvinceAllCompare from './ProvincialViewDetail/ProvinceAllCompare.jsx';

const ProvincialLeft = () => {
  const { province: paramProvince, year: paramYear } = useParams();
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    console.log('paramProvince', paramProvince);
    setProvince(paramProvince);
  }, [paramProvince]);
  return <ProvinceAllCompare />;
};
const ProvincialRight = () => {
  return (
    <>
      <h1>This is Provincial Right</h1>
    </>
  );
};

export { ProvincialLeft, ProvincialRight };
