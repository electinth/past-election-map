import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import MapContext from '../../../map/context';
import D3Map from '../../Viz/D3Map';

const Container = styled.div`
  height: 520px;
  width: 350px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 10px 6px 6px 6px;
  border: 1px solid #979797;
`;

const Title = styled.h1`
  font-family: 'The MATTER';
  font-size: 3rem;
  text-align: center;
  color: #000000;
`;

const MapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 390px;
  width: 350px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const SeeMore = styled.button`
  height: 53px;
  width: 263px;
  border: 1px solid #333333;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  margin: 0 auto;
  font-family: 'The MATTER';
  font-size: 2rem;
  color: black;
  display: block;
  margin: auto;
  text-declaration: none;
`;

const ContainerCard = styled.div`
  width: 120px;
  height: 160px;
  margin: 5px;
`;

const TitleCard = styled.h1`
  color: black;
  font-family: 'The MATTER';
  font-size: 2rem;
`;

const MapCard = styled.div`
  width: 120px;
  height: 140px;
  background-color: red;
`;

const createCard = year => {
  return (
    <ContainerCard key={year}>
      <TitleCard>{year}</TitleCard>
      <MapCard>
        <svg width={120} height={140}>
          <g id="idMapVis"></g>
        </svg>
      </MapCard>
    </ContainerCard>
  );
};

const ProvinceAreaCompare = () => {
  const year = [2562, 2557, 2554, 2550];
  const { province, electionYear, CountryTopoJson } = useContext(MapContext);

  console.log('topojson');
  console.log(CountryTopoJson);
  useEffect(() => {});

  return (
    <Container>
      <Title>เปรียบเทียบ 4 ปี</Title>
      <MapContainer>
        {year.map(val => {
          return createCard(val);
        })}
      </MapContainer>
      <Link to={`/compare/${province}`}>
        <SeeMore>ดูเพิ่มเติม</SeeMore>
      </Link>
    </Container>
  );
};

export default ProvinceAreaCompare;
