import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

const TRANSLATIONS = {
	fr: { menu: 'Menu', trending: 'Trending', favorites: 'Favoris', reviews: 'Avis', account: 'Mon Compte', admin: 'Admin', comingSoon: 'Bientôt' },
	en: { menu: 'Menu', trending: 'Trending', favorites: 'Favorites', reviews: 'Reviews', account: 'My Account', admin: 'Admin', comingSoon: 'Soon' },
	es: { menu: 'Menú', trending: 'Trending', favorites: 'Favoritos', reviews: 'Reseñas', account: 'Mi Cuenta', admin: 'Admin', comingSoon: 'Pronto' },
};

const Sidebar = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [lang, setLang] = useState('fr');
	const [isAdmin, setIsAdmin] = useState(false);
	const location = useLocation();
	const { theme } = useApp();

	useEffect(() => {
		const savedLang = localStorage.getItem('appLanguage') || 'fr';
		setLang(savedLang);
		
		const adminStatus = localStorage.getItem('isAdmin') === 'true';
		setIsAdmin(adminStatus);
		
		const handleLangChange = () => {
			const newLang = localStorage.getItem('appLanguage') || 'fr';
			setLang(newLang);
		};
		
		const handleAdminChange = () => {
			const adminStatus = localStorage.getItem('isAdmin') === 'true';
			setIsAdmin(adminStatus);
		};
		
		window.addEventListener('storage', handleLangChange);
		window.addEventListener('storage', handleAdminChange);
		const interval = setInterval(() => {
			handleLangChange();
			handleAdminChange();
		}, 500);
		
		return () => {
			window.removeEventListener('storage', handleLangChange);
			window.removeEventListener('storage', handleAdminChange);
			clearInterval(interval);
		};
	}, []);

	const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
	
	const navItems = [
		{ path: '/home', icon: '🎬', label: t.menu },
		{ path: '/trending', icon: '🏆', label: t.trending },
		{ path: '/favorites', icon: '❤️', label: t.favorites },
		{ path: '/reviews', icon: '⭐', label: t.reviews, comingSoon: true },
	];

	const isActive = (path) => location.pathname === path;

	return (
		<div className={`fixed left-0 top-0 h-full ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r z-50 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
			<div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
				{!collapsed && (
					<div className='flex items-center gap-2'>
						<span className='text-2xl'>🎬</span>
						<span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-black text-lg tracking-tight`}>
							Movie<span className='text-blue-400'>Pulse</span>
						</span>
					</div>
				)}
				{collapsed && <span className='text-2xl mx-auto'>🎬</span>}
				<button onClick={() => setCollapsed(!collapsed)} className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors ml-auto text-lg`}>
					{collapsed ? '›' : '‹'}
				</button>
			</div>

			<nav className='flex-1 p-2 mt-2'>
				{navItems.map((item) => (
					<div key={item.path} className='mb-1 relative group'>
						{item.comingSoon ? (
							<div className={`flex items-center gap-3 px-3 py-3 rounded-xl opacity-40 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}>
								<span className='text-xl flex-shrink-0'>{item.icon}</span>
								{!collapsed && (
									<div className='flex items-center gap-2 flex-1'>
										<span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm font-medium`}>{item.label}</span>
										<span className={`text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} px-2 py-0.5 rounded-full`}>{t.comingSoon}</span>
									</div>
								)}
							</div>
						) : (
							<Link
								to={item.path}
								className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
									isActive(item.path) 
										? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
										: `${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
								}`}>
								<span className='text-xl flex-shrink-0'>{item.icon}</span>
								{!collapsed && <span className='text-sm font-medium'>{item.label}</span>}
								{collapsed && (
									<div className={`absolute left-14 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border shadow-xl z-50`}>
										<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{item.label}</span>
									</div>
								)}
							</Link>
						)}
					</div>
				))}
				
				{/* Admin Section */}
				{isAdmin && (
					<>
						<div className={`pt-4 pb-2 px-3 text-xs font-bold uppercase ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
							Admin
						</div>
						<Link
							to='/admin'
							className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
								isActive('/admin')
									? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
									: `${theme === 'dark' ? 'text-purple-400 hover:bg-purple-900/20' : 'text-purple-600 hover:bg-purple-100'}`
							}`}>
							<span className='text-xl'>👑</span>
							{!collapsed && <span className='text-sm font-medium'>{t.admin}</span>}
						</Link>
					</>
				)}
			</nav>

			<div className={`p-2 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
				<Link
					to='/account'
					className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
						isActive('/account') 
							? 'bg-blue-600 text-white' 
							: `${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
					}`}>
					<span className='text-xl'>👤</span>
					{!collapsed && <span className='text-sm font-medium'>{t.account}</span>}
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
