import React, { useContext } from 'react';
import * as d3 from 'd3';

import './styles.scss';
import MapContext from '../../../map/context';
import partyColor from '../../../map/color';

const StackedBar = ({ data: { winner, runnerUp, rest } }) => {
  /*
  data = {
    winner: { party: 'เพื่อไทย', ratio: 60 },
    runnerUp: { party: 'ประชาธิปัตย์', ratio: 30 },
    rest: { party: 'rest', ratio: 10 }
  }
  */
  const { electionYear } = useContext(MapContext);
  const color = partyColor(electionYear);
  const percentageFormat = d3.format('.2%');
  return (
    <div className="stacked-bar">
      <div
        className="stacked-bar--bar stacked-bar--bar__winner"
        style={{
          backgroundColor: color(winner.party),
          width: `${winner.ratio * 100}%`
        }}
      >
        <span className="stacked-bar--bar__tooltiptext">
          <span
            className="stacked-bar--bar__tooltipcolor"
            style={{
              display: 'inline-block',
              backgroundColor: partyColor(electionYear)(winner.party),
              width: '1rem',
              height: '1rem',
              marginRight: '.5rem'
            }}
          ></span>
          {winner.party} {percentageFormat(winner.ratio)}
        </span>
      </div>
      <div
        className="stacked-bar--bar stacked-bar--bar__runner-up"
        style={{
          backgroundColor: 'lightgrey',
          width: `${runnerUp.ratio * 100}%`
        }}
      >
        <span className="stacked-bar--bar__tooltiptext">
          <span
            className="stacked-bar--bar__tooltipcolor"
            style={{
              display: 'inline-block',
              backgroundColor: partyColor(electionYear)(runnerUp.party),
              width: '1rem',
              height: '1rem',
              marginRight: '.5rem'
            }}
          ></span>
          {runnerUp.party} {percentageFormat(runnerUp.ratio)}
        </span>
      </div>
      <div
        className="stacked-bar--bar stacked-bar--bar__rest"
        style={{
          backgroundColor: 'var(--color-black)',
          width: `${rest.ratio * 100}%`
        }}
      >
        <span className="stacked-bar--bar__tooltiptext">
          <span
            className="stacked-bar--bar__tooltipcolor"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-black)',
              width: '1rem',
              height: '1rem',
              marginRight: '.5rem'
            }}
          ></span>
          {rest.party} {percentageFormat(rest.ratio)}
        </span>
      </div>
    </div>
  );
};

export default StackedBar;
