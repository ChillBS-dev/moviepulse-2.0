import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
const ADMIN_CODE = 'MOVIEPULSE2026ADMIN';

const TRANSLATIONS = {
	fr: {
		back: '← Retour',
		editProfile: 'Modifier le profil',
		editProfileDesc: 'Personnalise ton expérience MoviePulse',
		adultProfile: 'Profil adulte',
		modifyBtn: 'Modifier',
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
		logout: 'Déconnexion',
	},
	en: {
		back: '← Back',
		editProfile: 'Edit profile',
		editProfileDesc: 'Customize your MoviePulse experience',
		adultProfile: 'Adult profile',
		modifyBtn: 'Edit',
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
		logout: 'Logout',
	},
	es: {
		back: '← Volver',
		editProfile: 'Editar perfil',
		editProfileDesc: 'Personaliza tu experiencia MoviePulse',
		adultProfile: 'Perfil adulto',
		modifyBtn: 'Editar',
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
		logout: 'Cerrar sesión',
	},
};

const AccountSettings = () => {
	const [showEditModal, setShowEditModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showReadingModal, setShowReadingModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { logout, theme, setTheme } = useApp();

	const [lang, setLang] = useState(() => localStorage.getItem('appLanguage') || 'fr');
	const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

	const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
	const [adminInput, setAdminInput] = useState('');

	const [profile, setProfile] = useState({ pseudo: '', email: '' });
	const [editForm, setEditForm] = useState({ pseudo: '' });
	const [passwordData, setPasswordData] = useState({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});
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
				setProfile({ pseudo, email: data.email || '' });
				setEditForm({ pseudo });
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
				}),
			});

			if (res.ok) {
				setProfile({ ...profile, pseudo: editForm.pseudo });
				setShowEditModal(false);
				toast.success('✅ Profil mis à jour !');
			} else {
				toast.error('❌ Erreur lors de la mise à jour');
			}
		} catch (err) {
			toast.error('❌ Erreur de connexion');
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();

		if (passwordData.new_password !== passwordData.confirm_password) {
			toast.error('❌ Les mots de passe ne correspondent pas');
			return;
		}

		if (passwordData.new_password.length < 8) {
			toast.error('❌ Le mot de passe doit contenir au moins 8 caractères');
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
				toast.success('✅ Mot de passe changé !');
				setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
				setShowPasswordModal(false);
			} else {
				const data = await res.json();
				toast.error(`❌ ${data.error || 'Erreur'}`);
			}
		} catch (err) {
			toast.error('❌ Erreur');
		} finally {
			setLoading(false);
		}
	};

	const handleAdminCode = () => {
		if (adminInput === ADMIN_CODE) {
			setIsAdmin(true);
			localStorage.setItem('isAdmin', 'true');
			window.dispatchEvent(new Event('storage'));
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
							<div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-black text-white'>
								{profile.pseudo.charAt(0).toUpperCase()}
							</div>
							<div>
								<p className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{profile.pseudo}</p>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.adultProfile}</p>
							</div>
						</div>

						<button
							onClick={() => {
								setEditForm({ pseudo: profile.pseudo });
								setShowEditModal(true);
							}}
							className='px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105'>
							{t.modifyBtn}
						</button>
					</div>
				</div>

				{/* Grid Layout */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
					{/* Password Card */}
					<button
						onClick={() => setShowPasswordModal(true)}
						className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-left`}>
						<div className='flex items-start gap-4'>
							<div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg'>
								🔒
							</div>
							<div className='flex-1'>
								<h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.updatePassword}</h3>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.modifyPassword}</p>
							</div>
						</div>
					</button>

					{/* Reading Preferences */}
					<button
						onClick={() => setShowReadingModal(true)}
						className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-left`}>
						<div className='flex items-start gap-4'>
							<div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg'>
								▶️
							</div>
							<div className='flex-1'>
								<h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.readingPreferences}</h3>
								<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.configureOptions}</p>
							</div>
						</div>
					</button>
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
							<label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.language}</label>
							<select
								value={lang}
								onChange={(e) => setLang(e.target.value)}
								className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all`}>
								<option value='fr' className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>Français 🇫🇷</option>
								<option value='en' className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>English 🇬🇧</option>
								<option value='es' className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>Español 🇪🇸</option>
							</select>
						</div>

						{/* Theme */}
						<div>
							<label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.theme}</label>
							<select
								value={theme}
								onChange={(e) => setTheme(e.target.value)}
								className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all`}>
								<option value='dark' className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>{t.dark} 🌙</option>
								<option value='light' className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>{t.light} ☀️</option>
							</select>
						</div>
					</div>
				</div>

				{/* Admin Code */}
				{!isAdmin && (
					<div className={`${theme === 'dark' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-100 border-purple-300'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl mb-6`}>
						<h3 className='font-bold mb-3 text-purple-400'>👑 {t.adminCode}</h3>
						<div className='flex gap-2'>
							<input
								type='text'
								value={adminInput}
								onChange={(e) => setAdminInput(e.target.value)}
								placeholder={t.enterCode}
								className={`flex-1 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-gray-500' : 'bg-white border-purple-300 text-gray-900 placeholder-gray-400'} border rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50`}
							/>
							<button
								onClick={handleAdminCode}
								className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all'>
								{t.validate}
							</button>
						</div>
					</div>
				)}

				{/* Logout */}
				<button
					onClick={handleLogout}
					className='w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105'>
					🚪 {t.logout}
				</button>
			</div>

			{/* Edit Profile Modal */}
			{showEditModal && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className={`${theme === 'dark' ? 'bg-gray-900 border-white/20' : 'bg-white border-gray-200'} rounded-3xl p-8 max-w-md w-full shadow-2xl border`}>
						<h2 className={`text-2xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							{t.modifyBtn}
						</h2>

						<form onSubmit={handleProfileUpdate}>
							<div className='mb-6'>
								<label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
									{t.pseudo}
								</label>
								<input
									type='text'
									value={editForm.pseudo}
									onChange={(e) => setEditForm({ pseudo: e.target.value })}
									className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50`}
									required
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

			{/* Password Modal */}
			{showPasswordModal && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className={`${theme === 'dark' ? 'bg-gray-900 border-white/20' : 'bg-white border-gray-200'} rounded-3xl p-8 max-w-md w-full shadow-2xl border`}>
						<h2 className={`text-2xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							{t.updatePassword}
						</h2>

						<form onSubmit={handlePasswordChange} className='space-y-4'>
							<div>
								<label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
									{t.currentPassword}
								</label>
								<input
									type='password'
									value={passwordData.old_password}
									onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
									className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									required
								/>
							</div>

							<div>
								<label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
									{t.newPassword}
								</label>
								<input
									type='password'
									value={passwordData.new_password}
									onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
									className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									required
								/>
							</div>

							<div>
								<label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
									{t.confirmPassword}
								</label>
								<input
									type='password'
									value={passwordData.confirm_password}
									onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
									className={`w-full ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									required
								/>
							</div>

							<div className='flex gap-3 pt-2'>
								<button
									type='button'
									onClick={() => setShowPasswordModal(false)}
									className={`flex-1 py-3 rounded-xl font-bold ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} transition-colors`}>
									{t.cancel}
								</button>
								<button
									type='submit'
									disabled={loading}
									className='flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all'>
									{loading ? '...' : t.update}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Reading Modal */}
			{showReadingModal && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className={`${theme === 'dark' ? 'bg-gray-900 border-white/20' : 'bg-white border-gray-200'} rounded-3xl p-8 max-w-md w-full shadow-2xl border`}>
						<h2 className={`text-2xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
							{t.readingPreferences}
						</h2>

						<div className='space-y-4'>
							<p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
								Options de lecture : sous-titres, langue audio, qualité vidéo...
							</p>

							<div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
								<p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
									Fonctionnalité en cours de développement
								</p>
							</div>

							<button
								onClick={() => setShowReadingModal(false)}
								className='w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all'>
								Fermer
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountSettings;
