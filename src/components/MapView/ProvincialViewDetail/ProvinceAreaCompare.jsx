import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useParams, withRouter } from 'react-router-dom';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as tps from 'topojson-simplify';

import partyColor from '../../../map/color';
import MapContext from '../../../map/context';
import D3Compare from './D3Compare';

const Container = styled.div`
  height: 550px;
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

const CompareContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 0 20px;
`;

const CompareMap = styled.div`
  flex: 0 0 45%;
  height: 200px;
  margin: 2.5%;
  cursor: pointer;

  border: 1px solid
    ${props => (props.active ? 'var(--color-black)' : 'transparent')};
  border-radius: 10px;

  &:hover {
    border: 1px solid var(--color-black);
  }
`;

let geo, $defs;
let maps;
const ProvinceAreaCompare = () => {
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
    maps = D3Compare(CountryTopoJson, $compare, $defs);
  }, [CountryTopoJson]);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    maps.handleProvinceChange(province);
  }, [CountryTopoJson, province]);

  return (
    <Container>
      <Title>ผลเลือกตั้งย้อนหลัง</Title>
      <CompareContainer>
        <CompareMap active={electionYear === 'election-2562'}>
          <svg
            id="compare-election-2562"
            data-election-year="election-2562"
            width="100%"
            height="100%"
          >
            <text fontSize="32px" textAnchor="middle" x="50%" y="40px">
              2562
            </text>
          </svg>
        </CompareMap>
        <CompareMap active={electionYear === 'election-2557'}>
          <svg
            id="compare-election-2557"
            data-election-year="election-2557"
            width="100%"
            height="100%"
          >
            <text fontSize="32px" textAnchor="middle" x="50%" y="40px">
              2557
            </text>
          </svg>
        </CompareMap>
        <CompareMap active={electionYear === 'election-2554'}>
          <svg
            id="compare-election-2554"
            data-election-year="election-2554"
            width="100%"
            height="100%"
          >
            <text fontSize="32px" textAnchor="middle" x="50%" y="40px">
              2554
            </text>
          </svg>
        </CompareMap>
        <CompareMap active={electionYear === 'election-2550'}>
          <svg
            id="compare-election-2550"
            data-election-year="election-2550"
            width="100%"
            height="100%"
          >
            <text fontSize="32px" textAnchor="middle" x="50%" y="40px">
              2550
            </text>
          </svg>
        </CompareMap>
        {/* <svg width="100%" height="400">
          <g className="compare-province" ref={compareRef}>
            <defs id={`map-defs-compare`}></defs>
            <g className="election-2562">
              <text fontSize="32px" textAnchor="middle" x="25%" y="25px">
                2562
              </text>
            </g>
            <g className="election-2557">
              <text fontSize="32px" textAnchor="middle" x="25%" y="25px">
                2557
              </text>
            </g>
            <g className="election-2554">
              <text fontSize="32px" textAnchor="middle" x="25%" y="25px">
                2554
              </text>
            </g>
            <g className="election-2550">
              <text fontSize="32px" textAnchor="middle" x="25%" y="25px">
                2550
              </text>
            </g>
          </g>
        </svg> */}
      </CompareContainer>
      <Link to={`/compare/${province}`} style={{ textDecoration: 'none' }}>
        <SeeMore>ดูเปรียบเทียบ 4 ปี</SeeMore>
      </Link>
    </Container>
  );
};

export default withRouter(ProvinceAreaCompare);
