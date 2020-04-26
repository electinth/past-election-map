import React, { useContext } from 'react';
import './styles.scss';
import partyColor from '../../../map/color';
import MapContext from '../../../map/context';

const Overview = ({ waffleData, view }) => {
  const { electionYear } = useContext(MapContext);
  const width = view === 'nationView' ? 8 : 24;
  const height = view === 'nationView' ? 8 : 24;
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
              style={{
                backgroundColor: partyColor(electionYear)(party),
                width: width,
                height: height
              }}
            >
              <span
                className="waffle--waffle__tooltiptext"
                style={{ zIndex: '5' }}
              >
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
