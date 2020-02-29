import React, { useEffect } from 'react';
import * as d3 from 'd3';
import CountryGeoJson from '../../data/geojson/thailand.geo.json';
import { withRouter } from 'react-router-dom';

const Map = props => {
	useEffect(() => {
		console.log(CountryGeoJson);
		const w = innerWidth,
			h = 1000,
			SCALE = 2250;

		const projection = d3
			.geoMercator()
			.translate([0, 0])
			.scale([SCALE]);

		const bkk = projection([100.5, 13.7]);

		projection.translate([-bkk[0] + w / 2, -bkk[1] + 300]);

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
			.attr('fill', 'white')
			.on('click', EnterProvincialView);
	}, []);

	function EnterProvincialView({ properties: { name } }) {
		const province = name
			.toLowerCase()
			.split(' ')
			.join('');
		const path = `/province/${province}`;
		props.history.push(path);
	}

	return (
		<svg id="vis">
			<g id="map"></g>
		</svg>
	);
};

export default withRouter(Map);
