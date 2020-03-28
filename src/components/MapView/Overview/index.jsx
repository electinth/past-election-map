import React from 'react';
import './styles.scss';
import { party62 } from '../../../map/color';

const Overview = ({ waffleData }) => {
  console.log('waffleData', waffleData);
  return (
    <div className="overview">
      <h2 className="overview--header">Overview</h2>
      <div className="waffle">
        {waffleData.map(d => {
          const [party, count] = Object.values(d);
          return [...Array(count).keys()].map(i => (
            <div
              key={party + i}
              className="waffle--waffle"
              style={{ backgroundColor: party62(party) }}
            ></div>
          ));
        })}
      </div>
    </div>
  );
};

export default Overview;
