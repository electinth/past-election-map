import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams, withRouter } from 'react-router-dom';
import * as d3 from 'd3';

import MapContext from '../../../map/context';
import { ELECTION_YEAR } from '../../../config';

import D3Compare from './D3Compare';

const Container = styled.div`
  width: 350px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: var(--border-radius);
  border: 1px solid #000000;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.25);
  padding: 0 2rem 2rem;
`;

const Title = styled.h1`
  font-family: 'The MATTER';
  font-size: 3.2rem;
  text-align: center;
  color: #000000;
  margin-bottom: 1rem;
`;

const SeeMore = styled.button`
  height: 53px;
  width: 100%;
  border: 1px solid #333333;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  font-family: 'The MATTER';
  font-size: 2rem;
  color: black;
  display: block;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

const CompareContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 2rem;
  justify-content: space-between;
`;

const CompareMap = styled.div`
  flex: 0 0 50%;
  height: 200px;
  margin: 0;
  cursor: pointer;

  border-radius: var(--border-radius);
  border: 1px solid
    ${props => (props.active ? 'var(--color-black)' : 'transparent')};
  box-shadow: ${props => (props.active ? '0 2px 4px 0 rgba(0,0,0,0.25)' : 'none')};

  &:hover {
    border: 1px solid var(--color-black);
  }
`;

let $defs;
let maps;

const marginTop = 50,
  marginBottom = 20,
  marginLeft = 25,
  marginRight = 25;
const w = 130 - marginLeft - marginRight,
  h = 200 - marginTop - marginBottom;
const dimension = {
  w,
  h,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight
};

const compareYears = ELECTION_YEAR.map(y => y.year);

const ProvinceAreaCompare = props => {
  const { year: paramYear } = useParams();
  useEffect(() => {
    if (!paramYear) return;
    setElectionYear(`election-${paramYear}`);
  }, [paramYear]);

  const {
    province,
    CountryTopoJson,
    electionYear,
    setElectionYear
  } = useContext(MapContext);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const $compare = d3.selectAll('svg[id*=compare-election-]');
    $defs = d3.select(`#map-defs-compare`);
    maps = D3Compare(CountryTopoJson, compareYears, $compare, $defs, dimension, 6500);
  }, [CountryTopoJson]);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    maps.handleProvinceChange(province);
  }, [CountryTopoJson, province]);

  return (
    <Container>
      <Title>ผลเลือกตั้งย้อนหลัง</Title>
      <CompareContainer>
        {compareYears.map(year => (
          <CompareMap
            key={year}
            active={electionYear === `election-${year}`}
            onClick={() =>
              province === 'ประเทศไทย'
                ? props.history.push(`/${year}`)
                : props.history.push(`/${year}/${province}`)
            }
          >
            <svg
              id={`compare-election-${year}`}
              data-election-year={`election-${year}`}
              width="100%"
              height="100%"
            >
              <defs id={`map-defs-compare`}></defs>
              <text fontSize="32px" textAnchor="middle" x="50%" y="40px">
                {year}
              </text>
            </svg>
          </CompareMap>
        ))}
      </CompareContainer>
      <Link to={`/${paramYear}/compare/${province}`} style={{ textDecoration: 'none' }}>
        <SeeMore>ดูเปรียบเทียบ 4 ปี</SeeMore>
      </Link>
    </Container>
  );
};

export default withRouter(ProvinceAreaCompare);
