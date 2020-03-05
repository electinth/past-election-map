import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';

const ProvincialLeft = () => {
  const { province: paramProvince } = useParams();
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    setProvince(paramProvince);
  }, [paramProvince]);
  return (
    <>
      <h1>This is Provincial Left</h1>
    </>
  );
};
const ProvincialRight = () => {
  return (
    <>
      <h1>This is Provincial Right</h1>
    </>
  );
};

export { ProvincialLeft, ProvincialRight };
