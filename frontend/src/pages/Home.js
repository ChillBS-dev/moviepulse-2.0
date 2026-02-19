import React, { useEffect } from 'react';
import Catalogue from '../Components/Catalogue';
import { useApp } from '../Contexts/AppContext';

const Home = () => {
	const { theme } = useApp();

	useEffect(() => {
		document.body.className = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
	}, [theme]);

	return (
		<div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
			<Catalogue />
		</div>
	);
};

export default Home;
