import React from 'react';

import { Bar } from './Article';
import Dropdown from './Dropdown';

const NationalView = () => {
	return (
		<>
			<Bar>
				<ul>
					<li>2554</li>
					<li>2557</li>
					<li>2562</li>
				</ul>
			</Bar>
			<Bar>
				<Dropdown>ประเทศไทย</Dropdown>
			</Bar>
		</>
	);
};

export default NationalView;
