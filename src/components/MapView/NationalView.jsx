import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import MapContext from '../../map/context';
import _ from 'lodash';
import Overview from './Overview';
import PartyList from './PartyList';

import novoteImage from '../../images/NoVote.svg';

const NationalLeft = () => {
  return <></>;
};
const NationalRight = () => {
  const { setProvince, CountryTopoJson, electionYear } = useContext(MapContext);
  const [nationalProps, setNationalProps] = useState([]);
  const isNoVote = electionYear === 'election-2557';
  useEffect(() => {
    setProvince('ประเทศไทย');
  }, []);
  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    const nationalProps = CountryTopoJson.objects[electionYear].geometries.map(
      geo => geo.properties
    );
    setNationalProps(nationalProps);
  }, [CountryTopoJson, electionYear]);
  const numZone = nationalProps.length;
  const numCandidate = nationalProps.reduce((acc, cur) => {
    return acc + cur.quota;
  }, 0);
  let byParty = {};
  nationalProps.map(cur => {
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
    <div className="national-view">
      <h1 className="national-view--header">
        {numZone} เขต {numCandidate} คน
      </h1>
      {isNoVote ? (
        <NovoteDisplay />
      ) : (
        <div>
          <PartyList byPartySorted={byPartySorted} />
          <Overview waffleData={byPartySorted} />
        </div>
      )}
    </div>
  );
};
const Container = styled.div`
  width: 258px;
  height: 400px;
  margin: 0 auto;
  border-top: 1px solid #222222;
  margin-top: 20px;
  padding-top: 27px;
`;
const WarnText = styled.h1`
  color: #da3731;
  font-family: 'The MATTER';
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 36px;
  text-align: center;
`;
const ExplainText = styled.p`
  color: #000000;
  font-family: 'Noto Sans Thai';
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.5rem;
  text-align: left;
`;
const NovoteDisplay = () => {
  return (
    <Container>
      <img src={novoteImage} width="257" height="159" />
      <WarnText>การเลือกตั้งเป็นโมฆะ</WarnText>
      <ExplainText>
        เนื่องจากเกิดการชุมนุมปิดคูหาเลือกตั้ง
        ทำให้ไม่สามารถเลือกตั้งพร้อมกันได้ทั่วประเทศในวันเดียวกัน
        ตามที่กำหนดไว้ในรัฐธรรมนูญ
      </ExplainText>
    </Container>
  );
};
export { NationalLeft, NationalRight, NovoteDisplay };
