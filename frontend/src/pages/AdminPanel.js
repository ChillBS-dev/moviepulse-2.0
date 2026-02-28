import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://moviepulse-backend.onrender.com/api';

const AdminPanel = () => {
	const navigate = useNavigate();
	const { theme } = useApp();
	
	const [stats, setStats] = useState({
		total_users: 0,
		total_movies: 0,
		total_series: 0,
		total_reviews: 0,
		recent_users: []
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			const token = localStorage.getItem('accessToken');
			const res = await fetch(`${API_BASE_URL}/admin/stats/`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			
			if (res.ok) {
				const data = await res.json();
				setStats(data);
			} else if (res.status === 403 || res.status === 401) {
				// Pas admin ou non connecté
				navigate('/home');
			}
		} catch (err) {
			console.error('Error fetching stats:', err);
		} finally {
			setLoading(false);
		}
	};
	
	const statsDisplay = [
		{ icon: '👥', label: 'Utilisateurs', value: stats.total_users, color: 'from-blue-500 to-cyan-500' },
		{ icon: '🎬', label: 'Films', value: stats.total_movies, color: 'from-purple-500 to-pink-500' },
		{ icon: '📺', label: 'Séries', value: stats.total_series, color: 'from-green-500 to-emerald-500' },
		{ icon: '⭐', label: 'Avis', value: stats.total_reviews, color: 'from-yellow-500 to-orange-500' },
	];

	return (
		<div className='min-h-screen relative overflow-hidden'>
			{/* Animated Background - Cinema Style */}
			<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'>
				<div className='absolute inset-0'>
					<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse' />
					<div className='absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
					<div className='absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '2s' }} />
				</div>
			</div>

			{/* Content */}
			<div className='relative z-10 p-8'>
				<div className='max-w-7xl mx-auto'>
					{/* Header */}
					<div className='mb-8'>
						<div className='flex items-center gap-3 mb-2'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg'>
								👑
							</div>
							<h1 className='text-4xl font-black text-white'>Panneau Administrateur</h1>
						</div>
						<p className='text-gray-400'>Gérez votre plateforme MoviePulse</p>
					</div>

					{loading ? (
						<div className='flex items-center justify-center h-64'>
							<div className='text-white text-xl'>Chargement des statistiques...</div>
						</div>
					) : (
						<>
							{/* Stats Grid */}
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
								{statsDisplay.map((stat, i) => (
									<div key={i} className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform'>
										<div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
											{stat.icon}
										</div>
										<p className='text-gray-400 text-sm mb-1'>{stat.label}</p>
										<p className='text-white text-3xl font-black'>{stat.value.toLocaleString()}</p>
									</div>
								))}
							</div>

							{/* Recent Users */}
							<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8'>
								<h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
									<span>👥</span> Derniers utilisateurs inscrits
								</h3>
								<div className='space-y-3'>
									{stats.recent_users.length > 0 ? (
										stats.recent_users.map(user => (
											<div key={user.id} className='bg-white/5 rounded-xl p-4 flex items-center justify-between'>
												<div>
													<p className='text-white font-bold'>{user.first_name} {user.last_name}</p>
													<p className='text-gray-400 text-sm'>{user.email}</p>
												</div>
												<div className='text-right'>
													<p className='text-gray-300 text-sm'>{user.date_joined}</p>
												</div>
											</div>
										))
									) : (
										<p className='text-gray-400'>Aucun utilisateur</p>
									)}
								</div>
							</div>

							{/* Management Cards */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* Users Management */}
								<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
									<h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
										<span>👥</span> Gestion des utilisateurs
									</h3>
									<ul className='space-y-2 text-gray-300'>
										<li>• {stats.total_users} utilisateurs inscrits</li>
										<li>• Modifier les rôles</li>
										<li>• Bannir / Débannir</li>
										<li>• Statistiques détaillées</li>
									</ul>
								</div>

								{/* Content Management */}
								<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
									<h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
										<span>🎬</span> Gestion du contenu
									</h3>
									<ul className='space-y-2 text-gray-300'>
										<li>• {stats.total_movies} films disponibles</li>
										<li>• {stats.total_series} séries disponibles</li>
										<li>• Modérer les avis</li>
										<li>• Gérer les catégories</li>
									</ul>
								</div>

								{/* Reports */}
								<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
									<h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
										<span>⚠️</span> Signalements
									</h3>
									<ul className='space-y-2 text-gray-300'>
										<li>• Avis signalés</li>
										<li>• Contenus inappropriés</li>
										<li>• Spam détecté</li>
										<li>• Violations des règles</li>
									</ul>
								</div>

								{/* System */}
								<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
									<h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
										<span>⚙️</span> Système
									</h3>
									<ul className='space-y-2 text-gray-300'>
										<li>• Logs système</li>
										<li>• Paramètres globaux</li>
										<li>• Sauvegardes</li>
										<li>• Mises à jour</li>
									</ul>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminPanel;
