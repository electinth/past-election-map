import React, { useState } from 'react';
import Nav from './components/Nav';

import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CompareView from './components/CompareView';
import MapView from './components/MapView';
import MapContext from './map/context';
import useFetch from './map/useFetch';
import AboutUs from './components/AboutUs';

const App = () => {
  console.log('APP');
  const [province, setProvince] = useState('ประเทศไทย');
  const [electionYear, setElectionYear] = useState('election-2562');
  const [CountryTopoJson] = useFetch();
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
                <Route path="/compare/:province" component={CompareView} />
                <Route path="/about-us" component={AboutUs} />
                <Route path="/:year?" component={MapView} />
              </Switch>
            </article>
            <Viz />
          </main>
        </BrowserRouter>
      </MapContext.Provider>
    </>
  );
};

export default App;
