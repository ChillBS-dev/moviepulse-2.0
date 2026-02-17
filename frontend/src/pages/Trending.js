import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const GENRE_MAP = {
	28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie',
	80: 'Crime', 99: 'Documentaire', 18: 'Drame', 10751: 'Famille',
	14: 'Fantaisie', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
	9648: 'Mystère', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
	53: 'Thriller', 10752: 'Guerre', 37: 'Western',
	10759: 'Action & Aventure', 10762: 'Enfants', 10763: 'Actualités',
	10764: 'Réalité', 10765: 'Sci-Fi & Fantaisie', 10766: 'Soap',
	10767: 'Talk', 10768: 'Guerre & Politique',
};

const getWeekKey = () => {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 1);
	const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
	return `trending_v2_${now.getFullYear()}_w${week}`;
};

const RankNumber = ({ rank }) => {
	const colors = {
		1: 'text-blue-400',
		2: 'text-blue-300',
		3: 'text-blue-200',
	};
	return (
		<span className={`text-7xl font-black leading-none select-none ${colors[rank] || 'text-gray-600'} drop-shadow-2xl`}>
			{rank}
		</span>
	);
};

const GenreTag = ({ name }) => (
	<span className='text-xs px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10 backdrop-blur-sm'>
		{name}
	</span>
);

