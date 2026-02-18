import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Avatar options - movie/series/anime characters style
const AVATARS = [
	{ id: 1, name: 'Iron Man', emoji: '🦾', color: 'bg-red-500' },
	{ id: 2, name: 'Spider-Man', emoji: '🕷️', color: 'bg-blue-500' },
	{ id: 3, name: 'Batman', emoji: '🦇', color: 'bg-gray-800' },
	{ id: 4, name: 'Wonder Woman', emoji: '👑', color: 'bg-yellow-500' },
	{ id: 5, name: 'Naruto', emoji: '🍜', color: 'bg-orange-500' },
	{ id: 6, name: 'Luffy', emoji: '🏴‍☠️', color: 'bg-red-600' },
	{ id: 7, name: 'Goku', emoji: '⚡', color: 'bg-orange-600' },
	{ id: 8, name: 'Sherlock', emoji: '🔍', color: 'bg-indigo-600' },
	{ id: 9, name: 'Joker', emoji: '🃏', color: 'bg-purple-600' },
	{ id: 10, name: 'Alien', emoji: '👽', color: 'bg-green-500' },
	{ id: 11, name: 'Pikachu', emoji: '⚡', color: 'bg-yellow-400' },
	{ id: 12, name: 'Totoro', emoji: '🌳', color: 'bg-green-600' },
];

