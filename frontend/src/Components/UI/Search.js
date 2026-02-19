import React, { useState, useEffect } from 'react';
import { useApp } from '../../Contexts/AppContext';

const TRANSLATIONS = {
	fr: { placeholder: 'Rechercher des films, séries, animes...' },
	en: { placeholder: 'Search movies, series, anime...' },
	es: { placeholder: 'Buscar películas, series, anime...' },
};

const Search = () => {
	const { setSearchQuery, theme } = useApp();
	const [searchTerm, setSearchTerm] = useState('');
	const [lang, setLang] = useState('fr');

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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			setSearchQuery(searchTerm);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='w-full max-w-2xl'>
			<div className='relative'>
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder={t.placeholder}
					className={`w-full ${
						theme === 'dark'
							? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
							: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
					} border rounded-xl px-6 py-4 pr-12 focus:outline-none focus:border-blue-500 transition-colors`}
				/>
				<button
					type='submit'
					className='absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors'>
					<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
					</svg>
				</button>
			</div>
		</form>
	);
};

export default Search;
