import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const GENRE_MAP = {
	28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
	80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Famille',
	14: 'Fantaisie', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
	9648: 'Mystère', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
	10752: 'Guerre', 37: 'Western', 10759: 'Action & Aventure',
	10765: 'Sci-Fi & Fantaisie', 10768: 'Guerre & Politique',
};

const getWeekKey = () => {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 1);
	const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
	return `trending_v4_${now.getFullYear()}_w${week}`;
};

const TABS = [
	{ key: 'movies', label: 'Films', icon: '🎬', activeBg: 'bg-blue-600', glow: 'rgba(96,165,250,0.4)' },
	{ key: 'series', label: 'Séries', icon: '📺', activeBg: 'bg-purple-600', glow: 'rgba(167,139,250,0.4)' },
	{ key: 'anime', label: 'Anime', icon: '⛩️', activeBg: 'bg-pink-600', glow: 'rgba(244,114,182,0.4)' },
];

const TITLE_COLOR = { movies: '#60a5fa', series: '#a78bfa', anime: '#f472b6' };

const GenreTag = ({ name }) => (
	<span className='text-xs px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10'>
		{name}
	</span>
);

const TrendingCard = ({ item, onClick }) => {
	const [hovered, setHovered] = useState(false);

	const backdropUrl = item.backdrop_path
		? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
		: null;
	const posterUrl = item.poster_path
		? `https://image.tmdb.org/t/p/w185${item.poster_path}`
		: null;

	const genres = (item.genre_ids || []).slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean);
	const year = item.release_date ? new Date(item.release_date).getFullYear() : '';
	const voteDisplay = item.vote_count >= 1000
		? `${(item.vote_count / 1000).toFixed(1)}k`
		: item.vote_count || '—';

	const rankColor = item.rank === 1
		? 'text-yellow-400'
		: item.rank === 2
		? 'text-gray-300'
		: item.rank === 3
		? 'text-amber-600'
		: 'text-gray-600';

	return (
		<div
			onClick={() => onClick(item)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className='relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-900/20 group'
			style={{ minHeight: '160px' }}>

			{/* Backdrop */}
			{backdropUrl && (
				<div
					className='absolute inset-0 bg-cover bg-center transition-transform duration-700'
					style={{
						backgroundImage: `url(${backdropUrl})`,
						transform: hovered ? 'scale(1.04)' : 'scale(1)',
					}}
				/>
			)}
			<div className={`absolute inset-0 transition-opacity duration-300 ${
				backdropUrl
					? 'bg-gradient-to-r from-gray-950/98 via-gray-900/88 to-gray-900/40'
					: 'bg-gray-800'
			}`} />

			{/* Left blue accent bar */}
			<div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

			{/* Content */}
			<div className='relative flex items-center gap-6 px-6 py-5'>

				{/* Rank */}
				<div className={`flex-shrink-0 w-14 text-center text-6xl font-black leading-none ${rankColor} drop-shadow-lg select-none`}>
					{item.rank}
				</div>

				{/* Poster - bigger and centered */}
				<div className='flex-shrink-0 flex items-center justify-center'>
					{posterUrl ? (
						<img
							src={posterUrl}
							alt={item.title}
							className='w-20 h-28 object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300 border border-white/10'
							onError={(e) => {
								e.target.style.display = 'none';
							}}
						/>
					) : (
						<div className='w-20 h-28 bg-gray-700 rounded-xl flex items-center justify-center border border-gray-600'>
							<span className='text-3xl'>🎬</span>
						</div>
					)}
				</div>

				{/* Info */}
				<div className='flex-1 min-w-0'>
					<h3 className={`font-bold text-xl truncate mb-1.5 transition-colors duration-200 ${hovered ? 'text-blue-300' : 'text-white'}`}>
						{item.title}
					</h3>
					<div className='flex items-center gap-3 mb-3'>
						{year && <span className='text-gray-500 text-sm'>{year}</span>}
						<span className='text-yellow-400 text-sm font-bold'>★ {item.vote_average}/10</span>
					</div>
					<div className='flex flex-wrap gap-1.5'>
						{genres.map(g => <GenreTag key={g} name={g} />)}
					</div>
				</div>

				{/* Right stats */}
				<div className='flex-shrink-0 text-right hidden lg:block min-w-28'>
					<div className='text-2xl font-black text-white'>{voteDisplay}</div>
					<div className='text-blue-400 text-xs mb-3'>votes</div>
					<div className='text-xl font-bold text-white'>{item.vote_average}</div>
					<div className='text-blue-400 text-xs'>note moy.</div>
				</div>

				{/* Arrow */}
				<div className={`flex-shrink-0 text-2xl transition-all duration-200 ${hovered ? 'text-blue-400 translate-x-1' : 'text-gray-700'}`}>›</div>
			</div>
		</div>
	);
};

