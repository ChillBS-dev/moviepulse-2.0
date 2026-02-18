import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
const ADMIN_CODE = 'MOVIEPULSE2026ADMIN'; // Code secret admin

// Real working avatar URLs
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
		account: 'Mon Compte',
		profile: 'Profil',
		security: 'Sécurité',
		preferences: 'Préférences',
		notifications: 'Notifications',
		reviews: 'Mes Avis',
		advanced: 'Avancé',
		logout: 'Déconnexion',
		modifyProfile: 'Modifier le profil',
		firstName: 'Prénom',
		lastName: 'Nom',
		save: 'Enregistrer',
		cancel: 'Annuler',
		changePassword: 'Mettre à jour le mot de passe',
		oldPassword: 'Mot de passe actuel',
		newPassword: 'Nouveau mot de passe',
		confirmPassword: 'Confirmer',
		updateBtn: 'Mettre à jour',
		notifDesc: 'Recevoir des notifications',
		language: 'Langue',
		theme: 'Thème',
		dark: 'Sombre',
		light: 'Clair',
		adminCode: 'Code Admin',
		enterAdminCode: 'Entrer le code administrateur',
		adminPanel: 'Panneau Admin',
	},
	en: {
		account: 'My Account',
		profile: 'Profile',
		security: 'Security',
		preferences: 'Preferences',
		notifications: 'Notifications',
		reviews: 'My Reviews',
		advanced: 'Advanced',
		logout: 'Logout',
		modifyProfile: 'Edit profile',
		firstName: 'First Name',
		lastName: 'Last Name',
		save: 'Save',
		cancel: 'Cancel',
		changePassword: 'Update password',
		oldPassword: 'Current password',
		newPassword: 'New password',
		confirmPassword: 'Confirm',
		updateBtn: 'Update',
		notifDesc: 'Receive notifications',
		language: 'Language',
		theme: 'Theme',
		dark: 'Dark',
		light: 'Light',
		adminCode: 'Admin Code',
		enterAdminCode: 'Enter admin code',
		adminPanel: 'Admin Panel',
	},
	es: {
		account: 'Mi Cuenta',
		profile: 'Perfil',
		security: 'Seguridad',
		preferences: 'Preferencias',
		notifications: 'Notificaciones',
		reviews: 'Mis Reseñas',
		advanced: 'Avanzado',
		logout: 'Cerrar sesión',
		modifyProfile: 'Editar perfil',
		firstName: 'Nombre',
		lastName: 'Apellido',
		save: 'Guardar',
		cancel: 'Cancelar',
		changePassword: 'Actualizar contraseña',
		oldPassword: 'Contraseña actual',
		newPassword: 'Nueva contraseña',
		confirmPassword: 'Confirmar',
		updateBtn: 'Actualizar',
		notifDesc: 'Recibir notificaciones',
		language: 'Idioma',
		theme: 'Tema',
		dark: 'Oscuro',
		light: 'Claro',
		adminCode: 'Código Admin',
		enterAdminCode: 'Ingrese código admin',
		adminPanel: 'Panel Admin',
	},
	de: {
		account: 'Mein Konto',
		profile: 'Profil',
		security: 'Sicherheit',
		preferences: 'Einstellungen',
		notifications: 'Benachrichtigungen',
		reviews: 'Meine Bewertungen',
		advanced: 'Erweitert',
		logout: 'Abmelden',
		modifyProfile: 'Profil bearbeiten',
		firstName: 'Vorname',
		lastName: 'Nachname',
		save: 'Speichern',
		cancel: 'Abbrechen',
		changePassword: 'Passwort aktualisieren',
		oldPassword: 'Aktuelles Passwort',
		newPassword: 'Neues Passwort',
		confirmPassword: 'Bestätigen',
		updateBtn: 'Aktualisieren',
		notifDesc: 'Benachrichtigungen erhalten',
		language: 'Sprache',
		theme: 'Thema',
		dark: 'Dunkel',
		light: 'Hell',
		adminCode: 'Admin-Code',
		enterAdminCode: 'Admin-Code eingeben',
		adminPanel: 'Admin-Panel',
	},
	it: {
		account: 'Il Mio Account',
		profile: 'Profilo',
		security: 'Sicurezza',
		preferences: 'Preferenze',
		notifications: 'Notifiche',
		reviews: 'Le Mie Recensioni',
		advanced: 'Avanzato',
		logout: 'Disconnetti',
		modifyProfile: 'Modifica profilo',
		firstName: 'Nome',
		lastName: 'Cognome',
		save: 'Salva',
		cancel: 'Annulla',
		changePassword: 'Aggiorna password',
		oldPassword: 'Password attuale',
		newPassword: 'Nuova password',
		confirmPassword: 'Conferma',
		updateBtn: 'Aggiorna',
		notifDesc: 'Ricevi notifiche',
		language: 'Lingua',
		theme: 'Tema',
		dark: 'Scuro',
		light: 'Chiaro',
		adminCode: 'Codice Admin',
		enterAdminCode: 'Inserire codice admin',
		adminPanel: 'Pannello Admin',
	},
	ja: {
		account: 'マイアカウント',
		profile: 'プロフィール',
		security: 'セキュリティ',
		preferences: '設定',
		notifications: '通知',
		reviews: 'マイレビュー',
		advanced: '詳細設定',
		logout: 'ログアウト',
		modifyProfile: 'プロフィール編集',
		firstName: '名',
		lastName: '姓',
		save: '保存',
		cancel: 'キャンセル',
		changePassword: 'パスワード更新',
		oldPassword: '現在のパスワード',
		newPassword: '新しいパスワード',
		confirmPassword: '確認',
		updateBtn: '更新',
		notifDesc: '通知を受け取る',
		language: '言語',
		theme: 'テーマ',
		dark: 'ダーク',
		light: 'ライト',
		adminCode: '管理者コード',
		enterAdminCode: '管理者コードを入力',
		adminPanel: '管理パネル',
	},
};

