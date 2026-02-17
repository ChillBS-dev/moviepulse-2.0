import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const StarRating = ({ rating }) => {
	const stars = Math.round(rating / 2);
	return (
		<div className='flex items-center gap-1'>
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					className={`text-sm ${star <= stars ? 'text-yellow-400' : 'text-gray-600'}`}>
					★
				</span>
			))}
			<span className='text-yellow-400 text-sm font-bold ml-1'>{rating}/10</span>
		</div>
	);
};

const MediaCard = ({ item, rank, onClick }) => {
	const posterUrl = item.poster_path
		? `https://image.tmdb.org/t/p/w300${item.poster_path}`
		: 'https://via.placeholder.com/300x450/1f2937/6b7280?text=No+Image';

	const rankColor =
		rank === 1
			? 'text-yellow-400'
			: rank === 2
			? 'text-gray-300'
			: rank === 3
			? 'text-amber-600'
			: 'text-gray-500';

	return (
		<div
			onClick={() => onClick(item)}
			className='flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 cursor-pointer transition-all duration-200 group border border-transparent hover:border-gray-700'>
			{/* Rank */}
			<div className={`text-4xl font-black w-10 text-center ${rankColor} flex-shrink-0`}>
				{rank}
			</div>

			{/* Poster */}
			<div className='relative flex-shrink-0'>
				<img
					src={posterUrl}
					alt={item.title}
					className='w-16 h-24 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow'
					onError={(e) => {
						e.target.src = 'https://via.placeholder.com/300x450/1f2937/6b7280?text=No+Image';
					}}
				/>
				{rank <= 3 && (
					<div className='absolute -top-1 -right-1 text-lg'>
						{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
					</div>
				)}
			</div>

			{/* Info */}
			<div className='flex-1 min-w-0'>
				<h3 className='text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors'>
					{item.title}
				</h3>
				<p className='text-gray-400 text-xs mt-1'>
					{item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
				</p>
				<StarRating rating={item.vote_average} />
				<p className='text-gray-500 text-xs mt-1'>
					{item.vote_count?.toLocaleString()} votes
				</p>
			</div>

			{/* Arrow */}
			<div className='text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0'>
				→
			</div>
		</div>
	);
};

const Trending = () => {
	const [movies, setMovies] = useState([]);
	const [series, setSeries] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('movies');
	const [lastUpdated, setLastUpdated] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		fetchTrending();
		// Set last updated date
		const now = new Date();
		setLastUpdated(now.toLocaleDateString('fr-FR', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}));
	}, []);

	const fetchTrending = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${API_BASE_URL}/trending/`);
			if (!response.ok) throw new Error('Erreur lors du chargement');
			const data = await response.json();
			setMovies(data.movies || []);
			setSeries(data.series || []);
		} catch (err) {
			setError('Impossible de charger le trending. Réessayez plus tard.');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleItemClick = (item) => {
		navigate(`/movie/${item.id}`, { state: { mediaType: item.media_type } });
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<div className='text-6xl mb-4 animate-spin'>⭐</div>
					<p className='text-white text-xl'>Chargement du top trending...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<div className='text-6xl mb-4'>😕</div>
					<p className='text-red-400 text-xl'>{error}</p>
					<button
						onClick={fetchTrending}
						className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
						Réessayer
					</button>
				</div>
			</div>
		);
	}

	const currentData = activeTab === 'movies' ? movies : series;

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* Hero Header */}
			<div className='bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900 py-12 px-6'>
				<div className='max-w-4xl mx-auto text-center'>
					<div className='text-5xl mb-3'>🏆</div>
					<h1 className='text-4xl font-black text-white mb-2'>
						Top 10 de la Semaine
					</h1>
					<p className='text-gray-400 text-sm'>
						Mis à jour le {lastUpdated}
					</p>
					<div className='flex items-center justify-center gap-2 mt-3'>
						<div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></div>
						<span className='text-green-400 text-sm'>Actualisé cette semaine</span>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className='max-w-4xl mx-auto px-6 py-6'>
				<div className='flex gap-2 bg-gray-800 p-1 rounded-xl w-fit mx-auto mb-8'>
					<button
						onClick={() => setActiveTab('movies')}
						className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
							activeTab === 'movies'
								? 'bg-blue-600 text-white shadow-lg'
								: 'text-gray-400 hover:text-white'
						}`}>
						🎬 Films
					</button>
					<button
						onClick={() => setActiveTab('series')}
						className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
							activeTab === 'series'
								? 'bg-purple-600 text-white shadow-lg'
								: 'text-gray-400 hover:text-white'
						}`}>
						📺 Séries
					</button>
				</div>

				{/* Top 3 Podium */}
				{currentData.length >= 3 && (
					<div className='mb-8'>
						<h2 className='text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 text-center'>
							🏆 Podium
						</h2>
						<div className='grid grid-cols-3 gap-4'>
							{/* 2nd place */}
							<div className='text-center pt-8'>
								<div className='relative mx-auto w-24'>
									<img
										src={currentData[1]?.poster_path
											? `https://image.tmdb.org/t/p/w200${currentData[1].poster_path}`
											: 'https://via.placeholder.com/200x300/1f2937/6b7280?text=N/A'}
										alt={currentData[1]?.title}
										className='w-24 h-36 object-cover rounded-lg mx-auto shadow-lg opacity-90'
									/>
									<div className='absolute -top-3 -right-3 text-2xl'>🥈</div>
								</div>
								<p className='text-gray-300 text-xs mt-2 truncate px-1'>{currentData[1]?.title}</p>
								<p className='text-yellow-400 text-xs'>{currentData[1]?.vote_average}/10</p>
							</div>

							{/* 1st place */}
							<div className='text-center'>
								<div className='relative mx-auto w-28'>
									<div className='absolute -top-4 left-1/2 -translate-x-1/2 text-3xl'>👑</div>
									<img
										src={currentData[0]?.poster_path
											? `https://image.tmdb.org/t/p/w200${currentData[0].poster_path}`
											: 'https://via.placeholder.com/200x300/1f2937/6b7280?text=N/A'}
										alt={currentData[0]?.title}
										className='w-28 h-40 object-cover rounded-lg mx-auto shadow-2xl border-2 border-yellow-400'
									/>
									<div className='absolute -top-2 -right-2 text-2xl'>🥇</div>
								</div>
								<p className='text-white text-xs mt-2 font-bold truncate px-1'>{currentData[0]?.title}</p>
								<p className='text-yellow-400 text-xs font-bold'>{currentData[0]?.vote_average}/10</p>
							</div>

							{/* 3rd place */}
							<div className='text-center pt-8'>
								<div className='relative mx-auto w-24'>
									<img
										src={currentData[2]?.poster_path
											? `https://image.tmdb.org/t/p/w200${currentData[2].poster_path}`
											: 'https://via.placeholder.com/200x300/1f2937/6b7280?text=N/A'}
										alt={currentData[2]?.title}
										className='w-24 h-36 object-cover rounded-lg mx-auto shadow-lg opacity-90'
									/>
									<div className='absolute -top-3 -right-3 text-2xl'>🥉</div>
								</div>
								<p className='text-gray-300 text-xs mt-2 truncate px-1'>{currentData[2]?.title}</p>
								<p className='text-yellow-400 text-xs'>{currentData[2]?.vote_average}/10</p>
							</div>
						</div>
					</div>
				)}

				{/* Full Top 10 List */}
				<div className='bg-gray-800 rounded-2xl overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-700'>
						<h2 className='text-white font-bold text-lg'>
							{activeTab === 'movies' ? '🎬 Top 10 Films' : '📺 Top 10 Séries'} — Cette semaine
						</h2>
					</div>
					<div className='divide-y divide-gray-700/50'>
						{currentData.map((item) => (
							<MediaCard
								key={item.id}
								item={item}
								rank={item.rank}
								onClick={handleItemClick}
							/>
						))}
					</div>
				</div>

				<p className='text-center text-gray-600 text-xs mt-6'>
					Données fournies par TMDB • Actualisées chaque semaine
				</p>
			</div>
		</div>
	);
};

export default Trending;
