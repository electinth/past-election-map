import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import * as d3 from 'd3';

import styled from 'styled-components';
import MapContext from '../map/context';
import partyColor from '../map/color';
import DrawMap from './MapView/ProvincialViewDetail/DrawMap';
import StackedBar from './MapView/StackedBar';

import './MapView/PartyList/styles.scss';

const Container = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f0f0f0;
  z-index: 2;
`;

const Header = styled.div`
  margin: 0 auto;
  margin-top: 26px;
  width: 364px;
`;

const ViewParty = styled.div`
  width: 100%;
  height: 800px;
  margin: 0 auto;
  margin-top: 28px;
  color: black;
`;

const PartyUL = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0 auto;
`;

const Year = styled.li`
  margin: 0 auto;
`;

const CardList = styled.div`
  width: 295px;
  height: 700px;
  text-align: center;
`;

const YearTilte = styled.h1`
  font-family: 'The MATTER';
  font-size: 3rem;
`;

const Card = styled.div`
  height: 240px;
  width: 200px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
`;

const PersonCard = styled.div`
  height: 350px;
  width: 200px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
`;

const DistricExplain = styled.h2`
  color: #484848;
  font-family: 'The MATTER';
  font-size: 1.5rem;
  text-align: left;
  line-height: 21px;
`;

const Quota = styled.h1`
  color: #484848;
  font-family: 'The MATTER';
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
  text-align: left;
  margin-top: 15px;
`;

const LineHr = styled.hr`
  margin-top: 21px;
  border: 0.5px solid #000000;
`;

const UlPartyList = styled.ul`
  list-style: none;
  max-height: 35vh;
  overflow-y: scroll;
`;

const LiPartyList = styled.li`
  font-size: 1.6rem;
  padding: 0.5rem 0;
  text-align: left;
  font-family: 'Noto Sans';
`;

const UlPersonList = styled.ul`
  list-style: none;
  height: 230px;
  overflow-y: scroll;
`;

const LiPersonList = styled.li`
  text-align: left;
  font-size: 1rem;
  font-weight: normal;
  padding: 1rem 0;
  border-bottom: 1px solid black;
`;

const CreateMap = ({ partyData }) => {
  let map;
  const width = 220,
    height = 240;
  const [tooltips, setTooltips] = useState('');
  const [tooltipsStyles, setTooltipStyles] = useState({
    left: null,
    top: null,
    opacity: 0
  });

  useEffect(() => {
    map = DrawMap(
      partyData.provinceTopoJson,
      width,
      height,
      partyData.year,
      partyData.province,
      setTooltips
    );
    const $gVis = d3.select(`#idMapVis-${partyData.year}`);
    map.setVis($gVis);
    map.render(partyData.year);
    map.setProvince(partyData.province);
  }, []);

  return (
    <div>
      <div className="tooltips" style={tooltipsStyles}>
        {tooltips}
      </div>
      <svg width={width} height={height}>
        <g id={`idMapVis-${partyData.year}`}>
          <g
            id={`map-province-${partyData.year}`}
            onMouseMove={e =>
              setTooltipStyles({
                top: e.clientY - 100,
                left: e.clientX,
                transform: 'translateX(-50%)',
                opacity: 1
              })
            }
            onMouseLeave={() =>
              setTooltipStyles({
                top: null,
                left: null,
                opacity: 0
              })
            }
          ></g>
          <g
            id={`zone-label-province-${partyData.year}`}
            style={{ pointerEvents: 'none' }}
          ></g>
          <g
            id={`border-province-${partyData.year}`}
            style={{ pointerEvents: 'none' }}
          ></g>
        </g>
      </svg>
    </div>
  );
};

