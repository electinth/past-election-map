import React from 'react';

import CountryGeoJson from '../../data/geojson/thailand.geo.json';

const CountryMap = () => {
	console.log(CountryGeoJson);

	return (
		<svg>
			<g className="thailand"></g>
		</svg>
	);
};

export default CountryMap;
