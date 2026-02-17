import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
	return (
		<div className='flex min-h-screen bg-gray-900'>
			<Sidebar />
			{/* Main content - offset by sidebar width */}
			<div className='flex-1 ml-56 transition-all duration-300 min-h-screen'>
				{children}
			</div>
		</div>
	);
};

export default Layout;
