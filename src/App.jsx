import React, { useState } from 'react';
import Nav from './components/Nav';

import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CompareView from './components/CompareView';
import MapView from './components/MapView';
import MapContext from './map/context';
// import CountryTopoJson from './data/thailand-election.topo.json';
import useFetch from './map/useFetch';
import AboutUs from './components/AboutUs';

const App = () => {
  console.log('APP');
  const [province, setProvince] = useState('ประเทศไทย');
  const [electionYear, setElectionYear] = useState('election-2562');
  const [CountryTopoJson] = useFetch();
  console.log(CountryTopoJson);
  return (
    <>
      <MapContext.Provider
        value={{
          electionYear,
          setElectionYear,
          province,
          setProvince,
          CountryTopoJson
        }}
      >
        <BrowserRouter>
          <Nav />
          <main>
            <article className="detail-layer">
              <Switch>
                <Route path="/about-us" component={AboutUs} />
                <Route path="/:year?" component={MapView} />
                <Route path="/compare/:province" component={CompareView} />
              </Switch>
            </article>
            {/* <Viz /> */}
          </main>
        </BrowserRouter>
      </MapContext.Provider>
    </>
  );
};

export default App;
