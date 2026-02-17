import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();

	const navItems = [
		{ path: '/home', icon: '🎬', label: 'Menu' },
		{ path: '/trending', icon: '🏆', label: 'Trending' },
		{ path: '/favorites', icon: '❤️', label: 'Favoris' },
		{ path: '/reviews', icon: '⭐', label: 'Avis', comingSoon: true },
	];

	const isActive = (path) => location.pathname === path;

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
					className='text-gray-400 hover:text-white transition-colors ml-auto'>
					{collapsed ? '→' : '←'}
				</button>
			</div>

			{/* Nav Items */}
			<nav className='flex-1 p-2 mt-2'>
				{navItems.map((item) => (
					<div key={item.path} className='mb-1'>
						{item.comingSoon ? (
							<div
								className={`flex items-center gap-3 px-3 py-3 rounded-xl opacity-40 cursor-not-allowed ${
									collapsed ? 'justify-center' : ''
								}`}>
								<span className='text-xl flex-shrink-0'>{item.icon}</span>
								{!collapsed && (
									<div className='flex items-center gap-2 flex-1'>
										<span className='text-gray-500 text-sm font-medium'>
											{item.label}
										</span>
										<span className='text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full'>
											Bientôt
										</span>
									</div>
								)}
							</div>
						) : (
							<Link
								to={item.path}
								className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
									collapsed ? 'justify-center' : ''
								} ${
									isActive(item.path)
										? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
										: 'text-gray-400 hover:bg-gray-800 hover:text-white'
								}`}>
								<span className='text-xl flex-shrink-0'>{item.icon}</span>
								{!collapsed && (
									<span className='text-sm font-medium'>{item.label}</span>
								)}
								{collapsed && (
									<div className='absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700'>
										{item.label}
									</div>
								)}
							</Link>
						)}
					</div>
				))}
			</nav>

			{/* Bottom : Account */}
			<div className='p-2 border-t border-gray-800'>
				<Link
					to='/account'
					className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
						collapsed ? 'justify-center' : ''
					} ${
						isActive('/account')
							? 'bg-blue-600 text-white'
							: 'text-gray-400 hover:bg-gray-800 hover:text-white'
					}`}>
					<span className='text-xl'>👤</span>
					{!collapsed && (
						<span className='text-sm font-medium'>Mon Compte</span>
					)}
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