const PersonList = ({ personData }) => {
  const year = [2562, 2557, 2554, 2550];
  const [winnerResult, setWinnerResult] = useState([]);
  useEffect(() => {
    personData.map(val => {
      const districtWinners = val.data.map(({ zone_id, result }) => {
        if (!result)
          return {
            zone_id,
            winner: 'การเลือกตั้งเป็นโมฆะ',
            summary: {
              winner: { party: 'การเลือกตั้งเป็นโมฆะ', ratio: 0 },
              runnerUp: {
                party: 'การเลือกตั้งเป็นโมฆะ',
                ratio: 0
              },
              rest: { party: 'อื่นๆ', ratio: 0 }
            }
          };
        result.sort((a, b) => b.score - a.score);
        const [winner, runnerUp] = result;
        const totalScore = result.reduce(
          (total, cur) => (total += cur.score),
          0
        );
        const restScore = totalScore - winner.score - runnerUp.score;
        const summary = {
          winner: { party: winner.party, ratio: winner.score / totalScore },
          runnerUp: {
            party: runnerUp.party,
            ratio: runnerUp.score / totalScore
          },
          rest: { party: 'อื่นๆ', ratio: restScore / totalScore }
        };
        return { zone_id, winner, summary };
      });
      setWinnerResult(winnerResult => [...winnerResult, districtWinners]);
    });
  }, []);

  const percentageFormat = d3.format('.2%');

  return (
    <ViewParty>
      <PartyUL>
        {year.map((year, index) => {
          return (
            <Year key={year}>
              <CardList>
                <YearTilte>ปี {year}</YearTilte>
                <CreateMap partyData={personData[index]} />
                <PersonCard>
                  <DistricExplain>
                    เขตเลือกตั้ง
                    <br />
                    จังหวัด{personData[index].province}
                  </DistricExplain>
                  <Quota>
                    {personData[index].zone} เขต / {personData[index].zone} คน
                  </Quota>
                  <LineHr />
                  <UlPersonList>
                    {winnerResult.length !== 0 ? (
                      <div>
                        {winnerResult[index].map(
                          ({ zone_id, winner, summary }) => (
                            <LiPersonList
                              key={zone_id + personData[index].year}
                            >
                              <div>
                                {' '}
                                <b style={{ fontSize: '1.2rem' }}>
                                  เขต {zone_id}
                                </b>
                              </div>
                              <div>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '1rem',
                                    height: '1rem',
                                    marginRight: '0.5rem',
                                    backgroundColor: partyColor(
                                      personData[index].year
                                    )(winner.party)
                                  }}
                                ></span>
                                {winner.title} {winner.first_name}{' '}
                                {winner.last_name}, {winner.party},{' '}
                                {percentageFormat(summary.winner.ratio)}
                              </div>
                              <StackedBar data={summary} />
                            </LiPersonList>
                          )
                        )}
                      </div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </UlPersonList>
                </PersonCard>
              </CardList>
            </Year>
          );
        })}
      </PartyUL>
    </ViewParty>
  );
};

const PartyList = ({ partyData }) => {
  const year = [2562, 2557, 2554, 2550];

  console.log(partyData);
  return (
    <ViewParty>
      <PartyUL>
        {year.map((year, index) => {
          return (
            <Year key={year}>
              <CardList>
                <YearTilte>ปี {year}</YearTilte>
                <CreateMap partyData={partyData[index]} />
                <Card>
                  <DistricExplain>
                    เขตเลือกตั้ง
                    <br />
                    จังหวัด{partyData[index].province}
                  </DistricExplain>
                  <Quota>
                    {partyData[index].zone} เขต / {partyData[index].zone} คน
                  </Quota>
                  <LineHr />
                  <UlPartyList>
                    {partyData[index].data.map(({ party, candidate }) => (
                      <LiPartyList key={party}>
                        <span
                          className="party-list--party-box"
                          style={{
                            backgroundColor: partyColor(partyData[index].year)(
                              party
                            )
                          }}
                        ></span>
                        {party}{' '}
                        <span className="party-list--count">
                          {candidate} คน
                        </span>
                      </LiPartyList>
                    ))}
                  </UlPartyList>
                </Card>
              </CardList>
            </Year>
          );
        })}
      </PartyUL>
    </ViewParty>
  );
};

