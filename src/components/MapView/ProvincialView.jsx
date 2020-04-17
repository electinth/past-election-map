import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';

import { useParams } from 'react-router-dom';
import MapContext from '../../map/context';
import Overview from './Overview';
import PartyList from './PartyList';
import StackedBar from './StackedBar';

import { NovoteDisplay } from './NationalView';
import ProvinceAreaCompare from './ProvincialViewDetail/ProvinceAreaCompare.jsx';
import partyColor from '../../map/color';

const ProvincialLeft = () => {
  const { province: paramProvince } = useParams();
  const { setProvince } = useContext(MapContext);

  useEffect(() => {
    setProvince(paramProvince);
  }, [paramProvince]);
  return <ProvinceAreaCompare />;
};

const ProvincialRight = () => {
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);
  const [provincialProps, setProvincialProps] = useState([]);
  const [partyView, setPartyView] = useState(true);
  const numDistricts = provincialProps.length;
  const isNovote = electionYear === 'election-2557';

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    const provincialProps = CountryTopoJson.objects[electionYear].geometries
      .filter(geo => geo.properties.province_name === province)
      .map(geo => geo.properties);

    provincialProps.sort((a, b) => a.zone_id - b.zone_id);
    setProvincialProps(provincialProps);
  }, [CountryTopoJson, province, electionYear]);
  const numCandidate = provincialProps.reduce((acc, cur) => {
    return acc + cur.quota;
  }, 0);
  let byParty = {};
  provincialProps.map(cur => {
    if (!cur.result) {
      byParty['noresult'] = 'No vote';
      return;
    }
    cur.result
      .sort((a, b) => b.score - a.score)
      .slice(0, cur.quota)
      .map(person => {
        if (!(person.party in byParty)) {
          byParty[person.party] = [person];
        } else {
          byParty[person.party] = [...byParty[person.party], person];
        }
      });
  });

  let byPartySorted = [];
  for (let [party, winnerResult] of Object.entries(byParty)) {
    byPartySorted.push({ party, candidate: winnerResult.length });
  }
  byPartySorted.sort((a, b) => b.candidate - a.candidate);

  return (
    <div className="provincial-view">
      <h1 className="provincial-view--header">
        จำนวน {numDistricts} เขต {numCandidate} คน
      </h1>
      {isNovote ? (
        <NovoteDisplay view={'nationView'} />
      ) : (
        <>
          <div className="provincial-view--toggle">
            <div
              className={`provincial-view--toggle-button ${partyView &&
                'active'}`}
              onClick={() => setPartyView(true)}
            >
              <div>
                <SeePartyMenu partyView={partyView} view={'provinceView'} />
              </div>
            </div>
            <div
              className={`provincial-view--toggle-button ${!partyView &&
                'active'}`}
              style={{ verticalAlign: 'center' }}
              onClick={() => setPartyView(false)}
            >
              <SeeWinnerMenu partyView={partyView} view={'provinceView'} />
            </div>
            <span
              className="provincial-view--toggle-active"
              style={{ left: !partyView && '50%' }}
            ></span>
          </div>
          {partyView ? (
            <PartyList byPartySorted={byPartySorted} />
          ) : (
            <Winner provincialProps={provincialProps} />
          )}
          <Overview waffleData={byPartySorted} view={'provinceView'} />
        </>
      )}
    </div>
  );
};

const Winner = ({ provincialProps }) => {
  const { electionYear } = useContext(MapContext);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    console.log('effect');
    console.log(provincialProps);
    const districtWinners = provincialProps.map(
      ({ zone_id, result, quota }) => {
        if (!result) {
          return;
        }
        result.sort((a, b) => b.score - a.score);
        const winnerResultArray = result
          .sort((a, b) => b.score - a.score)
          .slice(0, quota);
        const totalScore = result.reduce(
          (total, cur) => (total += cur.score),
          0
        );
        winnerResultArray.map(val => {
          val.ratio = val.score / totalScore;
        });
        return {
          zone_id,
          winnerResultArray,
          result,
          quota,
          year: electionYear
        };
      }
    );
    setWinners(districtWinners);
  }, [electionYear, provincialProps]);

  console.log(winners);

  const percentageFormat = d3.format('.2%');
  return (
    <ul className="provincial-view--list">
      {!winners[0] ? (
        <div></div>
      ) : (
        winners.map(({ zone_id, winnerResultArray, result, quota, year }) => (
          <li key={zone_id + year} className="provincial-view--list-item">
            <div>
              {' '}
              <b className="provincial-view--list-zone">เขต {zone_id}</b>
            </div>
            {winnerResultArray.map(winner => (
              <div
                className="provincial-view--list-item__winner"
                key={winner.first_name + winner.party}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '1rem',
                    height: '1rem',
                    marginRight: '0.5rem',
                    backgroundColor: partyColor(year)(winner.party)
                  }}
                ></span>
                {winner.first_name} {winner.last_name}, พรรค{winner.party},{' '}
                <span style={{ fontFamily: 'Noto Sans Medium' }}>
                  {percentageFormat(winner.ratio)}
                </span>
              </div>
            ))}
            <StackedBar data={result} zoneQuota={quota} year={year} />
          </li>
        ))
      )}
    </ul>
  );
};

