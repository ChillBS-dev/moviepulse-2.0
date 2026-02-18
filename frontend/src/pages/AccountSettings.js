import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Real avatar images - Netflix/Prime Video/Disney+ style
const AVATARS = [
	// Attack on Titan
	{ id: 1, name: 'Eren Yeager', img: 'https://i.imgur.com/8qY3K4h.jpg', category: 'Attack on Titan' },
	{ id: 2, name: 'Mikasa Ackerman', img: 'https://i.imgur.com/YzF6wJe.jpg', category: 'Attack on Titan' },
	{ id: 3, name: 'Armin Arlert', img: 'https://i.imgur.com/3nH9W5X.jpg', category: 'Attack on Titan' },
	{ id: 4, name: 'Levi Ackerman', img: 'https://i.imgur.com/m2k8TRx.jpg', category: 'Attack on Titan' },
	
	// Naruto
	{ id: 5, name: 'Naruto Uzumaki', img: 'https://i.imgur.com/qK5YW8J.jpg', category: 'Naruto' },
	{ id: 6, name: 'Sasuke Uchiha', img: 'https://i.imgur.com/vN7dF9M.jpg', category: 'Naruto' },
	{ id: 7, name: 'Sakura Haruno', img: 'https://i.imgur.com/2xP8wQK.jpg', category: 'Naruto' },
	{ id: 8, name: 'Kakashi Hatake', img: 'https://i.imgur.com/5R8nX2L.jpg', category: 'Naruto' },
	
	// One Piece
	{ id: 9, name: 'Monkey D. Luffy', img: 'https://i.imgur.com/7hK9wXp.jpg', category: 'One Piece' },
	{ id: 10, name: 'Roronoa Zoro', img: 'https://i.imgur.com/xT4nR8p.jpg', category: 'One Piece' },
	{ id: 11, name: 'Nami', img: 'https://i.imgur.com/pL9sW3k.jpg', category: 'One Piece' },
	{ id: 12, name: 'Sanji', img: 'https://i.imgur.com/9mF2kLx.jpg', category: 'One Piece' },
	
	// Dragon Ball
	{ id: 13, name: 'Goku', img: 'https://i.imgur.com/k4R8pYm.jpg', category: 'Dragon Ball' },
	{ id: 14, name: 'Vegeta', img: 'https://i.imgur.com/7sK9wPx.jpg', category: 'Dragon Ball' },
	{ id: 15, name: 'Gohan', img: 'https://i.imgur.com/mT7nX4p.jpg', category: 'Dragon Ball' },
	{ id: 16, name: 'Piccolo', img: 'https://i.imgur.com/qW5sL8m.jpg', category: 'Dragon Ball' },
	
	// Demon Slayer
	{ id: 17, name: 'Tanjiro Kamado', img: 'https://i.imgur.com/rP9kW5x.jpg', category: 'Demon Slayer' },
	{ id: 18, name: 'Nezuko Kamado', img: 'https://i.imgur.com/wT6nM8p.jpg', category: 'Demon Slayer' },
	{ id: 19, name: 'Zenitsu Agatsuma', img: 'https://i.imgur.com/5L8sK9m.jpg', category: 'Demon Slayer' },
	{ id: 20, name: 'Inosuke Hashibira', img: 'https://i.imgur.com/3kR7wXp.jpg', category: 'Demon Slayer' },
	
	// My Hero Academia
	{ id: 21, name: 'Izuku Midoriya', img: 'https://i.imgur.com/mF8pW9k.jpg', category: 'My Hero Academia' },
	{ id: 22, name: 'Katsuki Bakugo', img: 'https://i.imgur.com/nT5sL7x.jpg', category: 'My Hero Academia' },
	{ id: 23, name: 'Shoto Todoroki', img: 'https://i.imgur.com/qK9wR6p.jpg', category: 'My Hero Academia' },
	{ id: 24, name: 'Ochaco Uraraka', img: 'https://i.imgur.com/7sL9kWm.jpg', category: 'My Hero Academia' },
	
	// Jujutsu Kaisen
	{ id: 25, name: 'Yuji Itadori', img: 'https://i.imgur.com/pR8wT5k.jpg', category: 'Jujutsu Kaisen' },
	{ id: 26, name: 'Megumi Fushiguro', img: 'https://i.imgur.com/5kW9sLx.jpg', category: 'Jujutsu Kaisen' },
	{ id: 27, name: 'Nobara Kugisaki', img: 'https://i.imgur.com/mT7wR9p.jpg', category: 'Jujutsu Kaisen' },
	{ id: 28, name: 'Satoru Gojo', img: 'https://i.imgur.com/nL8sK6m.jpg', category: 'Jujutsu Kaisen' },
	
	// Death Note
	{ id: 29, name: 'Light Yagami', img: 'https://i.imgur.com/qW9pR7k.jpg', category: 'Death Note' },
	{ id: 30, name: 'L Lawliet', img: 'https://i.imgur.com/5sT8wLm.jpg', category: 'Death Note' },
	{ id: 31, name: 'Ryuk', img: 'https://i.imgur.com/mK9wR5x.jpg', category: 'Death Note' },
	{ id: 32, name: 'Misa Amane', img: 'https://i.imgur.com/nL7sW8p.jpg', category: 'Death Note' },
	
	// Tokyo Ghoul
	{ id: 33, name: 'Ken Kaneki', img: 'https://i.imgur.com/pR9wT6k.jpg', category: 'Tokyo Ghoul' },
	{ id: 34, name: 'Touka Kirishima', img: 'https://i.imgur.com/5kW8sLm.jpg', category: 'Tokyo Ghoul' },
	{ id: 35, name: 'Shuu Tsukiyama', img: 'https://i.imgur.com/mT7wR8p.jpg', category: 'Tokyo Ghoul' },
	{ id: 36, name: 'Juuzou Suzuya', img: 'https://i.imgur.com/nL9sK7m.jpg', category: 'Tokyo Ghoul' },
	
	// Fullmetal Alchemist
	{ id: 37, name: 'Edward Elric', img: 'https://i.imgur.com/qW8pR9k.jpg', category: 'Fullmetal Alchemist' },
	{ id: 38, name: 'Alphonse Elric', img: 'https://i.imgur.com/5sT7wLp.jpg', category: 'Fullmetal Alchemist' },
	{ id: 39, name: 'Roy Mustang', img: 'https://i.imgur.com/mK8wR6x.jpg', category: 'Fullmetal Alchemist' },
	{ id: 40, name: 'Winry Rockbell', img: 'https://i.imgur.com/nL6sW9m.jpg', category: 'Fullmetal Alchemist' },
	
	// Hunter x Hunter
	{ id: 41, name: 'Gon Freecss', img: 'https://i.imgur.com/pR8wT7k.jpg', category: 'Hunter x Hunter' },
	{ id: 42, name: 'Killua Zoldyck', img: 'https://i.imgur.com/5kW7sLm.jpg', category: 'Hunter x Hunter' },
	{ id: 43, name: 'Kurapika', img: 'https://i.imgur.com/mT6wR9p.jpg', category: 'Hunter x Hunter' },
	{ id: 44, name: 'Leorio Paradinight', img: 'https://i.imgur.com/nL8sK7m.jpg', category: 'Hunter x Hunter' },
	
	// Sword Art Online
	{ id: 45, name: 'Kirito', img: 'https://i.imgur.com/qW7pR8k.jpg', category: 'Sword Art Online' },
	{ id: 46, name: 'Asuna', img: 'https://i.imgur.com/5sT6wLm.jpg', category: 'Sword Art Online' },
	{ id: 47, name: 'Sinon', img: 'https://i.imgur.com/mK7wR9x.jpg', category: 'Sword Art Online' },
	{ id: 48, name: 'Leafa', img: 'https://i.imgur.com/nL5sW8p.jpg', category: 'Sword Art Online' },
	
	// Bleach
	{ id: 49, name: 'Ichigo Kurosaki', img: 'https://i.imgur.com/pR7wT8k.jpg', category: 'Bleach' },
	{ id: 50, name: 'Rukia Kuchiki', img: 'https://i.imgur.com/5kW6sLm.jpg', category: 'Bleach' },
	{ id: 51, name: 'Byakuya Kuchiki', img: 'https://i.imgur.com/mT5wR8p.jpg', category: 'Bleach' },
	{ id: 52, name: 'Renji Abarai', img: 'https://i.imgur.com/nL7sK8m.jpg', category: 'Bleach' },
	
	// One Punch Man
	{ id: 53, name: 'Saitama', img: 'https://i.imgur.com/qW6pR7k.jpg', category: 'One Punch Man' },
	{ id: 54, name: 'Genos', img: 'https://i.imgur.com/5sT5wLp.jpg', category: 'One Punch Man' },
	{ id: 55, name: 'Tatsumaki', img: 'https://i.imgur.com/mK6wR8x.jpg', category: 'One Punch Man' },
	{ id: 56, name: 'Mumen Rider', img: 'https://i.imgur.com/nL4sW7m.jpg', category: 'One Punch Man' },
	
	// Steins;Gate
	{ id: 57, name: 'Okabe Rintarou', img: 'https://i.imgur.com/pR6wT9k.jpg', category: 'Steins;Gate' },
	{ id: 58, name: 'Makise Kurisu', img: 'https://i.imgur.com/5kW5sLm.jpg', category: 'Steins;Gate' },
	{ id: 59, name: 'Mayuri Shiina', img: 'https://i.imgur.com/mT4wR7p.jpg', category: 'Steins;Gate' },
	{ id: 60, name: 'Itaru Hashida', img: 'https://i.imgur.com/nL6sK9m.jpg', category: 'Steins;Gate' },
];

