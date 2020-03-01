import React from 'react';
import styled from 'styled-components';

import COLOR from '../styles/color';

const FixedNav = styled.nav`
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  padding: 0 3rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 2.25rem;

  background-color: ${COLOR.nav};
  color: ${COLOR.white};
`;

const ElectLogo = styled.a`
  color: ${COLOR.white};
  text-decoration: none;
`;

const Nav = () => {
  return (
    <FixedNav>
      <ElectLogo href="https://elect.in.th/">ELECT</ElectLogo>
      <span>About Us</span>
    </FixedNav>
  );
};

export default Nav;