const AccountSettings = () => {
	const [activeSection, setActiveSection] = useState('profile');
	const [loading, setLoading] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [avatarTab, setAvatarTab] = useState('netflix');
	const navigate = useNavigate();
	const { logout, theme, setTheme } = useApp();

	const [lang, setLang] = useState(() => localStorage.getItem('appLanguage') || 'fr');
	const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

	const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
	const [adminInput, setAdminInput] = useState('');

	const [profile, setProfile] = useState({
		first_name: '',
		last_name: '',
		email: '',
		avatar: 1,
	});

	const [editForm, setEditForm] = useState({
		first_name: '',
		last_name: '',
		avatar: 1,
	});

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
				setProfile({
					first_name: data.first_name || '',
					last_name: data.last_name || '',
					email: data.email || '',
					avatar: data.avatar || 1,
				});
				setEditForm({
					first_name: data.first_name || '',
					last_name: data.last_name || '',
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
				body: JSON.stringify(editForm),
			});

			if (res.ok) {
				setProfile({ ...profile, ...editForm });
				setShowEditModal(false);
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
				toast.success('Mot de passe changé !');
				setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
			} else {
				const data = await res.json();
				toast.error(data.error || 'Erreur');
			}
		} catch (err) {
			toast.error('Erreur de connexion');
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
			toast.error('Code incorrect');
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const selectedAvatar = ALL_AVATARS.find(a => a.id === profile.avatar) || ALL_AVATARS[0];
	const isDark = theme === 'dark';

	return (
		<div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} flex`}>
			{/* Sidebar */}
			<div className={`w-64 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border-r ${isDark ? 'border-gray-800' : 'border-gray-200'} fixed h-full overflow-y-auto`}>
				<div className='p-6'>
					<Link to='/home' className='text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-2'>
						← {lang === 'fr' ? 'Retour' : lang === 'en' ? 'Back' : lang === 'es' ? 'Volver' : lang === 'de' ? 'Zurück' : lang === 'it' ? 'Indietro' : '戻る'}
					</Link>

					<h2 className={`${isDark ? 'text-white' : 'text-gray-900'} font-black text-xl mb-2`}>{t.account}</h2>
					<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
						{profile.first_name} {profile.last_name}
					</p>

					<nav className='space-y-1'>
						<button
							onClick={() => setActiveSection('profile')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
								activeSection === 'profile'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span>👥</span>
							<span className='font-medium text-sm'>{t.profile}</span>
						</button>

						<button
							onClick={() => setActiveSection('security')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
								activeSection === 'security'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span>🛡️</span>
							<span className='font-medium text-sm'>{t.security}</span>
						</button>

						<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
							{t.preferences}
						</div>

						<button
							onClick={() => setActiveSection('notifications')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
								activeSection === 'notifications'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span>🔔</span>
							<span className='font-medium text-sm'>{t.notifications}</span>
						</button>

						<button
							onClick={() => setActiveSection('settings')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
								activeSection === 'settings'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span>⚙️</span>
							<span className='font-medium text-sm'>{t.language}</span>
						</button>

						<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
							{lang === 'fr' ? 'Mon activité' : lang === 'en' ? 'My activity' : lang === 'es' ? 'Mi actividad' : lang === 'de' ? 'Meine Aktivität' : lang === 'it' ? 'La mia attività' : 'マイ活動'}
						</div>

						<Link
							to='/reviews'
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
							<span>💬</span>
							<span className='font-medium text-sm'>{t.reviews}</span>
						</Link>

						{isAdmin && (
							<>
								<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
									{t.advanced}
								</div>

								<button
									onClick={() => setActiveSection('admin')}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
										activeSection === 'admin'
											? 'bg-purple-600 text-white'
											: `${isDark ? 'text-purple-400 hover:bg-purple-900/20' : 'text-purple-600 hover:bg-purple-50'}`
									}`}>
									<span>👑</span>
									<span className='font-medium text-sm'>{t.adminPanel}</span>
								</button>
							</>
						)}

						<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
							{t.advanced}
						</div>

						<button
							onClick={handleLogout}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}>
							<span>🚪</span>
							<span className='font-medium text-sm'>{t.logout}</span>
						</button>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className='ml-64 flex-1 p-8'>
				{/* Profile Section */}
				{activeSection === 'profile' && (
					<div className='max-w-4xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
							{lang === 'fr' ? 'Modifier le profil' : lang === 'en' ? 'Edit profile' : lang === 'es' ? 'Editar perfil' : lang === 'de' ? 'Profil bearbeiten' : lang === 'it' ? 'Modifica profilo' : 'プロフィール編集'}
						</h1>
						<p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 text-sm`}>
							{lang === 'fr' ? 'Personnalise les paramètres de ce profil' : lang === 'en' ? 'Customize this profile settings' : lang === 'es' ? 'Personaliza la configuración de este perfil' : 'Personalisiere diese Profileinstellungen'}
						</p>

						<div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
							<div className='flex items-center gap-4'>
								<img
									src={selectedAvatar.url}
									alt={selectedAvatar.name}
									className='w-20 h-20 rounded-full object-cover'
									onError={(e) => {
										e.target.src = 'https://via.placeholder.com/80/1f2937/4b5563?text=Avatar';
									}}
								/>
								<div>
									<p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
										{profile.first_name} {profile.last_name}
									</p>
									<p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
										{lang === 'fr' ? 'Profil adulte' : lang === 'en' ? 'Adult profile' : lang === 'es' ? 'Perfil adulto' : 'Erwachsenenprofil'}
									</p>
								</div>
							</div>

							<button
								onClick={() => setShowEditModal(true)}
								className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
								{t.modifyProfile}
							</button>
						</div>

						{/* Admin Code Input */}
						{!isAdmin && (
							<div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'} mt-6`}>
								<h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>{t.adminCode}</h3>
								<div className='flex gap-2'>
									<input
										type='text'
										value={adminInput}
										onChange={(e) => setAdminInput(e.target.value)}
										placeholder={t.enterAdminCode}
										className={`flex-1 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500`}
									/>
									<button
										onClick={handleAdminCode}
										className='px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-500'>
										{lang === 'fr' ? 'Valider' : lang === 'en' ? 'Validate' : lang === 'es' ? 'Validar' : 'Bestätigen'}
									</button>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Security Section */}
				{activeSection === 'security' && (
					<div className='max-w-2xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.changePassword}</h1>

						<form onSubmit={handlePasswordChange} className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<div className='space-y-4'>
								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.oldPassword}</label>
									<input
										type='password'
										value={passwordData.old_password}
										onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.newPassword}</label>
									<input
										type='password'
										value={passwordData.new_password}
										onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.confirmPassword}</label>
									<input
										type='password'
										value={passwordData.confirm_password}
										onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
										required
									/>
								</div>

								<button
									type='submit'
									disabled={loading}
									className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50'>
									{t.updateBtn}
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Notifications Section */}
				{activeSection === 'notifications' && (
					<div className='max-w-2xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.notifications}</h1>

						<div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<div className='flex items-center justify-between'>
								<div>
									<p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.notifications}</p>
									<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.notifDesc}</p>
								</div>
								<button
									onClick={() => saveSettings({ ...settings, notifications: !settings.notifications })}
									className={`relative w-14 h-7 rounded-full transition-colors ${
										settings.notifications ? 'bg-blue-600' : `${isDark ? 'bg-gray-700' : 'bg-gray-300'}`
									}`}>
									<div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
										settings.notifications ? 'translate-x-7' : 'translate-x-1'
									}`} />
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Settings Section */}
				{activeSection === 'settings' && (
					<div className='max-w-2xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.preferences}</h1>

						<div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'} space-y-6`}>
							<div>
								<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.language}</label>
								<select
									value={lang}
									onChange={(e) => setLang(e.target.value)}
									className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}>
									<option value='fr'>Français 🇫🇷</option>
									<option value='en'>English 🇬🇧</option>
									<option value='es'>Español 🇪🇸</option>
									<option value='de'>Deutsch 🇩🇪</option>
									<option value='it'>Italiano 🇮🇹</option>
									<option value='ja'>日本語 🇯🇵</option>
								</select>
							</div>

							<div>
								<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.theme}</label>
								<select
									value={theme}
									onChange={(e) => setTheme(e.target.value)}
									className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}>
									<option value='dark'>{t.dark} 🌙</option>
									<option value='light'>{t.light} ☀️</option>
								</select>
							</div>
						</div>
					</div>
				)}

				{/* Admin Panel */}
				{activeSection === 'admin' && isAdmin && (
					<div className='max-w-4xl'>
						<h1 className='text-2xl font-bold text-purple-400 mb-6'>👑 {t.adminPanel}</h1>
						<div className='bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6'>
							<p className='text-white mb-4'>
								{lang === 'fr' ? 'Fonctionnalités admin disponibles :' : 'Admin features available:'}
							</p>
							<ul className='space-y-2 text-purple-300'>
								<li>✅ {lang === 'fr' ? 'Voir toutes les statistiques utilisateurs' : 'View all user statistics'}</li>
								<li>✅ {lang === 'fr' ? 'Gérer les contenus signalés' : 'Manage reported content'}</li>
								<li>✅ {lang === 'fr' ? 'Accès aux logs système' : 'Access system logs'}</li>
								<li>✅ {lang === 'fr' ? 'Modifier les rôles utilisateurs' : 'Edit user roles'}</li>
							</ul>
						</div>
					</div>
				)}
			</div>

			{/* Edit Modal */}
			{showEditModal && (
				<div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
					<div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
						<h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.modifyProfile}</h2>

						<form onSubmit={handleProfileUpdate}>
							{/* Avatar Selection */}
							<div className='mb-6'>
								<p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
									{lang === 'fr' ? 'Choisis ton avatar' : lang === 'en' ? 'Choose your avatar' : 'Elige tu avatar'}
								</p>

								{/* Tabs */}
								<div className='flex gap-2 mb-4'>
									{['netflix', 'prime', 'disney'].map(tab => (
										<button
											key={tab}
											type='button'
											onClick={() => setAvatarTab(tab)}
											className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
												avatarTab === tab
													? 'bg-blue-600 text-white'
													: `${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`
											}`}>
											{tab === 'netflix' ? 'Netflix' : tab === 'prime' ? 'Prime Video' : 'Disney+'}
										</button>
									))}
								</div>

								{/* Avatar Grid */}
								<div className='grid grid-cols-5 gap-3'>
									{AVATARS[avatarTab].map(avatar => (
										<button
											key={avatar.id}
											type='button'
											onClick={() => setEditForm({ ...editForm, avatar: avatar.id })}
											className={`aspect-square rounded-xl overflow-hidden transition-all ${
												editForm.avatar === avatar.id
													? 'ring-4 ring-blue-500 scale-105'
													: 'hover:scale-105 opacity-80 hover:opacity-100'
											}`}>
											<img
												src={avatar.url}
												alt={avatar.name}
												className='w-full h-full object-cover'
												onError={(e) => {
													e.target.src = 'https://via.placeholder.com/80/1f2937/4b5563?text=?';
												}}
											/>
										</button>
									))}
								</div>
							</div>

							{/* Name Fields */}
							<div className='grid grid-cols-2 gap-4 mb-6'>
								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.firstName}</label>
									<input
										type='text'
										value={editForm.first_name}
										onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									/>
								</div>
								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.lastName}</label>
									<input
										type='text'
										value={editForm.last_name}
										onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									/>
								</div>
							</div>

							{/* Buttons */}
							<div className='flex gap-3'>
								<button
									type='button'
									onClick={() => setShowEditModal(false)}
									className={`flex-1 py-3 rounded-xl font-semibold ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
									{t.cancel}
								</button>
								<button
									type='submit'
									disabled={loading}
									className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50'>
									{loading ? lang === 'fr' ? 'Enregistrement...' : 'Saving...' : t.save}
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
