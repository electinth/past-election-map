import { useState, useEffect } from 'react';
import * as d3 from 'd3';

const useFetch = () => {
  const [response, setResponse] = useState([
    []
    // {
    //   type: 'Topology',
    //   arcs: [
    //     /* ... */
    //   ],
    //   objects: {
    //     'eleciton-2562': {
    //       /* ... */
    //     },
    //     'eleciton-2557': {
    //       /* ... */
    //     },
    //     'eleciton-2554': {
    //       /* ... */
    //     },
    //     'eleciton-2550': {}
    //   }
    // }
  ]);

  useEffect(() => {
    const fetch = async () => {
      const res = await Promise.all([d3.json('./thailand-election.topo.json')]);
      setResponse(res);
    };

    fetch();
  }, []);

  return response;
};

export default useFetch;
