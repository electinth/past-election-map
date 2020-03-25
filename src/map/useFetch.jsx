import { useState, useEffect } from 'react';
import * as d3 from 'd3';

const useFetch = () => {
  const [response, setResponse] = useState([[], {}]);

  useEffect(() => {
    const fetch = async () => {
      const [topojson, res48, res50, res54, res62] = await Promise.all([
        d3.json('/thailand-election.topo.json'),
        d3.csv('/candidate_result_2548.csv'),
        d3.csv('/candidate_result_2550.csv'),
        d3.csv('/candidate_result_2554.csv'),
        d3.csv('/candidate_result_2562.csv')
      ]);
      setResponse([
        topojson,
        {
          'election-2548': res48,
          'election-2550': res50,
          'election-2554': res54,
          'election-2562': res62
        }
      ]);
    };

    fetch();
  }, []);

  return response;
};

export default useFetch;
