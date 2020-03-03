import React from 'react';
import { Bar } from './Article';
import Dropdown from './Dropdown';
import {
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { NationalLeft, NationalRight } from './NationalView';
import { ProvincialLeft, ProvincialRight } from './ProvincialView';

const MapView = props => {
  return (
    <>
      <Bar>
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
      </Bar>
      <Bar>
        <Dropdown>ประเทศไทย</Dropdown>
        <div className="bar--lower__right">
          <Switch>
            <Route path="/" exact component={NationalRight} />
            <Route path="/province/:province" component={ProvincialRight} />
          </Switch>
        </div>
      </Bar>
    </>
  );
};

export default MapView;
