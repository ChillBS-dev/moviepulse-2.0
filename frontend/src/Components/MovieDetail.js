import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
const TMDB_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_LARGE = 'https://image.tmdb.org/t/p/original';

function MovieDetail() {
	const { id } = useParams();
	const location = useLocation();
	const [movie, setMovie] = useState(null);
	const [trailer, setTrailer] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('overview');

	// Comments state
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [userRating, setUserRating] = useState(0);
	const [hoveredStar, setHoveredStar] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	const isLoggedIn = !!localStorage.getItem('accessToken');
	const username = (() => {
		try {
			const token = localStorage.getItem('accessToken');
			if (!token) return 'Invité';
			return JSON.parse(atob(token.split('.')[1])).username || 'Utilisateur';
		} catch { return 'Utilisateur'; }
	})();

	useEffect(() => {
		fetchMovieDetails();
		loadComments();
	}, [id]);

	const fetchMovieDetails = async () => {
		try {
			setLoading(true);
			setError(null);

			// Try backend first
			const res = await fetch(`${API_BASE_URL}/movies/${id}/`);
			if (res.ok) {
				const data = await res.json();
				setMovie(data);
				// Fetch trailer from TMDB directly
				fetchTrailer(id);
				return;
			}
		} catch (e) {}

		// Fallback: try preloaded data from navigation state
		if (location.state?.preloadedData) {
			setMovie(location.state.preloadedData);
			fetchTrailer(id);
			setLoading(false);
			return;
		}

		setError('Impossible de charger les détails.');
		setLoading(false);
	};

	const fetchTrailer = async (movieId) => {
		try {
			const accessToken = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
			const headers = accessToken
				? { Authorization: `Bearer ${accessToken}` }
				: {};
			const res = await fetch(
				`https://api.themoviedb.org/3/movie/${movieId}/videos?language=fr-FR`,
				{ headers }
			);
			if (res.ok) {
				const data = await res.json();
				const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
					|| data.results?.[0];
				setTrailer(trailer || null);
			}
		} catch (e) {}
		finally { setLoading(false); }
	};

	// Comments stored in localStorage (no backend needed for now)
	const loadComments = () => {
		try {
			const stored = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
			setComments(stored);
		} catch { setComments([]); }
	};

	const submitComment = () => {
		if (!newComment.trim() || !userRating) return;
		setSubmitting(true);

		const comment = {
			id: Date.now(),
			username,
			text: newComment.trim(),
			rating: userRating,
			date: new Date().toLocaleDateString('fr-FR', {
				day: 'numeric', month: 'long', year: 'numeric'
			}),
		};

		const updated = [comment, ...comments];
		setComments(updated);
		localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
		setNewComment('');
		setUserRating(0);
		setSubmitting(false);
	};

	const avgRating = comments.length
		? (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
		: null;

	if (loading) return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
			<div className='text-center'>
				<div className='relative w-16 h-16 mx-auto mb-4'>
					<div className='absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping' />
					<div className='absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
				</div>
				<p className='text-gray-400 text-lg'>Chargement...</p>
			</div>
		</div>
	);

	if (error || !movie) return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
			<div className='text-center'>
				<p className='text-5xl mb-4'>😕</p>
				<p className='text-red-400 text-lg mb-4'>{error || 'Film introuvable'}</p>
				<button onClick={fetchMovieDetails} className='px-6 py-3 bg-blue-600 text-white rounded-xl'>
					Réessayer
				</button>
			</div>
		</div>
	);

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* Hero backdrop */}
			<div className='relative h-80 md:h-96 overflow-hidden'>
				{movie.backdrop_path && (
					<img
						src={`${TMDB_LARGE}${movie.backdrop_path}`}
						alt={movie.title}
						className='w-full h-full object-cover'
					/>
				)}
				<div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent' />
			</div>

			{/* Main content */}
			<div className='max-w-6xl mx-auto px-4 md:px-8 -mt-48 relative z-10'>
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Poster */}
					<div className='flex-shrink-0'>
						<img
							src={`${TMDB_BASE}${movie.poster_path}`}
							alt={movie.title}
							className='w-48 md:w-64 rounded-2xl shadow-2xl border border-gray-700'
							onError={(e) => { e.target.style.display = 'none'; }}
						/>
					</div>

					{/* Info */}
					<div className='flex-1 text-white pt-32 md:pt-24'>
						<h1 className='text-3xl md:text-5xl font-black mb-3'>{movie.title || movie.name}</h1>

						<div className='flex flex-wrap items-center gap-3 mb-4'>
							<span className='flex items-center gap-1 bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-lg text-sm'>
								★ {movie.vote_average?.toFixed(1)}
							</span>
							{movie.release_date && (
								<span className='text-gray-400 text-sm'>
									{new Date(movie.release_date).getFullYear()}
								</span>
							)}
							{avgRating && (
								<span className='flex items-center gap-1 bg-blue-600/30 border border-blue-500/50 text-blue-300 font-semibold px-3 py-1 rounded-lg text-sm'>
									💬 {avgRating}/5 ({comments.length} avis)
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className='flex gap-2 mt-8 mb-6 border-b border-gray-700'>
					{[
						{ key: 'overview', label: '📖 Description' },
						{ key: 'reviews', label: `💬 Avis (${comments.length})` },
						...(trailer ? [{ key: 'trailer', label: '🎬 Trailer' }] : []),
					].map(tab => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
								activeTab === tab.key
									? 'border-blue-500 text-blue-400'
									: 'border-transparent text-gray-400 hover:text-white'
							}`}>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab: Overview */}
				{activeTab === 'overview' && (
					<div className='max-w-3xl pb-16'>
						<h2 className='text-xl font-bold text-blue-400 mb-3'>Synopsis</h2>
						<p className='text-gray-300 text-base leading-relaxed'>
							{movie.overview || 'Aucune description disponible.'}
						</p>
					</div>
				)}

				{/* Tab: Trailer */}
				{activeTab === 'trailer' && trailer && (
					<div className='max-w-4xl pb-16'>
						<div className='aspect-video rounded-2xl overflow-hidden shadow-2xl'>
							<iframe
								className='w-full h-full'
								src={`https://www.youtube.com/embed/${trailer.key}`}
								title='Trailer'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen
							/>
						</div>
					</div>
				)}

				{/* Tab: Reviews */}
				{activeTab === 'reviews' && (
					<div className='max-w-3xl pb-16 space-y-8'>
						{/* Rating summary */}
						{comments.length > 0 && (
							<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center'>
								<p className='text-5xl font-black text-white mb-1'>{avgRating}<span className='text-2xl text-gray-500'>/5</span></p>
								<div className='flex justify-center gap-1 mb-2'>
									{[1,2,3,4,5].map(s => (
										<span key={s} className={`text-2xl ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
									))}
								</div>
								<p className='text-gray-400 text-sm'>{comments.length} avis de la communauté</p>
							</div>
						)}

						{/* Add comment */}
						{isLoggedIn ? (
							<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
								<h3 className='text-white font-bold text-lg mb-4'>Votre avis</h3>

								{/* Star rating */}
								<div className='flex gap-2 mb-4'>
									{[1,2,3,4,5].map(star => (
										<button
											key={star}
											onClick={() => setUserRating(star)}
											onMouseEnter={() => setHoveredStar(star)}
											onMouseLeave={() => setHoveredStar(0)}
											className={`text-3xl transition-transform hover:scale-110 ${
												star <= (hoveredStar || userRating) ? 'text-yellow-400' : 'text-gray-600'
											}`}>
											★
										</button>
									))}
									{userRating > 0 && (
										<span className='text-gray-400 text-sm self-center ml-2'>{userRating}/5</span>
									)}
								</div>

								<textarea
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									placeholder='Partagez votre avis sur ce film...'
									rows={4}
									className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-sm'
								/>

								<button
									onClick={submitComment}
									disabled={!newComment.trim() || !userRating || submitting}
									className='mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
									Publier mon avis
								</button>
							</div>
						) : (
							<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center'>
								<p className='text-gray-400 mb-3'>Connectez-vous pour laisser un avis</p>
								<a href='/' className='px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-500 inline-block'>
									Se connecter
								</a>
							</div>
						)}

						{/* Comments list */}
						{comments.length === 0 ? (
							<div className='text-center py-12'>
								<p className='text-5xl mb-3'>💬</p>
								<p className='text-gray-500'>Aucun avis pour l'instant. Soyez le premier !</p>
							</div>
						) : (
							<div className='space-y-4'>
								{comments.map(comment => (
									<div key={comment.id} className='bg-gray-800 rounded-2xl p-5 border border-gray-700'>
										<div className='flex items-center justify-between mb-3'>
											<div className='flex items-center gap-3'>
												<div className='w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm'>
													{comment.username[0]?.toUpperCase()}
												</div>
												<div>
													<p className='text-white font-semibold text-sm'>{comment.username}</p>
													<p className='text-gray-500 text-xs'>{comment.date}</p>
												</div>
											</div>
											<div className='flex gap-0.5'>
												{[1,2,3,4,5].map(s => (
													<span key={s} className={`text-sm ${s <= comment.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
												))}
											</div>
										</div>
										<p className='text-gray-300 text-sm leading-relaxed'>{comment.text}</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default MovieDetail;
