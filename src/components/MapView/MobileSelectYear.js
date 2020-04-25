import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import styled from 'styled-components';

import MapContext from '../../map/context';

import { isMobile, device } from '../size';
import { ELECTION_YEAR } from '../../config';

const Header = styled.div`
  display: none;

  @media ${device.mobile} {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;

    a {
      width: 23%;
      padding: 0 1rem;
      font-size: 1.6rem;
      color: var(--color-white);
      background-color: var(--color-black);
      border: 1px solid var(--color-black);
      border-radius: var(--border-radius);
      text-align: center;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.25);

      &.active {
        color: var(--color-black);
        background-color: var(--color-white);
      }
    }
  }
`;

const MobileSelectYear = ({ hideDetail }) => {
  const { electionYear, province } = useContext(MapContext);

  const pathProvince = province === "ประเทศไทย" ? "" : province;

  console.log('electionYear', electionYear)
  return (
    <Header>
      {ELECTION_YEAR.map(y => (
        <Link
          key={y.year}
          to={`/${y.year}/${pathProvince}`}
          className={y. year === electionYear.slice(-4) ? "active" : ""}
        >{y.en}</Link>
      ))}
    </Header>
  )
}

export default MobileSelectYear;
