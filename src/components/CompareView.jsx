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

const Card = styled.div`
  height: 240px;
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
  margin: 1rem 0;
  padding: 1rem 1rem 0 0;
  border-bottom: 1px solid black;
`;

const LiPartyList = styled.li`
  font-size: 1.6rem;
  padding: 0.5rem 0;
`;
const PartyList = partyData => {
  const year = [2562, 2557, 2554, 2550];

  return (
    <ViewParty>
      <PartyUL>
        {year.map((year, index) => {
          return (
            <Year key={year}>
              <CardList>
                <YearTilte>ปี {year}</YearTilte>
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
                          {candidate} เขต
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
      byPartySorted.push({
        data: currentByPartySorted
      });
    });
    electionYear.forEach((year, index) => {
      byPartySorted[index].year = year;
      byPartySorted[index].province = paramProvince;
      byPartySorted[index].zone = provincialZone[index].length;
    });

    console.log('data');
    console.log(byPartySorted);

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
