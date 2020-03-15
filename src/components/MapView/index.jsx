import React, { useContext } from 'react';
import Dropdown from './Dropdown';
import { Route, Switch } from 'react-router-dom';
import { NationalLeft, NationalRight } from './NationalView';
import { ProvincialLeft, ProvincialRight } from './ProvincialView';
import MapContext from '../../map/context';
import ElectionYear from './ElectionYear';

const MapView = () => {
  const { province } = useContext(MapContext);

  return (
    <>
      <aside className="bar bar__left">
        <ElectionYear />
        <div className="bar--lower__left">
          <Switch>
            <Route path="/:year" exact component={NationalLeft} />
            <Route path="/:year/:province" component={ProvincialLeft} />
          </Switch>
        </div>
      </aside>
      <aside className="bar bar__right">
        <Dropdown>{province}</Dropdown>
        <div className="bar--lower__right">
          <Switch>
            <Route path="/:year" exact component={NationalRight} />
            <Route path="/:year/:province" component={ProvincialRight} />
          </Switch>
        </div>
      </aside>
    </>
  );
};

export default MapView;
