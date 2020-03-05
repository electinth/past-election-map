import React, { useContext } from 'react';
import Dropdown from './Dropdown';
import { Route, Switch } from 'react-router-dom';
import { NationalLeft, NationalRight } from './NationalView';
import { ProvincialLeft, ProvincialRight } from './ProvincialView';
import MapContext from '../map/context';

const MapView = props => {
  const { province } = useContext(MapContext);

  return (
    <>
      <div className="bar bar__left">
        <ul>
          <li>2554</li>
          <li>2557</li>
          <li>2562</li>
        </ul>
        <div className="bar--lower__left">
          <Switch>
            <Route path="/" exact component={NationalLeft} />
            <Route path="/province/:province" component={ProvincialLeft} />
          </Switch>
        </div>
      </div>
      <div className="bar bar__right">
        <Dropdown>{province}</Dropdown>
        <div className="bar--lower__right">
          <Switch>
            <Route path="/" exact component={NationalRight} />
            <Route path="/province/:province" component={ProvincialRight} />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default MapView;
