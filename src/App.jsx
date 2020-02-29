import React from 'react';
import Nav from './components/Nav';
import GlobalStyles from './styles/GlobalStyles';
import GlobalFont from './styles/fonts';
import Viz from './components/Viz';

const App = () => {
	return (
		<>
			<GlobalStyles />
			<GlobalFont />
			<Nav />
			<Viz />
		</>
	);
};

export default App;
