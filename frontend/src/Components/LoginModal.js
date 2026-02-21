import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const LoginModal = ({ isOpen, onClose }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		first_name: '',
		last_name: '',
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useApp();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (isLogin) {
				const success = await login({
					email: formData.email,
					password: formData.password,
				});

				if (success) {
					toast.success('🎉 Connexion réussie !');
					onClose();
					navigate('/home');
				} else {
					toast.error('❌ Email ou mot de passe incorrect');
				}
			} else {
				// Validation côté client
				if (!formData.first_name.trim()) {
					toast.error('❌ Le prénom est requis');
					setLoading(false);
					return;
				}
				if (!formData.last_name.trim()) {
					toast.error('❌ Le nom est requis');
					setLoading(false);
					return;
				}
				if (!formData.email.includes('@')) {
					toast.error('❌ Email invalide');
					setLoading(false);
					return;
				}
				if (formData.password.length < 8) {
					toast.error('❌ Le mot de passe doit contenir au moins 8 caractères');
					setLoading(false);
					return;
				}

				// Appel direct au backend pour mieux voir les erreurs
				try {
					const response = await fetch('https://moviepulse-backend.onrender.com/api/register/', {
						method: 'POST',
						headers: { 
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							first_name: formData.first_name.trim(),
							last_name: formData.last_name.trim(),
							email: formData.email.trim().toLowerCase(),
							password: formData.password,
						}),
					});

					const data = await response.json();
					console.log('Backend response:', response.status, data);

					if (response.ok) {
						toast.success('✅ Compte créé ! Vous pouvez maintenant vous connecter');
						setIsLogin(true);
						setFormData({ email: formData.email, password: '', first_name: '', last_name: '' });
					} else {
						// Afficher les erreurs spécifiques du backend
						if (data.email) {
							toast.error(`❌ Email: ${data.email[0]}`);
						} else if (data.password) {
							toast.error(`❌ Mot de passe: ${data.password[0]}`);
						} else if (data.detail) {
							toast.error(`❌ ${data.detail}`);
						} else if (data.error) {
							toast.error(`❌ ${data.error}`);
						} else {
							toast.error('❌ Erreur lors de la création du compte');
							console.error('Erreur backend:', data);
						}
					}
				} catch (fetchError) {
					console.error('Fetch error:', fetchError);
					toast.error('❌ Erreur de connexion au serveur');
				}
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('❌ Une erreur est survenue');
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn'>
			<div className='bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700 animate-scaleIn relative'>
				{/* Close button */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
					type='button'>
					<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
					</svg>
				</button>

				{/* Tabs */}
				<div className='flex gap-2 mb-6'>
					<button
						type='button'
						onClick={() => setIsLogin(true)}
						className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
							isLogin
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 text-gray-400 hover:text-white'
						}`}>
						Connexion
					</button>
					<button
						type='button'
						onClick={() => setIsLogin(false)}
						className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
							!isLogin
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 text-gray-400 hover:text-white'
						}`}>
						Inscription
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className='space-y-4'>
					{!isLogin && (
						<>
							<div>
								<label className='block text-sm font-semibold text-gray-400 mb-2'>Prénom *</label>
								<input
									type='text'
									value={formData.first_name}
									onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
									className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
									placeholder='Votre prénom'
									required
									minLength={2}
								/>
							</div>
							<div>
								<label className='block text-sm font-semibold text-gray-400 mb-2'>Nom *</label>
								<input
									type='text'
									value={formData.last_name}
									onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
									className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
									placeholder='Votre nom'
									required
									minLength={2}
								/>
							</div>
						</>
					)}

					<div>
						<label className='block text-sm font-semibold text-gray-400 mb-2'>Email *</label>
						<input
							type='email'
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
							placeholder='votre@email.com'
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-semibold text-gray-400 mb-2'>
							Mot de passe * {!isLogin && <span className='text-xs text-gray-500'>(min. 8 caractères)</span>}
						</label>
						<input
							type='password'
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
							placeholder='••••••••'
							required
							minLength={8}
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6'>
						{loading ? (
							<span className='flex items-center justify-center gap-2'>
								<svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
									<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
								</svg>
								Chargement...
							</span>
						) : (
							isLogin ? 'Se connecter' : "S'inscrire"
						)}
					</button>
				</form>

				{!isLogin && (
					<p className='text-xs text-gray-500 text-center mt-4'>
						En vous inscrivant, vous acceptez nos conditions d'utilisation
					</p>
				)}
			</div>
		</div>
	);
};

export default LoginModal;