const TRANSLATIONS = {
	fr: {
		myAccount: 'Mon Compte',
		profile: 'Parrainage',
		security: 'Sécurité',
		settings: 'Paramètres',
		myReviews: 'Mes Avis',
		logout: 'Déconnexion',
		changeAvatar: 'Changer de profil',
		search: 'Rechercher un avatar...',
		firstName: 'Prénom',
		lastName: 'Nom',
		email: 'Email',
		emailReadonly: "L'email ne peut pas être modifié",
		save: 'Enregistrer les modifications',
		saving: 'Enregistrement...',
		changePassword: 'Mettre à jour le mot de passe',
		oldPassword: 'Mot de passe actuel',
		newPassword: 'Nouveau mot de passe',
		confirmPassword: 'Confirmer le mot de passe',
		changeBtn: 'Changer le mot de passe',
		changing: 'Changement en cours...',
		preferences: 'Préférences',
		notifications: 'Notifications',
		notificationsDesc: 'Recevoir des notifications sur l\'activité',
		language: 'Langue',
		theme: 'Thème',
		dark: 'Sombre',
		light: 'Clair',
		dangerZone: 'Zone de secours',
		logoutBtn: 'Se déconnecter',
	},
	en: {
		myAccount: 'My Account',
		profile: 'Referral',
		security: 'Security',
		settings: 'Settings',
		myReviews: 'My Reviews',
		logout: 'Logout',
		changeAvatar: 'Change profile',
		search: 'Search avatar...',
		firstName: 'First Name',
		lastName: 'Last Name',
		email: 'Email',
		emailReadonly: 'Email cannot be changed',
		save: 'Save changes',
		saving: 'Saving...',
		changePassword: 'Update password',
		oldPassword: 'Current password',
		newPassword: 'New password',
		confirmPassword: 'Confirm password',
		changeBtn: 'Change password',
		changing: 'Changing...',
		preferences: 'Preferences',
		notifications: 'Notifications',
		notificationsDesc: 'Receive activity notifications',
		language: 'Language',
		theme: 'Theme',
		dark: 'Dark',
		light: 'Light',
		dangerZone: 'Help zone',
		logoutBtn: 'Logout',
	},
	es: {
		myAccount: 'Mi Cuenta',
		profile: 'Patrocinio',
		security: 'Seguridad',
		settings: 'Configuración',
		myReviews: 'Mis Reseñas',
		logout: 'Cerrar sesión',
		changeAvatar: 'Cambiar perfil',
		search: 'Buscar avatar...',
		firstName: 'Nombre',
		lastName: 'Apellido',
		email: 'Correo',
		emailReadonly: 'El correo no se puede cambiar',
		save: 'Guardar cambios',
		saving: 'Guardando...',
		changePassword: 'Actualizar contraseña',
		oldPassword: 'Contraseña actual',
		newPassword: 'Nueva contraseña',
		confirmPassword: 'Confirmar contraseña',
		changeBtn: 'Cambiar contraseña',
		changing: 'Cambiando...',
		preferences: 'Preferencias',
		notifications: 'Notificaciones',
		notificationsDesc: 'Recibir notificaciones de actividad',
		language: 'Idioma',
		theme: 'Tema',
		dark: 'Oscuro',
		light: 'Claro',
		dangerZone: 'Zona de ayuda',
		logoutBtn: 'Cerrar sesión',
	},
};

