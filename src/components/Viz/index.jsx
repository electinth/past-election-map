import React from 'react';
import styled from 'styled-components';
import Map from './Map';

const Figure = styled.figure`
	position: fixed;
	top: 5rem;
	width: 100%;
	text-align: center;
`;

const Viz = () => {
	return (
		<Figure>
			<Map />
		</Figure>
	);
};

export default Viz;
