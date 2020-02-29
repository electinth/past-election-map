import React from 'react';
import styled from 'styled-components';
import CountryMap from './CountryMap';

const Main = styled.main`
	width: 96rem;
	margin: 0 auto;
	margin-top: 3rem;
	padding: 1rem 2rem;
`;

const Viz = () => {
	return (
		<Main>
			<h1>Thailand Past Election Map</h1>
			<CountryMap />
		</Main>
	);
};

export default Viz;
