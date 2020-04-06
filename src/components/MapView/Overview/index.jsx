import React, { useContext } from 'react';
import './styles.scss';
import partyColor from '../../../map/color';
import MapContext from '../../../map/context';

const Overview = ({ waffleData }) => {
  console.log('waffleData', waffleData);
  const { electionYear } = useContext(MapContext);
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
              style={{ backgroundColor: partyColor(electionYear)(party) }}
            >
              <span className="waffle--waffle__tooltiptext">
                <span
                  className="waffle--waffle__tooltipcolor"
                  style={{
                    display: 'inline-block',
                    backgroundColor: partyColor(electionYear)(party),
                    width: '1rem',
                    height: '1rem',
                    marginRight: '.5rem'
                  }}
                ></span>
                {party}
              </span>
            </div>
          ));
        })}
      </div>
    </div>
  );
};

export default Overview;
