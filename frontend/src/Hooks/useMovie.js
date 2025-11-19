import { useEffect, useState } from 'react';
import { API_ENDPOINTS, apiClient } from '../services/api';
import { useApp } from '../Contexts/AppContext';

const useMovie = (searchQuery, currentPage) => {
	const [movies, setMovies] = useState([]);
	const { setLocalMovies } = useApp();
	const [isLoading, setIsLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const fetchMovies = async () => {
			setIsLoading(true);
			try {
				let data;
				
				// Check if it's a search query or category
				if (searchQuery && searchQuery.trim() !== '' && 
				    !['Movies', 'Series', 'Documentaries', 'Trending'].includes(searchQuery)) {
					// Search for specific movies
					data = await apiClient.get(API_ENDPOINTS.searchMovies, {
						query: searchQuery,
						page: currentPage,
					});
				} else {
					// Fetch by category or trending (top movies)
					const category = searchQuery === 'Trending' || searchQuery === 'Movies' 
						? 'movies' 
						: searchQuery.toLowerCase();
					
					if (category === 'movies' && searchQuery === 'Trending') {
						// Fetch top/trending movies
						data = await apiClient.get(API_ENDPOINTS.topMovies, {
							page: currentPage,
						});
					} else {
						// Fetch by category
						data = await apiClient.get(API_ENDPOINTS.moviesByCategory, {
							category: category,
							page: currentPage,
						});
					}
				}

				// Handle paginated response
				if (data.results) {
					setMovies(data.results);
					// also populate AppContext cache for client-side search
					try {
						setLocalMovies(Array.isArray(data.results) ? data.results : []);
					} catch (err) {
						// If AppContext isn't available for some reason, ignore
						// (useMovie is expected to be used within AppProvider)
						// console.warn('Could not set localMovies', err);
					}
					setTotalPages(data.total_pages || Math.ceil(data.count / 10));
				} else {
					setMovies([]);
					setLocalMovies && setLocalMovies([]);
					setTotalPages(0);
				}
			} catch (error) {
				console.error('Failed to fetch movies:', error);
				setMovies([]);
				setTotalPages(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, [searchQuery, currentPage, setLocalMovies]);

	return { movies, isLoading, totalPages };
};

export default useMovie;
