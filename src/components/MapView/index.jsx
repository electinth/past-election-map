import React, { useContext, useState } from 'react';
import Dropdown from './Dropdown';
import { Route, Switch } from 'react-router-dom';
import { NationalLeft, NationalRight } from './NationalView';
import { ProvincialLeft, ProvincialRight } from './ProvincialView';
import MapContext from '../../map/context';
import MobileTopNav from './MobileTopNav';
import MobileSelectYear from './MobileSelectYear';

const MapView = () => {
  const { province } = useContext(MapContext);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  function toggleMobileDetail() {
    setShowMobileDetail(!showMobileDetail);
  }
  function hideMobileDetail() {
    setShowMobileDetail(false);
  }

  return (
    <>
      <aside className="bar bar__left">
        <div className="bar--upper__left">
          <Route
            path="/:year/:province"
            render={() => <MobileTopNav hideDetail={hideMobileDetail} />}
          />
        </div>
        <div className="bar--lower__left">
          <Switch>
            <Route path="/:year?" exact component={NationalLeft} />
            <Route path="/:year/:province" component={ProvincialLeft} />
          </Switch>
        </div>
      </aside>
      <aside className={`bar bar__right ${showMobileDetail ? "show-info" : ""}`}>
        <MobileSelectYear />
        <Dropdown>{province}</Dropdown>
        <div className="bar--lower bar--lower__right">
          <Switch>
            <Route
              path="/:year?"
              exact
              render={() => <NationalRight toggleShowDetail={toggleMobileDetail} />}
            />
            <Route
              path="/:year/:province"
              render={() => <ProvincialRight toggleShowDetail={toggleMobileDetail} />}
            />
          </Switch>
        </div>
      </aside>
    </>
  );
};

export default MapView;
