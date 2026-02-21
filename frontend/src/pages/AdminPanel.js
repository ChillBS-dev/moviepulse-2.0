import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

const AdminPanel = () => {
	const navigate = useNavigate();
	const { theme } = useApp();
	
	const stats = [
		{ icon: '👥', label: 'Utilisateurs', value: '1,234', color: 'from-blue-500 to-cyan-500' },
		{ icon: '🎬', label: 'Films', value: '45,678', color: 'from-purple-500 to-pink-500' },
		{ icon: '📺', label: 'Séries', value: '12,890', color: 'from-green-500 to-emerald-500' },
		{ icon: '⭐', label: 'Avis', value: '98,765', color: 'from-yellow-500 to-orange-500' },
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

					{/* Stats Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
						{stats.map((stat, i) => (
							<div key={i} className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-transform'>
								<div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
									{stat.icon}
								</div>
								<p className='text-gray-400 text-sm mb-1'>{stat.label}</p>
								<p className='text-white text-3xl font-black'>{stat.value}</p>
							</div>
						))}
					</div>

					{/* Management Cards */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Users Management */}
						<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
							<h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
								<span>👥</span> Gestion des utilisateurs
							</h3>
							<ul className='space-y-2 text-gray-300'>
								<li>• Voir tous les utilisateurs</li>
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
								<li>• Ajouter films/séries</li>
								<li>• Modifier les métadonnées</li>
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
				</div>
			</div>
		</div>
	);
};

export default AdminPanel;
