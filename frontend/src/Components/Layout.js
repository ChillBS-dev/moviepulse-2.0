import React from 'react';
import Sidebar from './Sidebar';
import { useApp } from '../Contexts/AppContext';

const Layout = ({ children }) => {
	const { theme } = useApp();

	return (
		<div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
			<Sidebar />
			<div className={`flex-1 ml-56 transition-all duration-300 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
				{children}
			</div>
		</div>
	);
};

export default Layout;
