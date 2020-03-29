import React, { useContext } from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import FullCompareParty from './FullCompareParty.jsx';

import MapContext from '../../../map/context';

const Container = styled.div`
  height: 516px;
  width: 351px;
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
  height: 390px;
  width: 245px;
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
`;

const ProvinceAreaCompare = () => {
  const year = [2562, 2557, 2554, 2550];
  const { province, electionYear } = useContext(MapContext);
  return (
    <Container>
      <Title>เปรียบเทียบ 4 ปี</Title>
      <MapContainer>
        <Title>{province}</Title>
      </MapContainer>
      <SeeMore>
        ดูเพิ่มเติม
        <Switch>
          <Route
            path="/:year/:province/compare-area/party"
            component={FullCompareParty}
          />
        </Switch>
      </SeeMore>
    </Container>
  );
};

export default ProvinceAreaCompare;