const SeePartyMenu = ({ partyView, view }) => {
  const color = partyView ? 'black' : 'white';
  const width = view === 'provinceView' ? '18px' : '26px';
  const height = view === 'provinceView' ? '13px' : '29px';
  const fontSize = view === 'provinceView' ? '1.8rem' : '3rem';
  const bottom = view === 'provinceView' ? '3px' : '5px';
  const style =
    view === 'provinceView'
      ? {
          marginRight: '5px',
          marginLeft: '10px',
          verticalAlign: 'middle'
        }
      : {
          marginRight: '16px',
          marginLeft: '10px',
          verticalAlign: 'middle'
        };
  return (
    <div style={{ fontSize: fontSize, position: 'absolute', bottom: bottom }}>
      <svg width={width} height={height} viewBox="0 0 18 13" style={style}>
        <title>Group 8</title>
        <desc>Created with Sketch.</desc>
        <g
          id="Symbols"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="master/icon/white/party" fill={color}>
            <g id="Group-8">
              <circle id="Oval" cx="1.5" cy="1.5" r="1.5"></circle>
              <circle id="Oval-Copy" cx="1.5" cy="6.5" r="1.5"></circle>
              <circle id="Oval-Copy-2" cx="1.5" cy="11.5" r="1.5"></circle>
              <rect id="Rectangle" x="4" y="0.5" width="14" height="2"></rect>
              <rect
                id="Rectangle-Copy-2"
                x="4"
                y="5.5"
                width="14"
                height="2"
              ></rect>
              <rect
                id="Rectangle-Copy-3"
                x="4"
                y="10.5"
                width="14"
                height="2"
              ></rect>
            </g>
          </g>
        </g>
      </svg>
      ดูพรรค
    </div>
  );
};

const SeeWinnerMenu = ({ partyView, view }) => {
  const colorFill = partyView ? 'black' : 'white';
  const colorStroke = partyView ? 'white' : 'black';
  const width = view === 'provinceView' ? '17px' : '23px';
  const height = view === 'provinceView' ? '17px' : '23px';
  const fontSize = view === 'provinceView' ? '1.8rem' : '3rem';
  const bottom = view === 'provinceView' ? '3px' : '5px';
  const style =
    view === 'provinceView'
      ? {
          marginRight: '5px',
          marginLeft: '10px',
          verticalAlign: 'middle'
        }
      : {
          marginRight: '16px',
          marginLeft: '10px',
          verticalAlign: 'middle'
        };
  return (
    <div
      style={{
        fontSize: fontSize,
        position: 'absolute',
        bottom: bottom
      }}
    >
      <svg width={width} height={height} viewBox="0 0 17 17" style={style}>
        <g
          id="Desktop-Design"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="By-Province-Zoom"
            transform="translate(-1202.000000, -267.000000)"
            fill={colorFill}
            stroke={colorStroke}
          >
            <g id="Group-11" transform="translate(1046.000000, 200.000000)">
              <g id="Group-10" transform="translate(17.000000, 57.000000)">
                <g
                  id="master/icon/white/people"
                  transform="translate(140.000000, 11.000000)"
                >
                  <g id="master/icon/people">
                    <g id="Group-16" style={{ marginTop: '10px' }}>
                      <path
                        d="M9.32539434,6.66666667 C8.86522752,6.66666667 8.49134199,6.29421915 8.49134199,5.83405234 C8.49134199,5.37388553 8.86522752,5 9.32539434,5 C9.78556115,5 10.1580087,5.37388553 10.1580087,5.83405234 C10.1580087,6.29421915 9.78556115,6.66666667 9.32539434,6.66666667 L9.32539434,6.66666667 Z M5.99134199,6.66666667 C5.53157188,6.66666667 5.15800866,6.29421915 5.15800866,5.83405234 C5.15800866,5.37388553 5.53157188,5 5.99134199,5 C6.45111211,5 6.82467532,5.37388553 6.82467532,5.83405234 C6.82467532,6.29421915 6.45111211,6.66666667 5.99134199,6.66666667 L5.99134199,6.66666667 Z M15.1580087,6.42081088 L14.0546519,6.42081088 C13.5999508,2.7970144 10.9089934,0 7.65800866,0 C4.40830837,0 1.71735101,2.7970144 1.26264986,6.42081088 L0.158008658,6.42081088 L0.158008658,8.57786415 L1.26264986,8.57786415 C1.71735101,12.2029856 4.40830837,15 7.65800866,15 C10.9089934,15 13.5999508,12.2029856 14.0546519,8.57786415 L15.1580087,8.57786415 L15.1580087,6.42081088 Z"
                        id="Fill-22-Copy"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      ดูส.ส.เขต
    </div>
  );
};

export { ProvincialLeft, ProvincialRight, SeePartyMenu, SeeWinnerMenu };
