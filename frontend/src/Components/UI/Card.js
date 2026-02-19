import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../Contexts/AppContext';

const Card = ({ movie }) => {
	const navigate = useNavigate();
	const { theme } = useApp();

	const handleClick = () => {
		navigate(`/movie/${movie.id}`, {
			state: {
				mediaType: movie.media_type || 'movie',
				preloadedData: movie,
			},
		});
	};

	const posterUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: 'https://via.placeholder.com/500x750/1f2937/4b5563?text=No+Image';

	const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

	return (
		<div
			onClick={handleClick}
			className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
				theme === 'dark'
					? 'bg-gray-800 hover:shadow-2xl hover:shadow-blue-900/50'
					: 'bg-white hover:shadow-2xl hover:shadow-blue-200/50'
			}`}>
			<div className='relative aspect-[2/3] overflow-hidden'>
				<img
					src={posterUrl}
					alt={movie.title || movie.name}
					className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
					onError={(e) => {
						e.target.src = 'https://via.placeholder.com/500x750/1f2937/4b5563?text=No+Image';
					}}
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
				<div className='absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1'>
					<span>★</span>
					<span>{rating}</span>
				</div>
			</div>
			<div className='p-4'>
				<h3 className={`font-bold text-lg line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
					{movie.title || movie.name}
				</h3>
				{(movie.release_date || movie.first_air_date) && (
					<p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
						{new Date(movie.release_date || movie.first_air_date).getFullYear()}
					</p>
				)}
			</div>
		</div>
	);
};

export default Card;
