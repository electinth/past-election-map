import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import COLOR from '../styles/color';

const DropdownContainer = styled.div`
  width: 100%;
`;

const DropdownToggle = styled.button`
  width: 100%;
  padding: 1rem 6rem;
  font-size: 4rem;
  font-weight: bold;
  background-color: ${COLOR.white};
  border: 1px solid ${COLOR.black};
  border-radius: 1.5rem;
`;

const DropdownItems = styled.div``;

const Dropdown = props => {
  return (
    <DropdownContainer>
      <DropdownToggle>{props.children}</DropdownToggle>
      <DropdownItems></DropdownItems>
    </DropdownContainer>
  );
};

export default withRouter(Dropdown);
