import React, { useState } from 'react';
import Nav from './components/Nav';

import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import CompareView from './components/CompareView';
import MapView from './components/MapView';
import MapContext from './map/context';
import useFetch from './map/useFetch';
import AboutUs from './components/AboutUs';

const App = () => {
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
          <MetaTags>
            <title>แผนที่เขตเลือกตั้งย้อนหลังของประเทศไทย</title>
            <meta
              hid="og:title"
              property="og:title"
              content="แผนที่เขตเลือกตั้งย้อนหลังของประเทศไทย"
            />
            <meta
              hid="og:description"
              property="og:description"
              content="ย้อนดูการแบ่งเขตและผลการเลือกตั้งในอดีตของไทยได้ที่นี่"
            />

            <meta hid="og:type" property="og:type" content="website" />
            {/* <meta hid="og:url" property="og:url" content={URL} /> */}
            {/* <link
              rel="icon"
              href="https://elect.in.th/wp-content/uploads/2018/10/favicon.ico"
            /> */}
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            {/* <meta hid="og:image" property="og:image" content={URL_OR} /> */}
          </MetaTags>
          <Nav />
          <main>
            <article className="detail-layer">
              <Switch>
                <Route
                  path="/:year/compare/:province"
                  component={CompareView}
                />
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
