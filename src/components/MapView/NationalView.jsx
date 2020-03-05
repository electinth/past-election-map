import React, { useContext, useEffect } from 'react';
import MapContext from '../../map/context';

const NationalLeft = () => {
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    setProvince('ประเทศไทย');
  }, []);
  return <></>;
};
const NationalRight = () => {
  return (
    <>
      <h1>This is national Right</h1>
    </>
  );
};

export { NationalLeft, NationalRight };
