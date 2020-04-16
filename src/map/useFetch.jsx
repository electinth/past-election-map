import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const useFetch = () => {
  const [response, setResponse] = useState([[]]);
  useEffect(() => {
    const fetch = async () => {
      const res = await Promise.all([
        d3.json('/thailand-election.topo.json'),
        d3.json('/zone-quota-2550.json')
      ]);

      // Append "quota" to zones for 2550
      // Other years use 1 for all
      const topoData = res[0];
      const quotaData = res[1];
      _.forEach(topoData.objects, ({ geometries }, year) => {
        geometries.forEach(({ properties }) => {
          const { province_id, zone_id } = properties;
          if (year === 'election-2550') {
            // procince_id from topo json might be a string
            const zone = _.find(quotaData, {
              province_id: +province_id,
              zone_id: +zone_id
            });
            properties.quota = _.get(zone, 'quota') || -1;
          } else {
            properties.quota = 1;
          }
        });
      });
      setResponse([topoData]);
    };

    fetch();
  }, []);

  return response;
};

export default useFetch;
