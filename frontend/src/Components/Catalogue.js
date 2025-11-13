import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Search from './UI/Search';
import Card from './UI/Card';
import Loading from './Loading';
import { useApp } from '../Contexts/AppContext';
import useMovie from '../Hooks/useMovie';

function Catalogue() {
	const { setSearchQuery, searchQuery } = useApp();
	const [currentPage, setCurrentPage] = useState(1);
	const {
		movies = [],
		isLoading,
		totalPages,
	} = useMovie(searchQuery, currentPage);

	useEffect(() => {
		// Log to debug
		console.log('Search Query:', searchQuery);
		console.log('Current Page:', currentPage);
	}, [searchQuery, currentPage]);

	const handleClick = (val) => {
		setSearchQuery(val);
		setCurrentPage(1); // Reset to first page on search query change
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<div className='min-h-screen px-4 md:px-8 py-8 bg-gray-900'>
			{/* Category Navigation */}
			<div className='flex justify-start mb-8'>
				<nav className='bg-gray-800 rounded-xl p-1 shadow-lg'>
					<ul className='flex space-x-1'>
						<li
							onClick={() => handleClick('Movies')}
							className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
								searchQuery === 'Movies' 
									? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
									: 'text-gray-300 hover:text-white hover:bg-gray-700'
							}`}>
							Movies
						</li>
						<li
							onClick={() => handleClick('Series')}
							className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
								searchQuery === 'Series' 
									? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
									: 'text-gray-300 hover:text-white hover:bg-gray-700'
							}`}>
							Series
						</li>
						<li
							onClick={() => handleClick('Documentaries')}
							className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
								searchQuery === 'Documentaries' 
									? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
									: 'text-gray-300 hover:text-white hover:bg-gray-700'
							}`}>
							Documentaries
						</li>
					</ul>
				</nav>
			</div>

			{/* Search Bar */}
			<div className='mb-8'>
				<Search />
			</div>

			{/* Section Title */}
			<div className='mt-10 mb-6 flex items-center gap-3'>
				<h2 className='text-white font-bold text-3xl md:text-4xl'>{searchQuery}</h2>
				{!isLoading && movies.length > 0 && (
					<span className='text-gray-400 text-lg'>({movies.length} results)</span>
				)}
			</div>

			{isLoading ? (
				<Loading />
			) : (
				<>
					{/* Movies Grid */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
						{movies.length ? (
							movies.map((movie, index) => (
								<div key={movie.id} style={{ animationDelay: `${index * 50}ms` }}>
									<Card movie={movie} />
								</div>
							))
						) : (
							<div className='col-span-full flex flex-col items-center justify-center py-20'>
								<svg className='w-24 h-24 text-gray-700 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' />
								</svg>
								<p className='text-gray-400 text-lg'>No movies found</p>
								<p className='text-gray-500 text-sm mt-2'>Try adjusting your search query</p>
							</div>
						)}
					</div>

					{/* Pagination */}
					{movies.length > 0 && (
						<div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-8'>
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className='bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center gap-2 shadow-lg'>
								<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
								</svg>
								Previous
							</button>
							<div className='flex items-center gap-2 bg-gray-800 px-6 py-3 rounded-lg border border-gray-700 shadow-lg'>
								<span className='text-white font-medium'>Page</span>
								<span className='text-blue-400 font-bold text-lg'>{currentPage}</span>
								<span className='text-gray-400'>of</span>
								<span className='text-white font-medium'>{totalPages}</span>
							</div>
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className='bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center gap-2 shadow-lg'>
								Next
								<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
								</svg>
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Catalogue;
