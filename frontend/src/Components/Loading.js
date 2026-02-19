import React from 'react';
import { useApp } from '../Contexts/AppContext';

const Loading = () => {
	const { theme } = useApp();

	return (
		<div className='flex items-center justify-center py-20'>
			<div className='text-center'>
				<div className='relative w-20 h-20 mx-auto mb-4'>
					<div className='absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping' />
					<div className='absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
				</div>
				<p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
					Chargement...
				</p>
			</div>
		</div>
	);
};

export default Loading;
