import CountryTopoJson from '../../data/thailand-election.topo.json';
import { useState, useEffect } from 'react';

const useMap = () => {
  const [province, setProvince] = useState();

  useEffect(() => {
    // Zoom when province change
  }, [province]);

  return { CountryTopoJson, setProvince };
};