const TrendingCard = ({ item, onClick }) => {
	const [hovered, setHovered] = useState(false);
	const backdropUrl = item.backdrop_path
		? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
		: null;
	const posterUrl = item.poster_path
		? `https://image.tmdb.org/t/p/w92${item.poster_path}`
		: null;

	const genres = (item.genre_ids || [])
		.slice(0, 3)
		.map(id => GENRE_MAP[id])
		.filter(Boolean);

	const year = item.release_date ? new Date(item.release_date).getFullYear() : '';

	return (
		<div
			onClick={() => onClick(item)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className='relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-900/30'
			style={{ minHeight: '120px' }}>

			{/* Backdrop background */}
			{backdropUrl && (
				<div
					className='absolute inset-0 bg-cover bg-center transition-transform duration-500'
					style={{
						backgroundImage: `url(${backdropUrl})`,
						transform: hovered ? 'scale(1.03)' : 'scale(1)',
					}}
				/>
			)}
			{/* Dark overlay */}
			<div className={`absolute inset-0 transition-opacity duration-300 ${
				backdropUrl
					? 'bg-gradient-to-r from-gray-900/98 via-gray-900/85 to-gray-900/60'
					: 'bg-gray-800'
			}`} />

			{/* Blue left accent bar */}
			<div className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity duration-300 ${
				hovered ? 'opacity-100' : 'opacity-0'
			} bg-gradient-to-b from-blue-400 to-blue-600`} />

			{/* Content */}
			<div className='relative flex items-center gap-6 px-6 py-5'>
				{/* Rank */}
				<div className='flex-shrink-0 w-16 text-center'>
					<RankNumber rank={item.rank} />
				</div>

				{/* Poster (small) */}
				{posterUrl && (
					<div className='flex-shrink-0 hidden sm:block'>
						<img
							src={posterUrl}
							alt={item.title}
							className='w-12 h-16 object-cover rounded-lg shadow-xl'
						/>
					</div>
				)}

				{/* Info */}
				<div className='flex-1 min-w-0'>
					<h3 className={`font-bold text-lg truncate transition-colors duration-200 ${
						hovered ? 'text-blue-300' : 'text-white'
					}`}>
						{item.title}
					</h3>
					<div className='flex items-center gap-3 mt-1 mb-2'>
						{year && <span className='text-gray-500 text-xs'>{year}</span>}
						<div className='flex items-center gap-1'>
							<span className='text-yellow-400 text-xs'>★</span>
							<span className='text-yellow-400 text-xs font-bold'>{item.vote_average}/10</span>
						</div>
					</div>
					<div className='flex flex-wrap gap-1.5'>
						{genres.map(g => <GenreTag key={g} name={g} />)}
					</div>
				</div>

				{/* Right stats */}
				<div className='flex-shrink-0 text-right hidden md:block'>
					<div className='text-2xl font-black text-white'>
						{item.vote_count ? (item.vote_count >= 1000
							? `${(item.vote_count / 1000).toFixed(1)}k`
							: item.vote_count) : '—'}
					</div>
					<div className='text-blue-400 text-xs mt-0.5'>votes</div>
					<div className='text-lg font-bold text-white mt-2'>{item.vote_average}</div>
					<div className='text-blue-400 text-xs'>note moy.</div>
				</div>

				{/* Arrow */}
				<div className={`flex-shrink-0 text-2xl transition-all duration-200 ${
					hovered ? 'text-blue-400 translate-x-1' : 'text-gray-700'
				}`}>›</div>
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
	const navigate = useNavigate();

	useEffect(() => { loadTrending(); }, []);

	const loadTrending = async () => {
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
		Object.keys(localStorage).forEach(k => {
			if (k.startsWith('trending_v2_') && k !== weekKey) localStorage.removeItem(k);
		});
		await fetchFromAPI(weekKey);
	};

	const fetchFromAPI = async (weekKey) => {
		try {
			setIsLoading(true);
			setError(null);
			const res = await fetch(`${API_BASE_URL}/trending/`);
			if (!res.ok) throw new Error('Erreur réseau');
			const data = await res.json();
			setMovies(data.movies || []);
			setSeries(data.series || []);
			localStorage.setItem(weekKey || getWeekKey(), JSON.stringify(data));
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

	const currentData = activeTab === 'movies' ? movies : series;
	const avgRating = currentData.length
		? (currentData.reduce((s, i) => s + i.vote_average, 0) / currentData.length).toFixed(1)
		: '—';
	const totalVotes = currentData.reduce((s, i) => s + (i.vote_count || 0), 0);

	if (isLoading) {
		return (
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
	}

	if (error) {
		return (
			<div className='min-h-screen bg-black flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-5xl mb-4'>😕</p>
					<p className='text-red-400 text-lg font-bold mb-4'>{error}</p>
					<button onClick={() => fetchFromAPI()} className='px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500'>
						Réessayer
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-black'>
			{/* Hero */}
			<div className='relative flex flex-col items-center justify-center py-24 px-6 overflow-hidden'>
				{/* Background glow */}
				<div className='absolute inset-0'>
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl' />
				</div>
				<div className='relative text-center'>
					<h1 className='text-8xl font-black text-blue-400 leading-none tracking-tighter mb-4'
						style={{ textShadow: '0 0 80px rgba(96,165,250,0.5)' }}>
						TOP 10
					</h1>
					<p className='text-3xl font-black text-white uppercase tracking-widest mb-3'>
						{activeTab === 'movies' ? 'Films les plus populaires' : 'Séries les plus populaires'}
					</p>
					<p className='text-gray-400 text-base mb-10'>
						Sur les 7 derniers jours • Mis à jour chaque semaine
					</p>

					{/* Tabs */}
					<div className='flex gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-800 w-fit mx-auto'>
						{[
							{ key: 'movies', label: 'Films' },
							{ key: 'series', label: 'Séries' },
						].map(tab => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`px-10 py-3 rounded-xl font-bold text-base transition-all duration-200 ${
									activeTab === tab.key
										? 'bg-blue-600 text-white shadow-lg shadow-blue-900/60'
										: 'text-gray-400 hover:text-white'
								}`}>
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Stats bar */}
			<div className='grid grid-cols-2 md:grid-cols-4 border-t border-b border-gray-800/50 mb-12'>
				{[
					{ icon: '⚡', color: 'text-blue-400', label: 'Films classés', value: currentData.length },
					{ icon: '🗳️', color: 'text-purple-400', label: 'Total votes', value: totalVotes >= 1000 ? `${(totalVotes/1000).toFixed(0)}k` : totalVotes },
					{ icon: '⭐', color: 'text-yellow-400', label: 'Note moyenne', value: avgRating },
					{ icon: '📅', color: 'text-green-400', label: 'Semaine', value: `S${Math.ceil((new Date() - new Date(new Date().getFullYear(),0,1))/604800000)}` },
				].map((stat, i) => (
					<div key={i} className='flex flex-col items-center justify-center py-8 border-r border-gray-800/50 last:border-r-0'>
						<span className={`text-2xl mb-2 ${stat.color}`}>{stat.icon}</span>
						<span className={`text-xs uppercase tracking-widest mb-2 ${stat.color}`}>{stat.label}</span>
						<span className='text-4xl font-black text-white'>{stat.value}</span>
					</div>
				))}
			</div>

			{/* List */}
			<div className='max-w-5xl mx-auto px-6 pb-16 space-y-3'>
				{currentData.map(item => (
					<TrendingCard key={item.id} item={item} onClick={handleClick} />
				))}
			</div>

			<p className='text-center text-gray-800 text-xs pb-8'>
				Données fournies par TMDB • Actualisées chaque semaine
			</p>
		</div>
	);
};

export default Trending;
