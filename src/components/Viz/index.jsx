import React from 'react';
import styled from 'styled-components';
import Map from './Map';

const Figure = styled.figure`
	position: fixed;
	top: 5rem;
	width: 100vw;
	text-align: center;
	padding: 1rem 2rem;
`;

const Viz = () => {
	return (
		<Figure>
			<Map />
		</Figure>
	);
};

export default Viz;
