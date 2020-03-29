import React from 'react';
import styled from 'styled-components';

import { useParams, withRouter } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 1200px;
  background-color: black;
  z-index: 9999;
  color: white;
`;

const FullCompareParty = () => {
  console.log('FullCompareParty');
  return <Container>gang</Container>;
};

export default FullCompareParty;
