import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MapContext from '../../map/context';
import _ from 'lodash';
import Overview from './Overview';
import PartyList from './PartyList';
import ElectionYear from './ElectionYear';
import novoteImage from '../../images/NoVote.svg';

const NationalLeft = () => {
  return <ElectionYear />;
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
        <NoVoteDisplay view={'nationView'} />
      ) : (
        <div>
          <PartyList byPartySorted={byPartySorted} view={'nationView'} />
          <Overview waffleData={byPartySorted} view={'nationView'} />
        </div>
      )}
    </div>
  );
};
const Container = styled.div`
  width: 258px;
  margin: 2rem auto;
  padding-top: 3rem;
  ${props =>
    props.compareView &&
    `
  width: 100%;
  margin: 0 auto;
  padding-top: 5px;
  padding-bottom: 5px;
  `}
`;
const WarnText = styled.h1`
  color: #da3731;
  font-family: 'The MATTER';
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 36px;
  text-align: center;
  ${props =>
    props.compareView &&
    `
    color: #da3731;
    font-family: "The MATTER";
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 18px;
    text-align: center;
  `}
`;
const ExplainText = styled.p`
  color: #000000;
  font-family: 'Noto Sans Thai';
  font-size: 2rem;
  font-weight: 500;
  line-height: 2.5rem;
  text-align: left;
  ${props =>
    props.compareView &&
    `
    color: #000000;
    font-family: "Noto Sans Thai";
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 14px;
    margin-top: 0.5rem;
  `}
  a {
    color: inherit;
  }
`;

const NoVoteDisplay = ({ view }) => {
  const width = view === 'nationView' ? 257 : 65;
  const height = view === 'nationView' ? 159 : 40;
  console.log(view);
  return (
    <div>
      {view === 'nationView' ? (
        <Container>
          <img src={novoteImage} width={width} height={height} />
          <WarnText>การเลือกตั้งเป็นโมฆะ</WarnText>
          <ExplainText>
            เนื่องจากเกิดการชุมนุมปิดคูหาเลือกตั้ง
            ทำให้ไม่สามารถเลือกตั้งพร้อมกันได้ทั่วประเทศในวันเดียวกัน
            ตามที่กำหนดไว้ในรัฐธรรมนูญ
          </ExplainText>
        </Container>
      ) : (
        <Container compareView>
          <img src={novoteImage} width={width} height={height} />
          <WarnText compareView>การเลือกตั้งเป็นโมฆะ</WarnText>
          <ExplainText compareView>
            เนื่องจากเกิดการชุมนุมปิดคูหาเลือกตั้ง
            ทำให้ไม่สามารถเลือกตั้งพร้อมกันได้ทั่วประเทศในวันเดียวกัน
            ตามที่กำหนดไว้ในรัฐธรรมนูญ
          </ExplainText>
        </Container>
      )}
    </div>
  );
};

const NoBeungKanProvince = () => {
  return (
    <Container compareView style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <WarnText compareView >ไม่มีข้อมูล</WarnText>
      <ExplainText compareView>
      จังหวัดบึงกาฬแยกออกจาก<Link to={'/compare/หนองคาย'}>จังหวัดหนองคาย</Link>
      เมื่อปี 2554
      </ExplainText>
    </Container>
  );
}

export { NationalLeft, NationalRight, NoVoteDisplay, NoBeungKanProvince };
