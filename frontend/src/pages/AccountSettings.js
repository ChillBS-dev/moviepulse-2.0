import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Massive avatar collection - Netflix & Prime Video style
const AVATARS = [
	// Marvel Heroes
	{ id: 1, name: 'Iron Man', emoji: '🦾', color: 'bg-gradient-to-br from-red-600 to-yellow-500' },
	{ id: 2, name: 'Spider-Man', emoji: '🕷️', color: 'bg-gradient-to-br from-red-500 to-blue-600' },
	{ id: 3, name: 'Captain America', emoji: '🛡️', color: 'bg-gradient-to-br from-blue-600 to-red-500' },
	{ id: 4, name: 'Thor', emoji: '⚡', color: 'bg-gradient-to-br from-blue-700 to-gray-400' },
	{ id: 5, name: 'Hulk', emoji: '💪', color: 'bg-gradient-to-br from-green-600 to-green-800' },
	{ id: 6, name: 'Black Widow', emoji: '🕸️', color: 'bg-gradient-to-br from-black to-red-700' },
	{ id: 7, name: 'Black Panther', emoji: '🐾', color: 'bg-gradient-to-br from-purple-900 to-black' },
	{ id: 8, name: 'Doctor Strange', emoji: '🔮', color: 'bg-gradient-to-br from-red-700 to-orange-500' },
	{ id: 9, name: 'Deadpool', emoji: '💀', color: 'bg-gradient-to-br from-red-600 to-black' },
	{ id: 10, name: 'Ant-Man', emoji: '🐜', color: 'bg-gradient-to-br from-red-500 to-gray-700' },
	
	// DC Heroes
	{ id: 11, name: 'Batman', emoji: '🦇', color: 'bg-gradient-to-br from-gray-900 to-black' },
	{ id: 12, name: 'Superman', emoji: '💎', color: 'bg-gradient-to-br from-blue-600 to-red-600' },
	{ id: 13, name: 'Wonder Woman', emoji: '👑', color: 'bg-gradient-to-br from-red-600 to-yellow-500' },
	{ id: 14, name: 'Flash', emoji: '⚡', color: 'bg-gradient-to-br from-yellow-400 to-red-600' },
	{ id: 15, name: 'Aquaman', emoji: '🔱', color: 'bg-gradient-to-br from-blue-500 to-green-600' },
	{ id: 16, name: 'Joker', emoji: '🃏', color: 'bg-gradient-to-br from-purple-600 to-green-500' },
	{ id: 17, name: 'Harley Quinn', emoji: '💣', color: 'bg-gradient-to-br from-pink-500 to-blue-500' },
	
	// Star Wars
	{ id: 18, name: 'Darth Vader', emoji: '⚔️', color: 'bg-gradient-to-br from-black to-red-900' },
	{ id: 19, name: 'Yoda', emoji: '🧙', color: 'bg-gradient-to-br from-green-600 to-green-800' },
	{ id: 20, name: 'Stormtrooper', emoji: '🎯', color: 'bg-gradient-to-br from-white to-gray-300' },
	{ id: 21, name: 'BB-8', emoji: '⚙️', color: 'bg-gradient-to-br from-orange-400 to-white' },
	{ id: 22, name: 'Chewbacca', emoji: '🦁', color: 'bg-gradient-to-br from-amber-700 to-amber-900' },
	
	// Anime - Naruto Universe
	{ id: 23, name: 'Naruto', emoji: '🍜', color: 'bg-gradient-to-br from-orange-500 to-blue-500' },
	{ id: 24, name: 'Sasuke', emoji: '⚡', color: 'bg-gradient-to-br from-blue-900 to-purple-900' },
	{ id: 25, name: 'Sakura', emoji: '🌸', color: 'bg-gradient-to-br from-pink-400 to-red-400' },
	{ id: 26, name: 'Kakashi', emoji: '📖', color: 'bg-gradient-to-br from-gray-600 to-blue-600' },
	
	// One Piece
	{ id: 27, name: 'Luffy', emoji: '🏴‍☠️', color: 'bg-gradient-to-br from-red-600 to-yellow-400' },
	{ id: 28, name: 'Zoro', emoji: '⚔️', color: 'bg-gradient-to-br from-green-700 to-gray-700' },
	{ id: 29, name: 'Nami', emoji: '🍊', color: 'bg-gradient-to-br from-orange-400 to-blue-400' },
	{ id: 30, name: 'Chopper', emoji: '🦌', color: 'bg-gradient-to-br from-pink-400 to-blue-300' },
	
	// Dragon Ball
	{ id: 31, name: 'Goku', emoji: '💫', color: 'bg-gradient-to-br from-orange-600 to-blue-600' },
	{ id: 32, name: 'Vegeta', emoji: '👊', color: 'bg-gradient-to-br from-blue-800 to-yellow-500' },
	{ id: 33, name: 'Piccolo', emoji: '🐉', color: 'bg-gradient-to-br from-green-600 to-purple-700' },
	
	// Attack on Titan
	{ id: 34, name: 'Eren', emoji: '⚔️', color: 'bg-gradient-to-br from-green-700 to-red-700' },
	{ id: 35, name: 'Mikasa', emoji: '🗡️', color: 'bg-gradient-to-br from-red-800 to-black' },
	{ id: 36, name: 'Levi', emoji: '💨', color: 'bg-gradient-to-br from-gray-700 to-blue-700' },
	
	// Demon Slayer
	{ id: 37, name: 'Tanjiro', emoji: '🔥', color: 'bg-gradient-to-br from-green-600 to-black' },
	{ id: 38, name: 'Nezuko', emoji: '👹', color: 'bg-gradient-to-br from-pink-500 to-orange-600' },
	{ id: 39, name: 'Zenitsu', emoji: '⚡', color: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
	
	// My Hero Academia
	{ id: 40, name: 'Deku', emoji: '💚', color: 'bg-gradient-to-br from-green-500 to-green-700' },
	{ id: 41, name: 'Bakugo', emoji: '💥', color: 'bg-gradient-to-br from-orange-500 to-red-600' },
	{ id: 42, name: 'Todoroki', emoji: '❄️', color: 'bg-gradient-to-br from-blue-400 to-red-500' },
	
	// Studio Ghibli
	{ id: 43, name: 'Totoro', emoji: '🌳', color: 'bg-gradient-to-br from-gray-500 to-green-600' },
	{ id: 44, name: 'No-Face', emoji: '👤', color: 'bg-gradient-to-br from-black to-purple-900' },
	{ id: 45, name: 'Ponyo', emoji: '🐟', color: 'bg-gradient-to-br from-red-400 to-orange-400' },
	
	// Pokémon
	{ id: 46, name: 'Pikachu', emoji: '⚡', color: 'bg-gradient-to-br from-yellow-400 to-orange-400' },
	{ id: 47, name: 'Charizard', emoji: '🔥', color: 'bg-gradient-to-br from-orange-600 to-red-600' },
	{ id: 48, name: 'Mewtwo', emoji: '🧬', color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
	{ id: 49, name: 'Gengar', emoji: '👻', color: 'bg-gradient-to-br from-purple-800 to-purple-900' },
	
	// Harry Potter
	{ id: 50, name: 'Harry Potter', emoji: '⚡', color: 'bg-gradient-to-br from-red-700 to-yellow-600' },
	{ id: 51, name: 'Hermione', emoji: '📚', color: 'bg-gradient-to-br from-pink-400 to-purple-500' },
	{ id: 52, name: 'Voldemort', emoji: '🐍', color: 'bg-gradient-to-br from-green-800 to-black' },
	{ id: 53, name: 'Dobby', emoji: '🧦', color: 'bg-gradient-to-br from-gray-400 to-green-400' },
	
	// Game of Thrones
	{ id: 54, name: 'Dragon', emoji: '🐉', color: 'bg-gradient-to-br from-red-700 to-orange-600' },
	{ id: 55, name: 'Direwolf', emoji: '🐺', color: 'bg-gradient-to-br from-gray-600 to-gray-800' },
	{ id: 56, name: 'Night King', emoji: '❄️', color: 'bg-gradient-to-br from-blue-300 to-blue-900' },
	
	// Stranger Things
	{ id: 57, name: 'Demogorgon', emoji: '👾', color: 'bg-gradient-to-br from-red-900 to-black' },
	{ id: 58, name: 'Mind Flayer', emoji: '🕷️', color: 'bg-gradient-to-br from-red-800 to-purple-900' },
	
	// Pixar
	{ id: 59, name: 'Woody', emoji: '🤠', color: 'bg-gradient-to-br from-yellow-600 to-red-600' },
	{ id: 60, name: 'Buzz', emoji: '🚀', color: 'bg-gradient-to-br from-green-500 to-purple-600' },
	{ id: 61, name: 'Mike Wazowski', emoji: '👁️', color: 'bg-gradient-to-br from-green-400 to-green-600' },
	{ id: 62, name: 'WALL-E', emoji: '🤖', color: 'bg-gradient-to-br from-yellow-600 to-gray-600' },
	
	// The Matrix
	{ id: 63, name: 'Neo', emoji: '🕶️', color: 'bg-gradient-to-br from-black to-green-900' },
	{ id: 64, name: 'Agent Smith', emoji: '👔', color: 'bg-gradient-to-br from-gray-800 to-black' },
	
	// Misc Icons
	{ id: 65, name: 'Alien', emoji: '👽', color: 'bg-gradient-to-br from-green-500 to-green-700' },
	{ id: 66, name: 'Robot', emoji: '🤖', color: 'bg-gradient-to-br from-gray-500 to-blue-600' },
	{ id: 67, name: 'Ninja', emoji: '🥷', color: 'bg-gradient-to-br from-black to-red-900' },
	{ id: 68, name: 'Pirate', emoji: '☠️', color: 'bg-gradient-to-br from-black to-red-800' },
	{ id: 69, name: 'Wizard', emoji: '🧙‍♂️', color: 'bg-gradient-to-br from-purple-700 to-blue-700' },
	{ id: 70, name: 'Knight', emoji: '⚔️', color: 'bg-gradient-to-br from-gray-600 to-blue-700' },
];

const AccountSettings = () => {
	const [activeTab, setActiveTab] = useState('profile');
	const [loading, setLoading] = useState(false);
	const [searchAvatar, setSearchAvatar] = useState('');
	const navigate = useNavigate();
	const { logout } = useApp();

	const [profile, setProfile] = useState({
		first_name: '',
		last_name: '',
		email: '',
		avatar: 1,
	});

	const [passwordData, setPasswordData] = useState({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});

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
	const filteredAvatars = AVATARS.filter(a =>
		a.name.toLowerCase().includes(searchAvatar.toLowerCase())
	);

	return (
		<div className='min-h-screen bg-gray-900 py-8 px-4'>
			<div className='max-w-5xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-black text-white mb-2'>Mon Compte</h1>
					<p className='text-gray-400'>Gérez vos informations personnelles et paramètres</p>
				</div>

				{/* Tabs */}
				<div className='flex gap-2 mb-6 border-b border-gray-800'>
					{[
						{ key: 'profile', label: '👤 Profil' },
						{ key: 'security', label: '🔒 Sécurité' },
						{ key: 'settings', label: '⚙️ Paramètres' },
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
								<div className={`w-24 h-24 rounded-full ${selectedAvatar.color} flex items-center justify-center text-5xl shadow-2xl`}>
									{selectedAvatar.emoji}
								</div>
								<div>
									<p className='text-white font-semibold text-lg'>{selectedAvatar.name}</p>
									<p className='text-gray-400 text-sm'>Avatar actuel</p>
								</div>
							</div>

							{/* Search */}
							<input
								type='text'
								placeholder='🔍 Rechercher un avatar...'
								value={searchAvatar}
								onChange={(e) => setSearchAvatar(e.target.value)}
								className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4'
							/>

							{/* Grid */}
							<div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 max-h-96 overflow-y-auto pr-2'>
								{filteredAvatars.map(avatar => (
									<button
										key={avatar.id}
										onClick={() => setProfile({ ...profile, avatar: avatar.id })}
										title={avatar.name}
										className={`aspect-square rounded-xl ${avatar.color} flex items-center justify-center text-2xl transition-all shadow-lg ${
											profile.avatar === avatar.id
												? 'ring-4 ring-blue-500 scale-110'
												: 'hover:scale-105 opacity-80 hover:opacity-100'
										}`}>
										{avatar.emoji}
									</button>
								))}
							</div>
							
							{filteredAvatars.length === 0 && (
								<p className='text-center text-gray-500 py-8'>Aucun avatar trouvé</p>
							)}
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
										className={`relative w-14 h-7 rounded-full transition-colors ${
											settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
										}`}>
										<div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
											settings.notifications ? 'translate-x-7' : 'translate-x-1'
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
										className={`relative w-14 h-7 rounded-full transition-colors ${
											settings.emailUpdates ? 'bg-blue-600' : 'bg-gray-600'
										}`}>
										<div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
											settings.emailUpdates ? 'translate-x-7' : 'translate-x-1'
										}`} />
									</button>
								</div>

								<div>
									<label className='block text-sm font-semibold text-gray-400 mb-2'>Langue</label>
									<select
										value={settings.language}
										onChange={(e) => saveSettings({ ...settings, language: e.target.value })}
										className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'>
										<option value='fr'>Français 🇫🇷</option>
										<option value='en'>English 🇬🇧</option>
										<option value='es'>Español 🇪🇸</option>
										<option value='de'>Deutsch 🇩🇪</option>
										<option value='it'>Italiano 🇮🇹</option>
										<option value='ja'>日本語 🇯🇵</option>
									</select>
								</div>
							</div>
						</div>

						<div className='bg-gray-800 rounded-2xl p-6 border border-red-900/50'>
							<h2 className='text-red-400 font-bold text-xl mb-4'>Zone de danger</h2>

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