const Trending = () => {
	const [data, setData] = useState({ movies: [], series: [], anime: [] });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('movies');
	const navigate = useNavigate();

	useEffect(() => { loadTrending(); }, []);

	const loadTrending = async () => {
		const weekKey = getWeekKey();
		const cached = localStorage.getItem(weekKey);
		if (cached) {
			try {
				setData(JSON.parse(cached));
				setIsLoading(false);
				return;
			} catch (e) {}
		}
		// Clear old cache
		Object.keys(localStorage).forEach(k => {
			if (k.startsWith('trending_') && k !== weekKey) localStorage.removeItem(k);
		});
		await fetchFromAPI(weekKey);
	};

	const fetchFromAPI = async (weekKey) => {
		try {
			setIsLoading(true);
			setError(null);
			const res = await fetch(`${API_BASE_URL}/trending/`);
			if (!res.ok) throw new Error('Erreur réseau');
			const result = await res.json();
			setData(result);
			localStorage.setItem(weekKey || getWeekKey(), JSON.stringify(result));
		} catch (err) {
			setError('Impossible de charger le trending.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleClick = (item) => {
		navigate(`/movie/${item.id}`, {
			state: { mediaType: item.media_type, preloadedData: item }
		});
	};

	const currentData = data[activeTab] || [];
	const activeTabInfo = TABS.find(t => t.key === activeTab);

	const avgRating = currentData.length
		? (currentData.reduce((s, i) => s + i.vote_average, 0) / currentData.length).toFixed(1)
		: '—';
	const totalVotes = currentData.reduce((s, i) => s + (i.vote_count || 0), 0);

	if (isLoading) return (
		<div className='min-h-screen bg-black flex items-center justify-center'>
			<div className='text-center'>
				<div className='relative w-20 h-20 mx-auto mb-6'>
					<div className='absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping' />
					<div className='absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
				</div>
				<p className='text-white text-xl font-bold'>Chargement du Top 10...</p>
				<p className='text-gray-600 text-sm mt-1'>Données TMDB en cours de récupération</p>
			</div>
		</div>
	);

	if (error) return (
		<div className='min-h-screen bg-black flex items-center justify-center'>
			<div className='text-center'>
				<p className='text-5xl mb-4'>😕</p>
				<p className='text-red-400 text-lg font-bold mb-4'>{error}</p>
				<button onClick={() => fetchFromAPI()} className='px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold'>
					Réessayer
				</button>
			</div>
		</div>
	);

	return (
		<div className='min-h-screen bg-black'>
			{/* Hero */}
			<div className='relative flex flex-col items-center justify-center py-24 px-6 overflow-hidden'>
				<div className='absolute inset-0'>
					<div
						className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl transition-all duration-500'
						style={{ backgroundColor: activeTabInfo?.glow || 'rgba(96,165,250,0.15)' }}
					/>
				</div>
				<div className='relative text-center'>
					<h1
						className='text-8xl font-black leading-none tracking-tighter mb-4 transition-colors duration-500'
						style={{
							color: TITLE_COLOR[activeTab],
							textShadow: `0 0 80px ${activeTabInfo?.glow}`,
						}}>
						TOP 10
					</h1>
					<p className='text-3xl font-black text-white uppercase tracking-widest mb-3'>
						{activeTab === 'movies' ? 'Films les plus populaires'
							: activeTab === 'series' ? 'Séries les plus populaires'
							: 'Animes les plus populaires'}
					</p>
					<p className='text-gray-500 text-sm mb-10'>
						Sur les 7 derniers jours • Mis à jour chaque semaine
					</p>

					{/* Tabs */}
					<div className='flex gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-800 w-fit mx-auto'>
						{TABS.map(tab => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 ${
									activeTab === tab.key
										? `${tab.activeBg} text-white shadow-lg scale-105`
										: 'text-gray-400 hover:text-white'
								}`}>
								{tab.icon} {tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 md:grid-cols-4 border-t border-b border-gray-800/50 mb-10'>
				{[
					{ icon: '🏆', label: 'Classés', value: currentData.length },
					{ icon: '🗳️', label: 'Total votes', value: totalVotes >= 1000 ? `${(totalVotes/1000).toFixed(0)}k` : totalVotes },
					{ icon: '⭐', label: 'Note moyenne', value: avgRating },
					{ icon: '📅', label: 'Semaine', value: `S${Math.ceil((new Date() - new Date(new Date().getFullYear(),0,1))/604800000)}` },
				].map((stat, i) => (
					<div key={i} className='flex flex-col items-center justify-center py-8 border-r border-gray-800/50 last:border-r-0'>
						<span className='text-2xl mb-1'>{stat.icon}</span>
						<span className='text-xs uppercase tracking-widest text-gray-500 mb-2'>{stat.label}</span>
						<span className='text-4xl font-black text-white'>{stat.value}</span>
					</div>
				))}
			</div>

			{/* Cards */}
			<div className='max-w-5xl mx-auto px-6 pb-16 space-y-3'>
				{currentData.length === 0 ? (
					<div className='text-center py-20'>
						<p className='text-5xl mb-4'>🎬</p>
						<p className='text-gray-500 text-lg'>Aucun contenu disponible</p>
					</div>
				) : (
					currentData.map(item => (
						<TrendingCard key={item.id} item={item} onClick={handleClick} />
					))
				)}
			</div>

			<p className='text-center text-gray-800 text-xs pb-8'>
				Données fournies par TMDB • Actualisées chaque semaine
			</p>
		</div>
	);
};

export default Trending;
