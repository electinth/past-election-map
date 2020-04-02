import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

import styled from 'styled-components';
import MapContext from '../map/context';
import partyColor from '../map/color';

import './MapView/PartyList/styles.scss';

const Container = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  height: 800px;
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
const PartyList = partyData => {
  const year = [2562, 2557, 2554, 2550];

  return (
    <ViewParty>
      <PartyUL>
        {year.map(year => {
          return (
            <Year key={year}>
              <CardList>
                <YearTilte>ปี {year}</YearTilte>
                <ul className="party-list--list">
                  {partyData[0].map(({ party, candidate }) => (
                    <li key={party} className="party-list--list-item">
                      <span
                        className="party-lisst--party-box"
                        style={{
                          backgroundColor: partyColor('election-2562')(party)
                        }}
                      ></span>
                      {party}{' '}
                      <span className="party-list--count">{candidate} เขต</span>
                    </li>
                  ))}
                </ul>
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
  const [partyData, setPartyData] = useState([]);
  const { CountryTopoJson } = useContext(MapContext);
  const { province: paramProvince } = useParams();

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    const electionYear = [
      'election-2562',
      'election-2557',
      'election-2554',
      'election-2550'
    ];
    let provincialZone = [];
    let byParty = [];
    let byPartySorted = [];

    electionYear.map(val => {
      let currentProvince = CountryTopoJson.objects[val].geometries
        .filter(geo => geo.properties.province_name === paramProvince)
        .map(geo => geo.properties);
      currentProvince.sort((a, b) => a.zone_id - b.zone_id);
      provincialZone.push(currentProvince);
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
      byPartySorted.push(currentByPartySorted);
    });

    setPartyData(byPartySorted);
  }, []);

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
      {partyData.length !== 0 ? PartyList(partyData) : <div>Loading...</div>}
    </Container>
  );
};

export default CompareView;
