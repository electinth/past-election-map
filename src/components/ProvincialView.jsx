import React from 'react';
import { Bar } from './Article';
import Dropdown from './Dropdown';
const ProvincialView = ({
	match: {
		params: { province }
	}
}) => {
	return (
		<>
			<Bar></Bar>
			<Bar>
				<Dropdown>{province}</Dropdown>
			</Bar>
		</>
	);
};

export default ProvincialView;