const AccountSettings = () => {
	const [activeTab, setActiveTab] = useState('profile');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { logout } = useApp();

	// Profile state
	const [profile, setProfile] = useState({
		first_name: '',
		last_name: '',
		email: '',
		avatar: 1,
	});

	// Password state
	const [passwordData, setPasswordData] = useState({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});

	// Settings state
	const [settings, setSettings] = useState({
		notifications: true,
		emailUpdates: false,
		language: 'fr',
		theme: 'dark',
	});

	useEffect(() => {
		fetchProfile();
		loadSettings();
	}, []);

	const fetchProfile = async () => {
		try {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				navigate('/');
				return;
			}

			const res = await fetch(`${API_BASE_URL}/profile/`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.ok) {
				const data = await res.json();
				setProfile({
					first_name: data.first_name || '',
					last_name: data.last_name || '',
					email: data.email || '',
					avatar: data.avatar || 1,
				});
			}
		} catch (err) {
			console.error('Error fetching profile:', err);
		}
	};

	const loadSettings = () => {
		const saved = localStorage.getItem('userSettings');
		if (saved) {
			try {
				setSettings(JSON.parse(saved));
			} catch (e) {}
		}
	};

	const saveSettings = (newSettings) => {
		setSettings(newSettings);
		localStorage.setItem('userSettings', JSON.stringify(newSettings));
		toast.success('Paramètres sauvegardés');
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const token = localStorage.getItem('accessToken');
			const res = await fetch(`${API_BASE_URL}/profile/update/`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					first_name: profile.first_name,
					last_name: profile.last_name,
					avatar: profile.avatar,
				}),
			});

			if (res.ok) {
				toast.success('Profil mis à jour !');
			} else {
				toast.error('Erreur lors de la mise à jour');
			}
		} catch (err) {
			toast.error('Erreur de connexion');
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();

		if (passwordData.new_password !== passwordData.confirm_password) {
			toast.error('Les mots de passe ne correspondent pas');
			return;
		}

		if (passwordData.new_password.length < 8) {
			toast.error('Le mot de passe doit contenir au moins 8 caractères');
			return;
		}

		setLoading(true);

		try {
			const token = localStorage.getItem('accessToken');
			const res = await fetch(`${API_BASE_URL}/change-password/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					old_password: passwordData.old_password,
					new_password: passwordData.new_password,
				}),
			});

			if (res.ok) {
				toast.success('Mot de passe changé avec succès !');
				setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
			} else {
				const data = await res.json();
				toast.error(data.error || 'Erreur lors du changement');
			}
		} catch (err) {
			toast.error('Erreur de connexion');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const selectedAvatar = AVATARS.find(a => a.id === profile.avatar) || AVATARS[0];

	return (
		<div className='min-h-screen bg-gray-900 py-8 px-4'>
			<div className='max-w-4xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-black text-white mb-2'>Mon Compte</h1>
					<p className='text-gray-400'>Gérez vos informations personnelles et paramètres</p>
				</div>

				{/* Tabs */}
				<div className='flex gap-2 mb-6 border-b border-gray-800'>
					{[
						{ key: 'profile', label: '👤 Profil', icon: '👤' },
						{ key: 'security', label: '🔒 Sécurité', icon: '🔒' },
						{ key: 'settings', label: '⚙️ Paramètres', icon: '⚙️' },
					].map(tab => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-6 py-3 font-semibold transition-all border-b-2 -mb-px ${
								activeTab === tab.key
									? 'border-blue-500 text-blue-400'
									: 'border-transparent text-gray-400 hover:text-white'
							}`}>
							{tab.label}
						</button>
					))}
				</div>

				{/* Profile Tab */}
				{activeTab === 'profile' && (
					<div className='space-y-6'>
						{/* Avatar Selection */}
						<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
							<h2 className='text-white font-bold text-xl mb-4'>Avatar</h2>
							<div className='flex items-center gap-6 mb-6'>
								<div className={`w-24 h-24 rounded-full ${selectedAvatar.color} flex items-center justify-center text-5xl`}>
									{selectedAvatar.emoji}
								</div>
								<div>
									<p className='text-white font-semibold text-lg'>{selectedAvatar.name}</p>
									<p className='text-gray-400 text-sm'>Avatar actuel</p>
								</div>
							</div>

							<div className='grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3'>
								{AVATARS.map(avatar => (
									<button
										key={avatar.id}
										onClick={() => setProfile({ ...profile, avatar: avatar.id })}
										className={`w-full aspect-square rounded-xl ${avatar.color} flex items-center justify-center text-2xl transition-all ${
											profile.avatar === avatar.id
												? 'ring-4 ring-blue-500 scale-110'
												: 'hover:scale-105 opacity-70 hover:opacity-100'
										}`}>
										{avatar.emoji}
									</button>
								))}
							</div>
						</div>

						{/* Profile Info */}
						<form onSubmit={handleProfileUpdate} className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
							<h2 className='text-white font-bold text-xl mb-4'>Informations</h2>

							<div className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-semibold text-gray-400 mb-2'>Prénom</label>
										<input
											type='text'
											value={profile.first_name}
											onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
											className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
										/>
									</div>
									<div>
										<label className='block text-sm font-semibold text-gray-400 mb-2'>Nom</label>
										<input
											type='text'
											value={profile.last_name}
											onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
											className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
										/>
									</div>
								</div>

								<div>
									<label className='block text-sm font-semibold text-gray-400 mb-2'>Email</label>
									<input
										type='email'
										value={profile.email}
										disabled
										className='w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed'
									/>
									<p className='text-xs text-gray-500 mt-1'>L'email ne peut pas être modifié</p>
								</div>

								<button
									type='submit'
									disabled={loading}
									className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
									{loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Security Tab */}
				{activeTab === 'security' && (
					<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
						<h2 className='text-white font-bold text-xl mb-4'>Changer le mot de passe</h2>

						<form onSubmit={handlePasswordChange} className='space-y-4'>
							<div>
								<label className='block text-sm font-semibold text-gray-400 mb-2'>Mot de passe actuel</label>
								<input
									type='password'
									value={passwordData.old_password}
									onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
									className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
									required
								/>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-400 mb-2'>Nouveau mot de passe</label>
								<input
									type='password'
									value={passwordData.new_password}
									onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
									className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
									required
								/>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-400 mb-2'>Confirmer le mot de passe</label>
								<input
									type='password'
									value={passwordData.confirm_password}
									onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
									className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
									required
								/>
							</div>

							<button
								type='submit'
								disabled={loading}
								className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors'>
								{loading ? 'Changement en cours...' : 'Changer le mot de passe'}
							</button>
						</form>
					</div>
				)}

				{/* Settings Tab */}
				{activeTab === 'settings' && (
					<div className='space-y-6'>
						<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
							<h2 className='text-white font-bold text-xl mb-4'>Préférences</h2>

							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-white font-semibold'>Notifications</p>
										<p className='text-gray-400 text-sm'>Recevoir des notifications sur l'activité</p>
									</div>
									<button
										onClick={() => saveSettings({ ...settings, notifications: !settings.notifications })}
										className={`w-12 h-6 rounded-full transition-colors ${
											settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
										}`}>
										<div className={`w-5 h-5 bg-white rounded-full transition-transform ${
											settings.notifications ? 'translate-x-6' : 'translate-x-1'
										}`} />
									</button>
								</div>

								<div className='flex items-center justify-between'>
									<div>
										<p className='text-white font-semibold'>Emails</p>
										<p className='text-gray-400 text-sm'>Recevoir des emails de mise à jour</p>
									</div>
									<button
										onClick={() => saveSettings({ ...settings, emailUpdates: !settings.emailUpdates })}
										className={`w-12 h-6 rounded-full transition-colors ${
											settings.emailUpdates ? 'bg-blue-600' : 'bg-gray-600'
										}`}>
										<div className={`w-5 h-5 bg-white rounded-full transition-transform ${
											settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
										}`} />
									</button>
								</div>

								<div>
									<label className='block text-sm font-semibold text-gray-400 mb-2'>Langue</label>
									<select
										value={settings.language}
										onChange={(e) => saveSettings({ ...settings, language: e.target.value })}
										className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'>
										<option value='fr'>Français</option>
										<option value='en'>English</option>
										<option value='es'>Español</option>
									</select>
								</div>
							</div>
						</div>

						<div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
							<h2 className='text-white font-bold text-xl mb-4 text-red-400'>Zone de danger</h2>

							<button
								onClick={handleLogout}
								className='w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-500 transition-colors flex items-center justify-center gap-2'>
								🚪 Se déconnecter
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AccountSettings;
