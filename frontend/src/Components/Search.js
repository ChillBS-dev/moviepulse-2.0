import React, { useState, useMemo } from 'react';
import { useApp } from '../Contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Search = () => {
	const { setSearchQuery, localMovies } = useApp();
	const [input, setInput] = useState('');
	const [focused, setFocused] = useState(false);
	const navigate = useNavigate();

	const suggestions = useMemo(() => {
		if (!input || !Array.isArray(localMovies)) return [];
		const q = input.toLowerCase();
		return localMovies
			.filter((m) => (m.title || m.name || '').toLowerCase().includes(q))
			.slice(0, 8);
	}, [input, localMovies]);

	const handleSearch = () => {
		// Fallback to server search if user explicitly triggers search
		setSearchQuery(input.trim());
		setFocused(false);
	};

	const goToMovie = (id) => {
		navigate(`/movie/${id}`);
		setInput('');
		setFocused(false);
	};

	return (
		<div className='mb-8 relative'>
			<input
				type='text'
				value={input}
				onFocus={() => setFocused(true)}
				onBlur={() => setTimeout(() => setFocused(false), 150)}
				onChange={(e) => setInput(e.target.value)}
				placeholder='Search movies...'
				className='p-2 rounded-lg w-full'
			/>
			<div className='mt-2'>
				<button
					onClick={handleSearch}
					className='ml-2 p-2 bg-gray-700 text-white rounded-lg'>
					Search
				</button>
			</div>

			{focused && suggestions.length > 0 && (
				<div className='absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-2 z-50 overflow-hidden'>
					{suggestions.map((s) => (
						<button
							key={s.id}
							onMouseDown={() => goToMovie(s.id)}
							className='w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
							<div className='font-medium text-gray-900 dark:text-gray-100'>{s.title || s.name}</div>
							<div className='text-sm text-gray-500 dark:text-gray-400'>{s.release_date || s.first_air_date || ''}</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default Search;
