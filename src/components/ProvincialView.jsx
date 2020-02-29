import React from 'react';

const ProvincialView = ({
	match: {
		params: { province }
	}
}) => {
	return (
		<h2>
			<span>{province}</span>
		</h2>
	);
};

export default ProvincialView;
