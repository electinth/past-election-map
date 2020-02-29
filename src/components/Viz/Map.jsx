import React, { useEffect } from 'react';
import * as d3 from 'd3';
import CountryGeoJson from '../../data/geojson/thailand.geo.json';

const Map = () => {
	useEffect(() => {
		const w = 500,
			h = 1000,
			SCALE = 1500;

		const projection = d3
			.geoMercator()
			.translate([-2350, 650])
			.scale([SCALE]);

		const path = d3.geoPath(projection);

		const $svg = d3
			.select('#vis')
			.attr('width', w)
			.attr('height', h);
		const $map = d3.select('#map');

		const $path = $map
			.selectAll('path')
			.data(CountryGeoJson.features)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('fill', 'white');
	}, []);

	return (
		<svg id="vis">
			<g id="map"></g>
		</svg>
	);
};

export default Map;
