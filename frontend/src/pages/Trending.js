import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Cache key with week number to auto-refresh weekly
const getWeekKey = () => {
	const now = new Date();
	const startOfYear = new Date(now.getFullYear(), 0, 1);
	const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
	return `trending_cache_${now.getFullYear()}_w${week}`;
};

const RankBadge = ({ rank }) => {
	if (rank === 1) return <div className='text-5xl font-black text-yellow-400 drop-shadow-lg w-12 text-center'>1</div>;
	if (rank === 2) return <div className='text-5xl font-black text-gray-300 drop-shadow-lg w-12 text-center'>2</div>;
	if (rank === 3) return <div className='text-5xl font-black text-amber-600 drop-shadow-lg w-12 text-center'>3</div>;
	return <div className='text-3xl font-black text-gray-600 w-12 text-center'>{rank}</div>;
};

const StarBar = ({ rating }) => {
	const pct = (rating / 10) * 100;
	return (
		<div className='flex items-center gap-2'>
			<div className='flex-1 bg-gray-700 rounded-full h-1.5 max-w-24'>
				<div
					className='bg-gradient-to-r from-yellow-500 to-yellow-300 h-1.5 rounded-full transition-all duration-1000'
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className='text-yellow-400 text-xs font-bold'>{rating}/10</span>
		</div>
	);
};

const PodiumCard = ({ item, rank, onClick, animDelay }) => {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		setTimeout(() => setVisible(true), animDelay);
	}, [animDelay]);

	const posterUrl = item?.poster_path
		? `https://image.tmdb.org/t/p/w300${item.poster_path}`
		: 'https://via.placeholder.com/300x450/1f2937/4b5563?text=N%2FA';

	const configs = {
		1: { size: 'w-36 h-52', border: 'border-yellow-400', glow: 'shadow-yellow-500/30', crown: '👑', label: 'text-white font-bold' },
		2: { size: 'w-28 h-40', border: 'border-gray-400', glow: 'shadow-gray-400/20', crown: '🥈', label: 'text-gray-300' },
		3: { size: 'w-28 h-40', border: 'border-amber-600', glow: 'shadow-amber-600/20', crown: '🥉', label: 'text-gray-300' },
	};
	const cfg = configs[rank];

	return (
		<div
			onClick={() => onClick(item)}
			className={`flex flex-col items-center cursor-pointer group transition-all duration-500 ${
				visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
			} ${rank === 1 ? '' : 'mt-8'}`}>
			<div className='text-2xl mb-2'>{cfg.crown}</div>
			<div className={`relative ${cfg.size} border-2 ${cfg.border} rounded-xl overflow-hidden shadow-2xl ${cfg.glow} group-hover:scale-105 transition-transform duration-200`}>
				<img
					src={posterUrl}
					alt={item?.title}
					className='w-full h-full object-cover'
					onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1f2937/4b5563?text=N%2FA'; }}
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />
				<div className='absolute bottom-2 left-2 right-2'>
					<StarBar rating={item?.vote_average || 0} />
				</div>
			</div>
			<p className={`text-xs mt-2 text-center max-w-28 truncate ${cfg.label}`}>{item?.title}</p>
		</div>
	);
};

