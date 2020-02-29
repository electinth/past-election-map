import React from 'react';
import Nav from './components/Nav';
import GlobalStyles from './styles/GlobalStyles';
import GlobalFont from './styles/fonts';
import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NationalView from './components/NationalView';
import ProvincialView from './components/ProvincialView';
import CompareView from './components/CompareView';

const App = () => {
	return (
		<>
			<GlobalStyles />
			<GlobalFont />
			<Nav />
			<Viz />

			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={NationalView} />
					<Route path="/province/:province" component={ProvincialView} />
					<Route path="/compare/:province" component={CompareView} />
				</Switch>
			</BrowserRouter>
		</>
	);
};

export default App;
