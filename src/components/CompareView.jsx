import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import * as d3 from 'd3';

import styled from 'styled-components';
import MapContext from '../map/context';
import partyColor from '../map/color';

import StackedBar from './MapView/StackedBar';
import { NovoteDisplay } from './MapView/NationalView';
import { SeePartyMenu, SeeWinnerMenu } from './MapView/ProvincialView';
import D3Compare from './MapView/ProvincialViewDetail/D3Compare';

const Container = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  // min-height: 100%;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f0f0f0;
  z-index: 2;
  overflow: scroll;
`;

const Header = styled.div`
  margin: 0 auto;
  margin-top: 26px;
  width: 378px;
  height: 50px;
`;

const ViewParty = styled.div`
  width: 100%;
  // height: 800px;
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
  padding-bottom: 50px;
  &:not(:last-child) {
  }
`;

const CardList = styled.div`
  width: 295px;
  // height: 700px;
  text-align: center;
`;

const YearTilte = styled.h1`
  font-family: 'The MATTER';
  font-size: 3rem;
`;

const PartyCardContainer = styled.div`
  min-height: 240px;
  width: 200px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
`;

const PersonCardContainer = styled.div`
  min-height: 240px;
  width: 200px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;
  position: relative;
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

let maps;

const marginTop = 0,
  marginBottom = 0,
  marginLeft = 25,
  marginRight = 25;
const w = 300 - marginLeft - marginRight,
  h = 300 - marginTop - marginBottom;
const dimension = {
  w,
  h,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight
};
const YearList = ({ view = 'party', party = [], person = [] }) => {
  const { province, CountryTopoJson } = useContext(MapContext);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const $compare = d3.selectAll('svg[id*=compare-election-]');
    const $defs = d3.select(`#map-defs-compare`);
    maps = D3Compare(CountryTopoJson, $compare, $defs, dimension, 15000);
  }, [CountryTopoJson]);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    maps.handleProvinceChange(province);
  }, [CountryTopoJson, province]);

  const year = [2562, 2557, 2554, 2550];

  return (
    <ViewParty>
      <PartyUL>
        {year.map((year, index) => {
          return (
            <Year key={year}>
              <CardList>
                <YearTilte>ปี {year}</YearTilte>
                <svg
                  id={`compare-election-${year}`}
                  data-election-year={`election-${year}`}
                  width={
                    dimension.w + dimension.marginLeft + dimension.marginRight
                  }
                  height={
                    dimension.h + dimension.marginTop + dimension.marginBottom
                  }
                >
                  {year === 2550 && <defs id={`map-defs-compare`}></defs>}
                </svg>
                {view === 'party' ? (
                  <PartyCard data={party[index]} />
                ) : (
                  <PersonCard data={person[index]} />
                )}
              </CardList>
            </Year>
          );
        })}
      </PartyUL>
    </ViewParty>
  );
};

const TitleZone = ({ province, zone, numCandidateByZone }) => {
  return (
    <div>
      <DistricExplain>
        เขตเลือกตั้ง
        <br />
        จังหวัด{province}
      </DistricExplain>
      <Quota>
        {zone} เขต / {numCandidateByZone} คน
      </Quota>
    </div>
  );
};

const PartyCard = ({ data = {} }) => {
  console.log('partyCard');
  console.log(data.data);
  console.log(data.year);
  const isNovote = data.year === 'election-2557';
  const numCandidateByZone = data.data.reduce(
    (acc, val) => acc + val.candidate,
    0
  );
  return (
    <PartyCardContainer>
      <TitleZone
        province={data.province}
        zone={data.zone}
        numCandidateByZone={numCandidateByZone}
      />
      <LineHr />
      {isNovote ? (
        <NovoteDisplay view={'compareView'} />
      ) : (
        <UlPartyList>
          {data.data.map(({ party, candidate }) => (
            <LiPartyList key={party}>
              <span
                className="party-list--party-box"
                style={{
                  backgroundColor: partyColor(data.year)(party)
                }}
              ></span>
              {party} <span className="party-list--count">{candidate} คน</span>
            </LiPartyList>
          ))}
        </UlPartyList>
      )}
    </PartyCardContainer>
  );
};

