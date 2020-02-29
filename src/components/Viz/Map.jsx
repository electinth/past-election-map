import React, { useEffect } from 'react';
import * as d3 from 'd3';
import CountryGeoJson from '../../data/geojson/thailand.geo.json';
import { withRouter } from 'react-router-dom';

const Map = props => {
	let active;
	let $svg;
	let path;
	let w, h, SCALE;
	useEffect(() => {
		w = innerWidth;
		h = innerHeight;
		SCALE = 2250;

		const projection = d3
			.geoMercator()
			.translate([0, 0])
			.scale([SCALE]);

		const bkk = projection([100.5, 13.7]);

		projection.translate([-bkk[0] + w / 2, -bkk[1] + h / 2]);

		path = d3.geoPath(projection);

		$svg = d3
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
			.attr('cursor', 'pointer')
			.on('click', click);
	}, []);

	function click(d) {
		EnterProvincialView(d);
		if (active === d) return reset();
		$svg.selectAll('.active').classed('active', false);
		d3.select(this).classed('active', (active = d));

		const b = path.bounds(d);
		const scale =
			0.75 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
		const centroid = path.centroid(d);
		const translate = [
			scale * (-centroid[0] + w / 2),
			scale * (-centroid[1] + h / 2)
		];

		let transform = `translate(${translate[0]}, ${translate[1]}) scale(${scale})`;

		$svg
			.transition()
			.duration(750)
			.attr('transform', transform);
	}

	function reset() {
		props.history.push('/');

		$svg.selectAll('.active').classed('active', (active = false));
		$svg
			.transition()
			.duration(750)
			.attr('transform', '');
	}

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
