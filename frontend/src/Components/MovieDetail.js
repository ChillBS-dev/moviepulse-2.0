import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useMovie from '../Hooks/useMovie';
const BASE_URL = 'https://image.tmdb.org/t/p/w500';
const YOUR_API_KEY = process.env.REACT_APP_TMDB_apiKey;
function MovieDetail() {
	const { id } = useParams();
	const [movie, setMovie] = useState(null);
	const [trailer, setTrailer] = useState(null);
	const { movies } = useMovie('', 1); // You may fetch only one movie by ID here

	useEffect(() => {
		const fetchMovie = async () => {
			// Defensive guards: movies or trailer data may be undefined initially
			const movieArray = Array.isArray(movies) ? movies : [];
			const movieData = movieArray.find((m) => m.id === parseInt(id, 10));
			if (movieData) {
				setMovie(movieData);

				// Fetch trailer safely
				try {
					const trailerResponse = await fetch(
						`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${YOUR_API_KEY}&language=en-US`
					);
					const trailerData = await trailerResponse.json();
					const trailerResult = Array.isArray(trailerData?.results)
						? trailerData.results.find((video) => video.type === 'Trailer')
						: null;
					setTrailer(trailerResult);
				} catch (err) {
					console.warn('Failed to fetch trailer for movie', id, err);
					setTrailer(null);
				}
			}
		};
		fetchMovie();
	}, [id, movies]);

	if (!movie) return (
		<div className='min-h-screen bg-gray-900 flex items-center justify-center'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4'></div>
				<p className='text-gray-400 text-lg'>Loading movie details...</p>
			</div>
		</div>
	);

	return (
		<div className='min-h-screen bg-gray-900'>
			{/* Hero Section with Backdrop */}
			<div className='relative h-96 overflow-hidden'>
				<div 
					className='absolute inset-0 bg-cover bg-center'
					style={{
						backgroundImage: movie.backdrop_path 
							? `url(${BASE_URL}${movie.backdrop_path})` 
							: `url(${BASE_URL}${movie.poster_path})`,
					}}>
					<div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent'></div>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-7xl mx-auto px-4 md:px-8 -mt-64 relative z-10'>
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Poster */}
					<div className='flex-shrink-0'>
						<img
							src={`${BASE_URL}${movie.poster_path}`}
							alt={movie.title}
							className='w-full md:w-80 rounded-2xl shadow-2xl'
						/>
					</div>

					{/* Details */}
					<div className='flex-1 text-white space-y-6'>
						<div>
							<h1 className='text-4xl md:text-5xl font-bold mb-3'>{movie.title}</h1>
							<div className='flex flex-wrap items-center gap-4 text-gray-300'>
								<div className='flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-lg'>
									<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
										<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
									</svg>
									{movie.vote_average?.toFixed(1)}
								</div>
								<div className='flex items-center gap-2'>
									<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
										<path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
									</svg>
									{movie.release_date}
								</div>
							</div>
						</div>

						<div className='space-y-3'>
							<h2 className='text-2xl font-semibold text-blue-400'>Overview</h2>
							<p className='text-gray-300 text-lg leading-relaxed'>{movie.overview}</p>
						</div>

						{trailer && (
							<div className='space-y-4 pt-6'>
								<h2 className='text-2xl font-semibold text-blue-400'>Watch Trailer</h2>
								<div className='aspect-video rounded-xl overflow-hidden shadow-2xl'>
									<iframe
										className='w-full h-full'
										src={`https://www.youtube.com/embed/${trailer.key}`}
										title={`${movie.title} Trailer`}
										frameBorder='0'
										allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
										allowFullScreen></iframe>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MovieDetail;
