import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
const ADMIN_CODE = 'MOVIEPULSE2026ADMIN';

// Real Netflix/Prime/Disney avatars
const AVATARS = {
	netflix: [
		{ id: 1, name: 'Naruto', url: 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa70kXOvmXTqCpTUGF1t5EuYWqZ3qHsZx7_zb68.png' },
		{ id: 2, name: 'Luffy', url: 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkwp_KinCFPSak2SL7MOCTyHG-2yIrXRr0KPovZmrqCDuQCOLHiJO5LrCXFd_zFqPMp_kx7D3Y-1jR5TkI.png' },
		{ id: 3, name: 'Goku', url: 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABZ5VNQWiMVRdZ7zSRkRz5JKhIaP1c_bZbE8RyHQNVHb5nvh0Z9XqJrFxPvCBxU3iGQMqPwz4uT7X0kn3DbU_.png' },
		{ id: 4, name: 'Eren', url: 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABYqKXYGNGOTZpzHBWU63J8HPBMhvS3hMKQBw4TqRqNa4jL8WHuCkUQRv1ZTF5Z-qE7xNv7dTNLzClLQxCHoP.png' },
		{ id: 5, name: 'Tanjiro', url: 'https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABR1xOvfqJ9Z9uQqQ8y6Lz-hN5c6nCcgLxEXa1G4nD1ZkPj7VzDfHnQJxWdQRQp7lp6NQZK5K5p6NQ1xOvfqJ.png' },
	],
	prime: [
		{ id: 6, name: 'Iron Man', url: 'https://m.media-amazon.com/images/G/01/digital/video/avod/avatar/Avatar_01._CB1198675309_.png' },
		{ id: 7, name: 'Spider-Man', url: 'https://m.media-amazon.com/images/G/01/digital/video/avod/avatar/Avatar_02._CB1198675309_.png' },
		{ id: 8, name: 'Batman', url: 'https://m.media-amazon.com/images/G/01/digital/video/avod/avatar/Avatar_03._CB1198675309_.png' },
		{ id: 9, name: 'Wonder Woman', url: 'https://m.media-amazon.com/images/G/01/digital/video/avod/avatar/Avatar_04._CB1198675309_.png' },
		{ id: 10, name: 'Superman', url: 'https://m.media-amazon.com/images/G/01/digital/video/avod/avatar/Avatar_05._CB1198675309_.png' },
	],
	disney: [
		{ id: 11, name: 'Mickey', url: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/1E03C12ACDE1D5E45BB938FB8A3B2C7EA0C797AD3D02756E3FF0109F84471854' },
		{ id: 12, name: 'Elsa', url: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/87F1DCF36049558159913ADFD18A800DE1121771540033EC3A7C1B607EABE122' },
		{ id: 13, name: 'Simba', url: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/5D8BF3E5B6E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8' },
		{ id: 14, name: 'Stitch', url: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/8E8BF3E5B6E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8' },
		{ id: 15, name: 'Grogu', url: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/9F9BF3E5B6E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8D5E8B5A8' },
	],
};

const ALL_AVATARS = [...AVATARS.netflix, ...AVATARS.prime, ...AVATARS.disney];

const TRANSLATIONS = {
	fr: {
		back: '← Retour',
		editProfile: 'Modifier le profil',
		editProfileDesc: 'Personnalise ton expérience MoviePulse',
		adultProfile: 'Profil adulte',
		modifyBtn: 'Modifier',
		chooseAvatar: 'Choisis ton avatar',
		pseudo: 'Pseudo',
		save: 'Enregistrer',
		cancel: 'Annuler',
		updatePassword: 'Mot de passe',
		modifyPassword: 'Modifier ton mot de passe',
		currentPassword: 'Mot de passe actuel',
		newPassword: 'Nouveau mot de passe',
		confirmPassword: 'Confirmer',
		update: 'Mettre à jour',
		readingPreferences: 'Lecture',
		configureOptions: 'Configure tes options',
		notifications: 'Notifications',
		receiveNotif: 'Recevoir des notifications',
		language: 'Langue',
		theme: 'Thème',
		dark: 'Sombre',
		light: 'Clair',
		adminCode: 'Code Admin',
		enterCode: 'Code administrateur',
		validate: 'Valider',
		adminPanel: 'Panneau Admin',
		logout: 'Déconnexion',
	},
	en: {
		back: '← Back',
		editProfile: 'Edit profile',
		editProfileDesc: 'Customize your MoviePulse experience',
		adultProfile: 'Adult profile',
		modifyBtn: 'Edit',
		chooseAvatar: 'Choose your avatar',
		pseudo: 'Username',
		save: 'Save',
		cancel: 'Cancel',
		updatePassword: 'Password',
		modifyPassword: 'Change your password',
		currentPassword: 'Current password',
		newPassword: 'New password',
		confirmPassword: 'Confirm',
		update: 'Update',
		readingPreferences: 'Reading',
		configureOptions: 'Configure options',
		notifications: 'Notifications',
		receiveNotif: 'Receive notifications',
		language: 'Language',
		theme: 'Theme',
		dark: 'Dark',
		light: 'Light',
		adminCode: 'Admin Code',
		enterCode: 'Admin code',
		validate: 'Validate',
		adminPanel: 'Admin Panel',
		logout: 'Logout',
	},
	es: {
		back: '← Volver',
		editProfile: 'Editar perfil',
		editProfileDesc: 'Personaliza tu experiencia MoviePulse',
		adultProfile: 'Perfil adulto',
		modifyBtn: 'Editar',
		chooseAvatar: 'Elige tu avatar',
		pseudo: 'Usuario',
		save: 'Guardar',
		cancel: 'Cancelar',
		updatePassword: 'Contraseña',
		modifyPassword: 'Cambia tu contraseña',
		currentPassword: 'Contraseña actual',
		newPassword: 'Nueva contraseña',
		confirmPassword: 'Confirmar',
		update: 'Actualizar',
		readingPreferences: 'Lectura',
		configureOptions: 'Configura opciones',
		notifications: 'Notificaciones',
		receiveNotif: 'Recibir notificaciones',
		language: 'Idioma',
		theme: 'Tema',
		dark: 'Oscuro',
		light: 'Claro',
		adminCode: 'Código Admin',
		enterCode: 'Código admin',
		validate: 'Validar',
		adminPanel: 'Panel Admin',
		logout: 'Cerrar sesión',
	},
};

const AccountSettings = () => {
	const [showEditModal, setShowEditModal] = useState(false);
	const [avatarTab, setAvatarTab] = useState('netflix');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { logout, theme, setTheme } = useApp();

	const [lang, setLang] = useState(() => localStorage.getItem('appLanguage') || 'fr');
	const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

	const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
	const [adminInput, setAdminInput] = useState('');

	const [profile, setProfile] = useState({ pseudo: '', email: '', avatar: 1 });
	const [editForm, setEditForm] = useState({ pseudo: '', avatar: 1 });
	const [settings, setSettings] = useState({ notifications: true });

	useEffect(() => {
		fetchProfile();
		loadSettings();
	}, []);

	useEffect(() => {
		localStorage.setItem('appLanguage', lang);
		window.dispatchEvent(new Event('storage'));
	}, [lang]);

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
				const pseudo = data.first_name || data.email?.split('@')[0] || 'Utilisateur';
				setProfile({ pseudo, email: data.email || '', avatar: data.avatar || 1 });
				setEditForm({ pseudo, avatar: data.avatar || 1 });
			}
		} catch (err) {
			console.error('Error:', err);
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
		toast.success('✅ Paramètres sauvegardés');
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
					first_name: editForm.pseudo,
					avatar: editForm.avatar,
				}),
			});

			if (res.ok) {
				setProfile({ ...profile, ...editForm });
				setShowEditModal(false);
				toast.success('✅ Profil mis à jour !');
			} else {
				toast.error('❌ Erreur');
			}
		} catch (err) {
			toast.error('❌ Erreur de connexion');
		} finally {
			setLoading(false);
		}
	};

	const handleAdminCode = () => {
		if (adminInput === ADMIN_CODE) {
			setIsAdmin(true);
			localStorage.setItem('isAdmin', 'true');
			toast.success('🎉 Accès Admin activé !');
			setAdminInput('');
		} else {
			toast.error('❌ Code incorrect');
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const selectedAvatar = ALL_AVATARS.find(a => a.id === profile.avatar) || ALL_AVATARS[0];

	return (
		<div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100'} p-8 relative overflow-hidden`}>
			{/* Animated background */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
				<div className='absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
			</div>

			<div className='max-w-7xl mx-auto relative z-10'>
				{/* Header */}
				<Link to='/home' className={`inline-flex items-center gap-2 mb-6 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
					{t.back}
				</Link>

				<h1 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.editProfile}</h1>
				<p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8`}>{t.editProfileDesc}</p>

				{/* Profile Card */}
				<div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-6 border mb-6 shadow-2xl`}>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<div className='relative'>
								<img
									src={selectedAvatar.url}
									alt={profile.pseudo}
									className='w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/50'
									onError={(e) => { e.target.src = 'https://via.placeholder.com/80/1f2937/4b5563?text=Avatar'; }}
								/>
								<div className='absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse' />
							</div>
							<div>
								<p className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{profile.pseudo}</p>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.adultProfile}</p>
							</div>
						</div>

						<button
							onClick={() => setShowEditModal(true)}
							className='px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105'>
							{t.modifyBtn}
						</button>
					</div>
				</div>

				{/* Grid Layout */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
					{/* Password Card */}
					<div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer`}>
						<div className='flex items-start gap-4'>
							<div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg'>
								🔒
							</div>
							<div className='flex-1'>
								<h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.updatePassword}</h3>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.modifyPassword}</p>
							</div>
						</div>
					</div>

					{/* Reading Preferences */}
					<div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer`}>
						<div className='flex items-start gap-4'>
							<div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg'>
								▶️
							</div>
							<div className='flex-1'>
								<h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.readingPreferences}</h3>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.configureOptions}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Settings Card */}
				<div className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl mb-6`}>
					<h3 className={`font-bold text-xl mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>⚙️ Paramètres</h3>

					<div className='space-y-6'>
						{/* Notifications */}
						<div className='flex items-center justify-between'>
							<div>
								<p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.notifications}</p>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.receiveNotif}</p>
							</div>
							<button
								onClick={() => saveSettings({ ...settings, notifications: !settings.notifications })}
								className={`relative w-16 h-8 rounded-full transition-all ${settings.notifications ? 'bg-gradient-to-r from-blue-500 to-purple-500' : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}`}>
								<div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${settings.notifications ? 'translate-x-8' : 'translate-x-1'}`} />
							</button>
						</div>

						{/* Language */}
						<div>
							<label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.language}</label>
							<select
								value={lang}
								onChange={(e) => setLang(e.target.value)}
								className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all`}>
								<option value='fr'>Français 🇫🇷</option>
								<option value='en'>English 🇬🇧</option>
								<option value='es'>Español 🇪🇸</option>
							</select>
						</div>

						{/* Theme */}
						<div>
							<label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.theme}</label>
							<select
								value={theme}
								onChange={(e) => setTheme(e.target.value)}
								className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all`}>
								<option value='dark'>{t.dark} 🌙</option>
								<option value='light'>{t.light} ☀️</option>
							</select>
						</div>
					</div>
				</div>

				{/* Admin Code */}
				{!isAdmin && (
					<div className={`${theme === 'dark' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-100 border-purple-300'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl mb-6`}>
						<h3 className={`font-bold mb-3 text-purple-400`}>👑 {t.adminCode}</h3>
						<div className='flex gap-2'>
							<input
								type='text'
								value={adminInput}
								onChange={(e) => setAdminInput(e.target.value)}
								placeholder={t.enterCode}
								className={`flex-1 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-purple-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50`}
							/>
							<button
								onClick={handleAdminCode}
								className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all'>
								{t.validate}
							</button>
						</div>
					</div>
				)}

				{/* Admin Panel */}
				{isAdmin && (
					<div className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 mb-6 shadow-2xl'>
						<h3 className='text-purple-300 font-bold text-xl mb-3'>👑 {t.adminPanel}</h3>
						<p className='text-purple-200 text-sm'>Fonctionnalités administrateur activées</p>
					</div>
				)}

				{/* Logout */}
				<button
					onClick={handleLogout}
					className='w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105'>
					🚪 {t.logout}
				</button>
			</div>

			{/* Edit Modal */}
			{showEditModal && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in'>
					<div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
						<h2 className={`text-3xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.modifyBtn}</h2>

						<form onSubmit={handleProfileUpdate}>
							<p className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.chooseAvatar}</p>

							<div className='flex gap-2 mb-4'>
								{['netflix', 'prime', 'disney'].map(tab => (
									<button
										key={tab}
										type='button'
										onClick={() => setAvatarTab(tab)}
										className={`px-4 py-2 rounded-xl font-bold transition-all ${avatarTab === tab ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105' : `${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}`}>
										{tab === 'netflix' ? 'Netflix' : tab === 'prime' ? 'Prime' : 'Disney+'}
									</button>
								))}
							</div>

							<div className='grid grid-cols-5 gap-3 mb-6'>
								{AVATARS[avatarTab].map(avatar => (
									<button
										key={avatar.id}
										type='button'
										onClick={() => setEditForm({ ...editForm, avatar: avatar.id })}
										className={`aspect-square rounded-xl overflow-hidden transition-all ${editForm.avatar === avatar.id ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}>
										<img src={avatar.url} alt={avatar.name} className='w-full h-full object-cover' onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }} />
									</button>
								))}
							</div>

							<div className='mb-6'>
								<label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.pseudo}</label>
								<input
									type='text'
									value={editForm.pseudo}
									onChange={(e) => setEditForm({ ...editForm, pseudo: e.target.value })}
									className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
								/>
							</div>

							<div className='flex gap-3'>
								<button
									type='button'
									onClick={() => setShowEditModal(false)}
									className={`flex-1 py-3 rounded-xl font-bold ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} transition-colors`}>
									{t.cancel}
								</button>
								<button
									type='submit'
									disabled={loading}
									className='flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all'>
									{loading ? '...' : t.save}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountSettings;
