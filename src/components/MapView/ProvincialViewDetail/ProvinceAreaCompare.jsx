import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import MapContext from '../../../map/context';
import DrawMap from './DrawMap';

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
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
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
`;

const CreateCard = ({ obj }) => {
  const width = 120,
    height = 140;
  const { province, CountryTopoJson } = useContext(MapContext);
  const ProviceGeomatires = CountryTopoJson.objects[
    obj.electionYear
  ].geometries.filter(val => {
    return val.properties.province_name === province;
  });

  let ProvinceTopoJson = JSON.parse(JSON.stringify(CountryTopoJson));

  const allowed = [obj.electionYear];

  const ProvinceTopoJsonFilter = Object.keys(ProvinceTopoJson.objects)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = ProvinceTopoJson.objects[key];
      return obj;
    }, {});

  ProvinceTopoJson.objects = ProvinceTopoJsonFilter;
  ProvinceTopoJson.objects[obj.electionYear].geometries = ProviceGeomatires;

  let map = DrawMap(
    ProvinceTopoJson,
    width,
    height,
    obj.electionYear,
    province
  );

  useEffect(() => {
    const $gVis = d3.select(`#idMapVis-${obj.electionYear}`);
    map.setVis($gVis);
    map.render(obj.electionYear);
    map.setProvince(province);
  });

  return (
    <ContainerCard key={obj.electionYear}>
      <TitleCard>{obj.year}</TitleCard>
      <MapCard>
        <svg width={width} height={height}>
          <g id={`idMapVis-${obj.electionYear}`}>
            <defs id={`map-defs`}></defs>
            <g id={`map-province-${obj.electionYear}`}></g>
            <g
              id={`zone-label-province-${obj.electionYear}`}
              style={{ pointerEvents: 'none' }}
            ></g>
            <g
              id={`border-province-${obj.electionYear}`}
              style={{ pointerEvents: 'none' }}
            ></g>
          </g>
        </svg>
      </MapCard>
    </ContainerCard>
  );
};

const ProvinceAreaCompare = () => {
  console.log('provinceAreaComapre');
  const year = [
    { year: 2562, electionYear: 'election-2562' },
    { year: 2557, electionYear: 'election-2557' },
    { year: 2554, electionYear: 'election-2554' },
    { year: 2550, electionYear: 'election-2550' }
  ];
  const { province, CountryTopoJson } = useContext(MapContext);

  useEffect(() => {}, [province]);

  return (
    <Container>
      <Title>เปรียบเทียบ 4 ปี</Title>
      <MapContainer>
        {CountryTopoJson.length === 0 ? (
          <div>Loading ....</div>
        ) : (
          // year.map(obj => {
          //   return <CreateCard obj={obj} key={obj.year} />;
          // })
          <div></div>
        )}
      </MapContainer>
      <Link to={`/compare/${province}`} style={{ textDecoration: 'none' }}>
        <SeeMore>ดูเพิ่มเติม</SeeMore>
      </Link>
    </Container>
  );
};

export default ProvinceAreaCompare;
