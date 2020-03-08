import React, { useState } from 'react';
import Nav from './components/Nav';

import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CompareView from './components/CompareView';
import MapView from './components/MapView';
import MapContext from './map/context';
import CountryTopoJson from './data/thailand-election.topo.json';

const App = () => {
  const [province, setProvince] = useState('ประเทศไทย');
  return (
    <>
      <Nav />
      <MapContext.Provider value={{ province, setProvince, CountryTopoJson }}>
        <BrowserRouter>
          <main>
            <article className="detail-layer">
              <Switch>
                <Route path="/" component={MapView} />
                <Route path="/compare/:province" component={CompareView} />
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
