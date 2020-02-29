import React from 'react';
import Nav from './components/Nav';
import GlobalStyles from './styles/GlobalStyles';
import GlobalFont from './styles/fonts';
import Viz from './components/Viz';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NationalView from './components/NationalView';
import ProvincialView from './components/ProvincialView';
import CompareView from './components/CompareView';
import { Article } from './components/Article';

const App = () => {
	return (
		<>
			<GlobalStyles />
			<GlobalFont />
			<Nav />
			<BrowserRouter>
				<main>
					<Viz />
					<Article>
						<Switch>
							<Route path="/" exact component={NationalView} />
							<Route path="/province/:province" component={ProvincialView} />
							<Route path="/compare/:province" component={CompareView} />
						</Switch>
					</Article>
				</main>
			</BrowserRouter>
		</>
	);
};

export default App;
