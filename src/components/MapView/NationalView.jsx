import React, { useContext, useEffect } from 'react';
import MapContext from '../../map/context';

const NationalLeft = () => {
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    setProvince('ประเทศไทย');
  }, []);
  return (
    <>
      <h1>This is national Left</h1>
    </>
  );
};
const NationalRight = () => {
  return (
    <>
      <h1>This is national Right</h1>
    </>
  );
};

export { NationalLeft, NationalRight };