const AccountSettings = () => {
	const [activeSection, setActiveSection] = useState('profile');
	const [loading, setLoading] = useState(false);
	const [searchAvatar, setSearchAvatar] = useState('');
	const navigate = useNavigate();
	const { logout } = useApp();

	const [lang, setLang] = useState(() => {
		return localStorage.getItem('appLanguage') || 'fr';
	});

	const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

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
		theme: 'dark',
	});

	useEffect(() => {
		fetchProfile();
		loadSettings();
	}, []);

	useEffect(() => {
		localStorage.setItem('appLanguage', lang);
	}, [lang]);

	useEffect(() => {
		document.body.className = settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
	}, [settings.theme]);

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

	const isDark = settings.theme === 'dark';

	return (
		<div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-100'} flex`}>
			{/* Sidebar */}
			<div className={`w-64 ${isDark ? 'bg-gray-900' : 'bg-white'} border-r ${isDark ? 'border-gray-800' : 'border-gray-200'} fixed h-full overflow-y-auto`}>
				<div className='p-6'>
					<h2 className={`${isDark ? 'text-white' : 'text-gray-900'} font-black text-xl mb-6`}>{t.myAccount}</h2>

					<nav className='space-y-1'>
						<button
							onClick={() => setActiveSection('profile')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
								activeSection === 'profile'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span className='text-xl'>👥</span>
							<span className='font-medium'>{t.profile}</span>
						</button>

						<button
							onClick={() => setActiveSection('security')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
								activeSection === 'security'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span className='text-xl'>🛡️</span>
							<span className='font-medium'>{t.security}</span>
						</button>

						<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
							Préférences
						</div>

						<button
							onClick={() => setActiveSection('settings')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
								activeSection === 'settings'
									? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
									: `${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
							}`}>
							<span className='text-xl'>🔔</span>
							<span className='font-medium'>Notifications</span>
						</button>

						<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
							Mon activité
						</div>

						<Link
							to='/reviews'
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
							<span className='text-xl'>💬</span>
							<span className='font-medium'>{t.myReviews}</span>
						</Link>

						<div className={`pt-4 pb-2 px-4 text-xs font-bold uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
							Avancé
						</div>

						<button
							onClick={handleLogout}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}>
							<span className='text-xl'>🚪</span>
							<span className='font-medium'>{t.logout}</span>
						</button>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className='ml-64 flex-1 p-8'>
				{/* Profile Section */}
				{activeSection === 'profile' && (
					<div className='max-w-4xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.changeAvatar}</h1>

						{/* Selected Avatar */}
						<div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 mb-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<div className='flex items-center gap-4'>
								<img
									src={selectedAvatar.img}
									alt={selectedAvatar.name}
									className='w-20 h-20 rounded-full object-cover border-4 border-blue-500'
								/>
								<div>
									<p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedAvatar.name}</p>
									<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedAvatar.category}</p>
								</div>
							</div>
						</div>

						{/* Avatar Grid */}
						<div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<input
								type='text'
								placeholder={t.search}
								value={searchAvatar}
								onChange={(e) => setSearchAvatar(e.target.value)}
								className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500`}
							/>

							<div className='grid grid-cols-6 gap-4 max-h-96 overflow-y-auto'>
								{filteredAvatars.map(avatar => (
									<button
										key={avatar.id}
										onClick={() => setProfile({ ...profile, avatar: avatar.id })}
										className={`aspect-square rounded-xl overflow-hidden transition-all ${
											profile.avatar === avatar.id
												? 'ring-4 ring-blue-500 scale-105'
												: 'hover:scale-105 opacity-80 hover:opacity-100'
										}`}>
										<img
											src={avatar.img}
											alt={avatar.name}
											className='w-full h-full object-cover'
										/>
									</button>
								))}
							</div>
						</div>

						{/* Profile Form */}
						<form onSubmit={handleProfileUpdate} className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 mt-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<div className='grid grid-cols-2 gap-4 mb-4'>
								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.firstName}</label>
									<input
										type='text'
										value={profile.first_name}
										onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									/>
								</div>
								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.lastName}</label>
									<input
										type='text'
										value={profile.last_name}
										onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
									/>
								</div>
							</div>

							<div className='mb-4'>
								<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.email}</label>
								<input
									type='email'
									value={profile.email}
									disabled
									className={`w-full ${isDark ? 'bg-gray-800/50' : 'bg-gray-200'} border ${isDark ? 'border-gray-700' : 'border-gray-300'} text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed`}
								/>
								<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>{t.emailReadonly}</p>
							</div>

							<button
								type='submit'
								disabled={loading}
								className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors'>
								{loading ? t.saving : t.save}
							</button>
						</form>
					</div>
				)}

				{/* Security Section */}
				{activeSection === 'security' && (
					<div className='max-w-2xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.changePassword}</h1>

						<form onSubmit={handlePasswordChange} className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
							<div className='space-y-4'>
								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.oldPassword}</label>
									<input
										type='password'
										value={passwordData.old_password}
										onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.newPassword}</label>
									<input
										type='password'
										value={passwordData.new_password}
										onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.confirmPassword}</label>
									<input
										type='password'
										value={passwordData.confirm_password}
										onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
										className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
										required
									/>
								</div>

								<button
									type='submit'
									disabled={loading}
									className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors'>
									{loading ? t.changing : t.changeBtn}
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Settings Section */}
				{activeSection === 'settings' && (
					<div className='max-w-2xl'>
						<h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t.preferences}</h1>

						<div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'} space-y-6`}>
							{/* Notifications */}
							<div className='flex items-center justify-between'>
								<div>
									<p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.notifications}</p>
									<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.notificationsDesc}</p>
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

							{/* Language */}
							<div>
								<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.language}</label>
								<select
									value={lang}
									onChange={(e) => setLang(e.target.value)}
									className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}>
									<option value='fr'>Français 🇫🇷</option>
									<option value='en'>English 🇬🇧</option>
									<option value='es'>Español 🇪🇸</option>
								</select>
							</div>

							{/* Theme */}
							<div>
								<label className={`block text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{t.theme}</label>
								<select
									value={settings.theme}
									onChange={(e) => saveSettings({ ...settings, theme: e.target.value })}
									className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}>
									<option value='dark'>{t.dark} 🌙</option>
									<option value='light'>{t.light} ☀️</option>
								</select>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AccountSettings;
