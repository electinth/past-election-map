import React, { useState } from 'react';
import Nav from './components/Nav';
import GlobalStyles from './styles/GlobalStyles';
import GlobalFont from './styles/fonts';
import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CompareView from './components/CompareView';
import { Article } from './components/Article';
import MapView from './components/MapView';
import MapContext from './map/context';

const App = () => {
  const [province, setProvince] = useState('ประเทศไทย');
  return (
    <>
      <GlobalStyles />
      <GlobalFont />
      <Nav />
      <MapContext.Provider value={{ province, setProvince }}>
        <BrowserRouter>
          <main>
            <Article>
              <Switch>
                <Route path="/" component={MapView} />
                <Route path="/compare/:province" component={CompareView} />
              </Switch>
            </Article>
            <Viz />
          </main>
        </BrowserRouter>
      </MapContext.Provider>
    </>
  );
};

export default App;