const PersonCard = ({ data = {} }) => {
  const isNovote = data.year === 'election-2557';
  const numCandidateByZone = data.data.reduce((acc, val) => acc + val.quota, 0);
  const districtWinners = data.data.map(({ zone_id, result, quota }) => {
    if (!result) return;
    result.sort((a, b) => b.score - a.score);
    const winnerResultArray = result
      .sort((a, b) => b.score - a.score)
      .slice(0, quota);
    const totalScore = result.reduce((total, cur) => (total += cur.score), 0);
    winnerResultArray.map(val => {
      val.ratio = val.score / totalScore;
    });
    return { zone_id, winnerResultArray, result, quota, year: data.year };
  });

  const percentageFormat = d3.format('.2%');

  return (
    <PersonCardContainer>
      <TitleZone
        province={data.province}
        zone={data.zone}
        numCandidateByZone={numCandidateByZone}
      />
      <LineHr />
      {isNovote ? (
        <NovoteDisplay view={'compareView'} />
      ) : (
        <ul className="provincial-view--list">
          {districtWinners.map(
            ({ zone_id, winnerResultArray, result, quota, year }) => (
              <li
                key={zone_id + data.year}
                className="provincial-view--list-item"
              >
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
                        backgroundColor: partyColor(data.year)(winner.party)
                      }}
                    ></span>
                    {winner.title} {winner.first_name} {winner.last_name},{' '}
                    {winner.party}, {percentageFormat(winner.ratio)}
                  </div>
                ))}
                <StackedBar data={result} zoneQuota={quota} year={year} />
              </li>
            )
          )}
        </ul>
      )}
    </PersonCardContainer>
  );
};

const CompareView = () => {
  const [partyView, setPartyView] = useState(true);
  const { CountryTopoJson, setProvince } = useContext(MapContext);
  const { province: paramProvince } = useParams();

  useEffect(() => {
    setProvince(paramProvince);
  }, [paramProvince]);
  let partyData, personData;

  if (CountryTopoJson.length !== 0) {
    const electionYear = [
      'election-2550',
      'election-2554',
      'election-2557',
      'election-2562'
    ];
    let provincialZone = [];
    let byParty = [];
    let byPartySorted = [];
    let byPersonSorted = [];

    electionYear.forEach(val => {
      let currentProvince = CountryTopoJson.objects[val].geometries
        .filter(geo => geo.properties.province_name === paramProvince)
        .map(geo => geo.properties);
      currentProvince.sort((a, b) => a.zone_id - b.zone_id);
      provincialZone.push(currentProvince);
      byPersonSorted.push({
        data: currentProvince
      });
    });

    provincialZone.forEach(val => {
      let currentByParty = {};
      val.forEach(cur => {
        if (!cur.result) {
          if (!('noresult' in currentByParty)) {
            currentByParty['noresult'] = ['novote'];
          } else {
            currentByParty['noresult'] = [
              ...currentByParty['noresult'],
              'novote'
            ];
          }
          return;
        }
        cur.result
          .sort((a, b) => b.score - a.score)
          .slice(0, cur.quota)
          .forEach(person => {
            if (!(person.party in currentByParty)) {
              currentByParty[person.party] = [person];
            } else {
              currentByParty[person.party] = [
                ...currentByParty[person.party],
                person
              ];
            }
          });
      });
      byParty.push(currentByParty);
    });

    byParty.forEach(val => {
      let currentByPartySorted = [];
      for (let [party, winnerResult] of Object.entries(val)) {
        currentByPartySorted.push({ party, candidate: winnerResult.length });
      }
      currentByPartySorted.sort((a, b) => b.candidate - a.candidate);
      byPartySorted.push({
        data: currentByPartySorted
      });
    });

    electionYear.forEach((year, index) => {
      byPartySorted[index].year = year;
      byPartySorted[index].province = paramProvince;
      byPartySorted[index].zone = provincialZone[index].length;

      byPersonSorted[index].year = year;
      byPersonSorted[index].province = paramProvince;
      byPersonSorted[index].zone = provincialZone[index].length;
    });
    partyData = byPartySorted.reverse();
    personData = byPersonSorted.reverse();
  }

  useEffect(() => {}, []);

  return (
    <Container>
      <Header>
        <div
          className="provincial-view--toggle"
          style={{ height: '100%', borderRadius: '12px' }}
        >
          <div
            className={`provincial-view--toggle-button ${partyView &&
              'active'}`}
            onClick={() => setPartyView(true)}
          >
            <SeePartyMenu partyView={partyView} view={'compareView'} />
          </div>
          <div
            className={`provincial-view--toggle-button ${!partyView &&
              'active'}`}
            style={{ height: '100%' }}
            onClick={() => setPartyView(false)}
          >
            <SeeWinnerMenu partyView={partyView} view={'compareView'} />
          </div>
          <span
            className="provincial-view--toggle-active"
            style={{ left: !partyView && '50%' }}
          ></span>
        </div>
      </Header>
      {!partyData ? (
        <div>Loading...</div>
      ) : (
        <YearList
          view={partyView ? 'party' : 'person'}
          party={partyData}
          person={personData}
        />
      )}
    </Container>
  );
};

export default CompareView;
