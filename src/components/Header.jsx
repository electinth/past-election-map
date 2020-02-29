import React from 'react';
import styled from 'styled-components';
import COLOR from '../styles/color';

const FixedHeader = styled.header`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 3rem;

	display: flex;
	align-items: center;
	justify-content: center;

	font-size: 1.6rem;

	background-color: ${COLOR.black};
	color: ${COLOR.white};
`;

const ElectLogo = styled.a`
	color: ${COLOR.white};
	text-decoration: none;
`;

const Header = () => {
	return (
		<FixedHeader>
			<span>
				Past Election Map |{' '}
				<ElectLogo href="https://elect.in.th/">Elect</ElectLogo>
			</span>
		</FixedHeader>
	);
};

export default Header;
