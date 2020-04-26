import React, { useContext } from 'react';
import * as d3 from 'd3';

import './styles.scss';
import MapContext from '../../../map/context';
import partyColor from '../../../map/color';

const StackedBar = ({ data, zoneQuota, year }) => {
  /*
  data = {
    winner: { party: 'เพื่อไทย', ratio: 60 },
    runnerUp: { party: 'ประชาธิปัตย์', ratio: 30 },
    rest: { party: 'rest', ratio: 10 }
  }
  */
  const { electionYear } = useContext(MapContext);
  const percentageFormat = d3.format('.2%');
  const color = partyColor(year);

  //More Quota
  if (zoneQuota != 1) {
    let summary = [];
    const totalScore = data.reduce((total, cur) => (total += cur.score), 0);
    for (let index = 0; index < zoneQuota; index++) {
      summary.push({
        party: data[index].party,
        ratio: data[index].score / totalScore
      });
    }
    summary.push({
      party: 'อื่นๆ',
      ratio: 1 - summary.reduce((acc, cur) => acc + cur.ratio, 0)
    });

    return (
      <ul className="stacked-bar">
        {summary.map(winner => (
          <li
            className="stacked-bar--bar "
            style={{
              backgroundColor: color(winner.party),
              width: `${winner.ratio * 100}%`
            }}
            key={winner.party + winner.ratio}
          >
            <span className="stacked-bar--bar__tooltiptext">
              <span
                className="stacked-bar--bar__tooltipcolor"
                style={{
                  display: 'inline-block',
                  backgroundColor: partyColor(year)(winner.party),
                  width: '1rem',
                  height: '1rem',
                  marginRight: '.5rem'
                }}
              ></span>
              {winner.party}{' '}
              <span style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}>
                {percentageFormat(winner.ratio)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    );

    //Only one quota
  } else {
    const totalScore = data.reduce((total, cur) => (total += cur.score), 0);
    const winner = {
      party: data[0].party,
      ratio: data[0].score / totalScore
    };
    const runnerUp = {
      party: data[1].party,
      ratio: data[1].score / totalScore
    };
    const rest = {
      party: 'อื่นๆ',
      ratio: 1 - winner.ratio - runnerUp.ratio
    };

    return (
      <ul className="stacked-bar">
        <li
          className="stacked-bar--bar "
          style={{
            backgroundColor: color(winner.party),
            width: `${winner.ratio * 100}%`
          }}
          key={winner.party + winner.ratio}
        >
          <span className="stacked-bar--bar__tooltiptext">
            <span
              className="stacked-bar--bar__tooltipcolor"
              style={{
                display: 'inline-block',
                backgroundColor: partyColor(year)(winner.party),
                width: '1rem',
                height: '1rem',
                marginRight: '.5rem'
              }}
            ></span>
            {winner.party}{' '}
            <span style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}>
              {percentageFormat(winner.ratio)}
            </span>
          </span>
        </li>
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
                backgroundColor: partyColor(year)(runnerUp.party),
                width: '1rem',
                height: '1rem',
                marginRight: '.5rem'
              }}
            ></span>
            {runnerUp.party}{' '}
            <span style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}>
              {percentageFormat(runnerUp.ratio)}
            </span>
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
            {rest.party}{' '}
            <span style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}>
              {percentageFormat(rest.ratio)}
            </span>
          </span>
        </div>
      </ul>
    );
  }
};

export default StackedBar;