const CompareView = () => {
  const [partyView, setPartyView] = useState(true);
  const { CountryTopoJson } = useContext(MapContext);
  const { province: paramProvince } = useParams();
  let partyData, personData;

  if (CountryTopoJson.length !== 0) {
    const electionYear = [
      'election-2562',
      'election-2557',
      'election-2554',
      'election-2550'
    ];
    let provincialZone = [];
    let byParty = [];
    let byPartySorted = [];
    let byPersonSorted = [];
    let provinceTopoJsonData = [];

    electionYear.map(val => {
      let currentProvince = CountryTopoJson.objects[val].geometries
        .filter(geo => geo.properties.province_name === paramProvince)
        .map(geo => geo.properties);
      currentProvince.sort((a, b) => a.zone_id - b.zone_id);
      provincialZone.push(currentProvince);
      byPersonSorted.push({
        data: currentProvince
      });
    });

    provincialZone.map(val => {
      let currentByParty = _.groupBy(val, ({ result }) => {
        if (!result) return 'การเลือกตั้งเป็นโมฆะ';
        const winner = result.reduce(function(prev, current) {
          return prev.score > current.score ? prev : current;
        });
        return winner.party;
      });
      byParty.push(currentByParty);
    });

    byParty.map(val => {
      let currentByPartySorted = [];
      for (let [party, winnerResult] of Object.entries(val)) {
        currentByPartySorted.push({ party, candidate: winnerResult.length });
      }
      currentByPartySorted.sort((a, b) => b.candidate - a.candidate);
      byPartySorted.push({
        data: currentByPartySorted
      });
    });

    electionYear.map(year => {
      const ProviceGeomatires = CountryTopoJson.objects[year].geometries.filter(
        val => {
          return val.properties.province_name === paramProvince;
        }
      );

      let ProvinceTopoJson = JSON.parse(JSON.stringify(CountryTopoJson));

      const allowed = [year];

      const ProvinceTopoJsonFilter = Object.keys(ProvinceTopoJson.objects)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = ProvinceTopoJson.objects[key];
          return obj;
        }, {});

      ProvinceTopoJson.objects = ProvinceTopoJsonFilter;
      ProvinceTopoJson.objects[year].geometries = ProviceGeomatires;
      provinceTopoJsonData.push(ProvinceTopoJson);
    });
    electionYear.forEach((year, index) => {
      byPartySorted[index].year = year;
      byPartySorted[index].province = paramProvince;
      byPartySorted[index].zone = provincialZone[index].length;
      byPartySorted[index].provinceTopoJson = provinceTopoJsonData[index];
      byPersonSorted[index].year = year;
      byPersonSorted[index].province = paramProvince;
      byPersonSorted[index].zone = provincialZone[index].length;
      byPersonSorted[index].provinceTopoJson = provinceTopoJsonData[index];
    });
    partyData = byPartySorted;
    personData = byPersonSorted;
  }

  useEffect(() => {}, []);

  return (
    <Container>
      <Header>
        <div className="provincial-view--toggle">
          <button
            className={`provincial-view--toggle-button ${partyView &&
              'active'}`}
            onClick={() => setPartyView(true)}
          >
            ดูพรรค
          </button>
          <button
            className={`provincial-view--toggle-button ${!partyView &&
              'active'}`}
            onClick={() => setPartyView(false)}
          >
            ดูผู้ชนะ
          </button>
          <span
            className="provincial-view--toggle-active"
            style={{ left: !partyView && '50%' }}
          ></span>
        </div>
      </Header>
      {!partyData ? (
        <div>Loading...</div>
      ) : partyView ? (
        <PartyList partyData={partyData} />
      ) : (
        <PersonList personData={personData} />
      )}
    </Container>
  );
};

export default CompareView;
