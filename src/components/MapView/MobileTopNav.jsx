import React from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from 'lodash';
import styled from 'styled-components';

import { isMobile, device } from '../size';

const Header = styled.div`
  @media ${device.tablet} {
    width: 100%;
    height: 5rem;
    padding: 1rem;
    display: grid !important;
    margin: 0;
    grid-template-columns: 12rem 17rem;
    grid-template-rows: 5rem;
    grid-template-areas:
      "back forward";
    column-gap: 1rem;
    row-gap: 1rem;
    justify-items: stretch;
    align-items: start;
    justify-content: space-between;
    align-content: stretch;
  }
`;

const HeaderBack = styled.div`
  grid-area: back;
  a {
    text-decoration: none;
  }
`;

const HeaderForward = styled.div`
  grid-area: forward;
  a {
    text-decoration: none;
  }
`;


const WhiteButton = styled.div`
  height: 5rem;
  width: 16rem;
  left: 50px;
  border: 1px solid #333333;
  border-radius: var(--border-radius);
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  position: absolute;
  font-family: 'The MATTER';
  font-size: 3rem;
  color: black;
  text-align: center;
  line-height: 40px;

  @media ${device.tablet} {
    position: static;
    width: 100%;
    font-size: 1.6rem;
    line-height: 1.5;
    padding: 0 0;
    height: auto;
  }
`;

const CountryViewButton = ({ hideDetail }) => {
  const { year: paramYear, province: paramProvince } = useParams();

  return (
    <HeaderBack>
      <Link
        to={`/${paramYear}`}
        onClick={() => hideDetail()}
      >
        <WhiteButton>
          <i
          className="icon--chevron icon--chevron__left"
          style={{ display: 'none' }}></i>
          {' '}
          ดูประเทศไทย
        </WhiteButton>
      </Link>
    </HeaderBack>
  )
}

const CompareViewButton = () => {
  const { year: paramYear, province: paramProvince } = useParams();

  return (
    <HeaderForward>
      <Link to={`/${paramYear}/compare/${paramProvince}`}>
        <WhiteButton>
          ดูเปรียบเทียบ 4 ปี{' '}
          <i
            className="icon--chevron icon--chevron__right"
            style={{ display: 'none' }}></i>
        </WhiteButton>
      </Link>
    </HeaderForward>
  )
}

const MobileTopNav = ({ hideDetail }) => {
  return (
    <Header className="mobile-only">
      <CountryViewButton hideDetail={hideDetail} />
      <CompareViewButton />
    </Header>
  )
}

export default MobileTopNav;
