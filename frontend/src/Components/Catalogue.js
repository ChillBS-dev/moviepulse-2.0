import React, { useState, useEffect } from 'react';
import Search from './UI/Search';
import Card from './UI/Card';
import Loading from './Loading';
import { useApp } from '../Contexts/AppContext';
import useMovie from '../Hooks/useMovie';

const TRANSLATIONS = {
	fr: { movies: 'Films', series: 'Séries', anime: 'Anime', results: 'résultats', noMovies: 'Aucun résultat trouvé', adjust: 'Essayez une autre recherche', previous: 'Précédent', next: 'Suivant', page: 'Page', of: 'sur' },
	en: { movies: 'Movies', series: 'Series', anime: 'Anime', results: 'results', noMovies: 'No results found', adjust: 'Try another search', previous: 'Previous', next: 'Next', page: 'Page', of: 'of' },
	es: { movies: 'Películas', series: 'Series', anime: 'Anime', results: 'resultados', noMovies: 'No se encontraron resultados', adjust: 'Prueba otra búsqueda', previous: 'Anterior', next: 'Siguiente', page: 'Página', of: 'de' },
};

function Catalogue() {
	const { setSearchQuery, searchQuery, theme } = useApp();
	const [currentPage, setCurrentPage] = useState(1);
	const [lang, setLang] = useState('fr');
	const { movies = [], isLoading, totalPages } = useMovie(searchQuery, currentPage);

	useEffect(() => {
		const savedLang = localStorage.getItem('appLanguage') || 'fr';
		setLang(savedLang);
		const handleLangChange = () => {
			const newLang = localStorage.getItem('appLanguage') || 'fr';
			setLang(newLang);
		};
		window.addEventListener('storage', handleLangChange);
		const interval = setInterval(handleLangChange, 500);
		return () => {
			window.removeEventListener('storage', handleLangChange);
			clearInterval(interval);
		};
	}, []);

	const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

	const handleClick = (val) => {
		setSearchQuery(val);
		setCurrentPage(1);
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<div className={`min-h-screen px-4 md:px-8 py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
			<div className='flex justify-start mb-8'>
				<nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-1 shadow-lg`}>
					<ul className='flex space-x-1'>
						<li
							onClick={() => handleClick('Movies')}
							className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
								searchQuery === 'Movies'
									? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
									: `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
							}`}>
							🎬 {t.movies}
						</li>
						<li
							onClick={() => handleClick('Series')}
							className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
								searchQuery === 'Series'
									? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
									: `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
							}`}>
							📺 {t.series}
						</li>
						<li
							onClick={() => handleClick('Anime')}
							className={`cursor-pointer px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
								searchQuery === 'Anime'
									? 'bg-pink-600 text-white shadow-lg shadow-pink-600/50'
									: `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
							}`}>
							⛩️ {t.anime}
						</li>
					</ul>
				</nav>
			</div>

			<div className='mb-8'>
				<Search />
			</div>

			<div className='mt-10 mb-6 flex items-center gap-3'>
				<h2 className={`font-bold text-3xl md:text-4xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{searchQuery}</h2>
				{!isLoading && movies.length > 0 && (
					<span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>({movies.length} {t.results})</span>
				)}
			</div>

			{isLoading ? (
				<Loading />
			) : (
				<>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
						{movies.length ? (
							movies.map((movie, index) => (
								<div key={movie.id} style={{ animationDelay: `${index * 50}ms` }}>
									<Card movie={movie} />
								</div>
							))
						) : (
							<div className='col-span-full flex flex-col items-center justify-center py-20'>
								<svg className={`w-24 h-24 mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' />
								</svg>
								<p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.noMovies}</p>
								<p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{t.adjust}</p>
							</div>
						)}
					</div>

					{movies.length > 0 && (
						<div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-8'>
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className={`${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'} px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border flex items-center gap-2 shadow-lg`}>
								<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
								</svg>
								{t.previous}
							</button>
							<div className={`flex items-center gap-2 px-6 py-3 rounded-lg border shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
								<span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.page}</span>
								<span className='text-blue-400 font-bold text-lg'>{currentPage}</span>
								<span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.of}</span>
								<span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalPages}</span>
							</div>
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'} px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border flex items-center gap-2 shadow-lg`}>
								{t.next}
								<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
								</svg>
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Catalogue;
