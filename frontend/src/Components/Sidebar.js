import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

const Sidebar = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useApp();

	const navItems = [
		{ path: '/home', icon: '🎬', label: 'Menu' },
		{ path: '/trending', icon: '🏆', label: 'Trending' },
		{ path: '/favorites', icon: '❤️', label: 'Favoris' },
		{ path: '/reviews', icon: '⭐', label: 'Avis', comingSoon: true },
	];

	const isActive = (path) => location.pathname === path;

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<div
			className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-50 flex flex-col transition-all duration-300 ${
				collapsed ? 'w-16' : 'w-56'
			}`}>

			{/* Logo */}
			<div className='flex items-center justify-between p-4 border-b border-gray-800'>
				{!collapsed && (
					<div className='flex items-center gap-2'>
						<span className='text-2xl'>🎬</span>
						<span className='text-white font-black text-lg tracking-tight'>
							Movie<span className='text-blue-400'>Pulse</span>
						</span>
					</div>
				)}
				{collapsed && <span className='text-2xl mx-auto'>🎬</span>}
				<button
					onClick={() => setCollapsed(!collapsed)}
					className='text-gray-400 hover:text-white transition-colors ml-auto text-lg'>
					{collapsed ? '›' : '‹'}
				</button>
			</div>

			{/* Nav Items */}
			<nav className='flex-1 p-2 mt-2'>
				{navItems.map((item) => (
					<div key={item.path} className='mb-1 relative group'>
						{item.comingSoon ? (
							<div className={`flex items-center gap-3 px-3 py-3 rounded-xl opacity-40 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}>
								<span className='text-xl flex-shrink-0'>{item.icon}</span>
								{!collapsed && (
									<div className='flex items-center gap-2 flex-1'>
										<span className='text-gray-500 text-sm font-medium'>{item.label}</span>
										<span className='text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full'>Bientôt</span>
									</div>
								)}
							</div>
						) : (
							<Link
								to={item.path}
								className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
									collapsed ? 'justify-center' : ''
								} ${
									isActive(item.path)
										? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
										: 'text-gray-400 hover:bg-gray-800 hover:text-white'
								}`}>
								<span className='text-xl flex-shrink-0'>{item.icon}</span>
								{!collapsed && <span className='text-sm font-medium'>{item.label}</span>}
								{/* Tooltip when collapsed */}
								{collapsed && (
									<div className='absolute left-14 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50'>
										{item.label}
									</div>
								)}
							</Link>
						)}
					</div>
				))}
			</nav>

			{/* Bottom : Account with submenu */}
			<div className='p-2 border-t border-gray-800 relative'>
				<button
					onClick={() => setShowAccountMenu(!showAccountMenu)}
					className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
						collapsed ? 'justify-center' : ''
					} ${
						isActive('/account')
							? 'bg-blue-600 text-white'
							: 'text-gray-400 hover:bg-gray-800 hover:text-white'
					}`}>
					<span className='text-xl'>👤</span>
					{!collapsed && (
						<div className='flex items-center justify-between flex-1'>
							<span className='text-sm font-medium'>Mon Compte</span>
							<span className={`text-xs transition-transform duration-200 ${showAccountMenu ? 'rotate-180' : ''}`}>▲</span>
						</div>
					)}
				</button>

				{/* Account submenu */}
				{showAccountMenu && (
					<div className={`${collapsed ? 'absolute left-16 bottom-0 w-48' : 'mt-1'} bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl`}>
						<Link
							to='/account'
							onClick={() => setShowAccountMenu(false)}
							className='flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm'>
							<span>⚙️</span>
							<span>Paramètres</span>
						</Link>
						<button
							onClick={handleLogout}
							className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm border-t border-gray-700'>
							<span>🚪</span>
							<span>Se déconnecter</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
