import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for image service

const Card = ({ movie }) => {
	// Load favorites from localStorage or initialize as an empty array
	const [isFavorite, setIsFavorite] = useState(false);

	// Check if the movie is already in the favorites when the component mounts
	useEffect(() => {
		const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
		const isFav = storedFavorites.some((favMovie) => favMovie.id === movie.id);
		setIsFavorite(isFav);
	}, [movie.id]);

	const handleFavoriteClick = () => {
		let storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

		if (isFavorite) {
			// Remove from favorites
			storedFavorites = storedFavorites.filter(
				(favMovie) => favMovie.id !== movie.id
			);
		} else {
			// Add to favorites
			storedFavorites.push(movie);
		}

		// Update localStorage and component state
		localStorage.setItem('favorites', JSON.stringify(storedFavorites));
		setIsFavorite(!isFavorite);
	};

	return (
		<div className='group bg-gray-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-2 animate-fadeIn'>
			<Link to={`/movie/${movie.id}`} className='block relative overflow-hidden'>
				<div className='relative overflow-hidden'>
					<img
						src={`${BASE_URL}${movie.poster_path}`}
						alt={movie.title}
						className='w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
					{movie.vote_average && (
						<div className='absolute top-3 right-3 bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full text-sm shadow-lg'>
							⭐ {movie.vote_average.toFixed(1)}
						</div>
					)}
				</div>
				<div className='p-4 space-y-2'>
					<h3 className='text-white text-lg font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors duration-200'>
						{movie.title}
					</h3>
					<p className='text-gray-400 text-sm flex items-center gap-2'>
						<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
							<path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
						</svg>
						{movie.release_date}
					</p>
				</div>
			</Link>
			<div className='px-4 pb-4'>
				<button
					onClick={handleFavoriteClick}
					className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
						isFavorite 
							? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50' 
							: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
					}`}>
					<svg className='w-5 h-5' fill={isFavorite ? 'currentColor' : 'none'} stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
					</svg>
					{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
				</button>
			</div>
		</div>
	);
};

export default Card;