const ListCard = ({ item, onClick, animDelay }) => {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		setTimeout(() => setVisible(true), animDelay);
	}, [animDelay]);

	const posterUrl = item.poster_path
		? `https://image.tmdb.org/t/p/w92${item.poster_path}`
		: 'https://via.placeholder.com/92x138/1f2937/4b5563?text=N%2FA';

	return (
		<div
			onClick={() => onClick(item)}
			className={`flex items-center gap-4 p-3 rounded-xl hover:bg-gray-700/50 cursor-pointer transition-all duration-300 group border border-transparent hover:border-gray-600 ${
				visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
			}`}>
			<RankBadge rank={item.rank} />
			<img
				src={posterUrl}
				alt={item.title}
				className='w-10 h-14 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform'
				onError={(e) => { e.target.src = 'https://via.placeholder.com/92x138/1f2937/4b5563?text=N%2FA'; }}
			/>
			<div className='flex-1 min-w-0'>
				<p className='text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors'>
					{item.title}
				</p>
				<p className='text-gray-500 text-xs'>{item.release_date ? new Date(item.release_date).getFullYear() : ''}</p>
				<StarBar rating={item.vote_average} />
			</div>
			<span className='text-gray-600 group-hover:text-blue-400 text-lg transition-colors'>›</span>
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
		loadTrending();
		setLastUpdated(new Date().toLocaleDateString('fr-FR', {
			weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
		}));
	}, []);

	const loadTrending = async () => {
		// Check weekly cache
		const weekKey = getWeekKey();
		const cached = localStorage.getItem(weekKey);
		if (cached) {
			try {
				const data = JSON.parse(cached);
				setMovies(data.movies || []);
				setSeries(data.series || []);
				setIsLoading(false);
				return;
			} catch (e) {}
		}
		// Clear old cache keys
		Object.keys(localStorage).forEach(k => {
			if (k.startsWith('trending_cache_') && k !== weekKey) {
				localStorage.removeItem(k);
			}
		});
		await fetchFromAPI(weekKey);
	};

	const fetchFromAPI = async (weekKey) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await fetch(`${API_BASE_URL}/trending/`);
			if (!response.ok) throw new Error('Erreur réseau');
			const data = await response.json();
			setMovies(data.movies || []);
			setSeries(data.series || []);
			// Cache for the week
			localStorage.setItem(weekKey || getWeekKey(), JSON.stringify(data));
		} catch (err) {
			setError('Impossible de charger le trending.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleItemClick = (item) => {
		// Pass data via state so MovieDetail can use it without loading
		navigate(`/movie/${item.id}`, {
			state: {
				mediaType: item.media_type,
				preloadedData: item,
			}
		});
	};

	const currentData = activeTab === 'movies' ? movies : series;
	const podium = currentData.slice(0, 3);
	const rest = currentData.slice(3);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<div className='relative w-20 h-20 mx-auto mb-6'>
						<div className='absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping' />
						<div className='absolute inset-2 border-4 border-blue-400 border-t-transparent rounded-full animate-spin' />
						<div className='absolute inset-0 flex items-center justify-center text-2xl'>🏆</div>
					</div>
					<p className='text-white text-xl font-semibold'>Chargement du Top 10...</p>
					<p className='text-gray-500 text-sm mt-2'>Récupération des données TMDB</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
				<div className='text-center bg-gray-800 p-8 rounded-2xl border border-gray-700'>
					<div className='text-5xl mb-4'>😕</div>
					<p className='text-red-400 text-lg font-semibold mb-2'>Erreur de chargement</p>
					<p className='text-gray-400 text-sm mb-6'>{error}</p>
					<button
						onClick={() => fetchFromAPI()}
						className='px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-semibold transition-colors'>
						🔄 Réessayer
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* Hero Banner */}
			<div className='relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-10 pb-8 px-6'>
				{/* Background decoration */}
				<div className='absolute inset-0 opacity-10'>
					<div className='absolute top-4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl' />
					<div className='absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl' />
				</div>
				<div className='relative max-w-3xl mx-auto text-center'>
					<div className='inline-flex items-center gap-2 bg-gray-800/60 border border-gray-700 px-4 py-1.5 rounded-full text-xs text-gray-400 mb-4'>
						<div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
						Mis à jour le {lastUpdated}
					</div>
					<h1 className='text-5xl font-black text-white mb-2 tracking-tight'>
						Top 10 <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'>de la Semaine</span>
					</h1>
					<p className='text-gray-400 text-sm'>Classement mis à jour automatiquement chaque semaine</p>
				</div>
			</div>

			{/* Tabs */}
			<div className='max-w-3xl mx-auto px-6 py-6'>
				<div className='flex gap-2 bg-gray-800 p-1 rounded-2xl w-fit mx-auto mb-10'>
					{[
						{ key: 'movies', icon: '🎬', label: 'Films' },
						{ key: 'series', icon: '📺', label: 'Séries' },
					].map(tab => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
								activeTab === tab.key
									? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105'
									: 'text-gray-400 hover:text-white'
							}`}>
							{tab.icon} {tab.label}
						</button>
					))}
				</div>

				{/* Podium Top 3 */}
				{podium.length >= 3 && (
					<div className='mb-10'>
						<h2 className='text-center text-gray-500 text-xs font-semibold uppercase tracking-widest mb-6'>
							Podium
						</h2>
						<div className='flex items-end justify-center gap-6'>
							<PodiumCard item={podium[1]} rank={2} onClick={handleItemClick} animDelay={200} />
							<PodiumCard item={podium[0]} rank={1} onClick={handleItemClick} animDelay={0} />
							<PodiumCard item={podium[2]} rank={3} onClick={handleItemClick} animDelay={400} />
						</div>
					</div>
				)}

				{/* Full Top 10 */}
				<div className='bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-700/50 flex items-center justify-between'>
						<h2 className='text-white font-bold'>
							{activeTab === 'movies' ? '🎬 Top 10 Films' : '📺 Top 10 Séries'}
						</h2>
						<span className='text-gray-500 text-xs'>Semaine en cours</span>
					</div>
					<div className='divide-y divide-gray-700/30'>
						{currentData.map((item, i) => (
							<ListCard
								key={item.id}
								item={item}
								rank={item.rank}
								onClick={handleItemClick}
								animDelay={i * 60}
							/>
						))}
					</div>
				</div>

				<p className='text-center text-gray-700 text-xs mt-6'>
					Données fournies par TMDB • Actualisées chaque semaine
				</p>
			</div>
		</div>
	);
};

export default Trending;
