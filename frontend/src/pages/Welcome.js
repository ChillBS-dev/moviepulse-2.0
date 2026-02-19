import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../Contexts/AppContext';

const Welcome = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		first_name: '',
		last_name: '',
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login, register } = useApp();

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
					toast.success('Connexion réussie !');
					navigate('/home');
				} else {
					toast.error('Email ou mot de passe incorrect');
				}
			} else {
				const success = await register(formData);

				if (success) {
					toast.success('Compte créé ! Vous pouvez maintenant vous connecter');
					setIsLogin(true);
					setFormData({ email: '', password: '', first_name: '', last_name: '' });
				} else {
					toast.error('Erreur lors de la création du compte');
				}
			}
		} catch (error) {
			toast.error('Une erreur est survenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4'>
			<div className='max-w-md w-full'>
				<div className='text-center mb-8'>
					<div className='flex items-center justify-center gap-2 mb-4'>
						<span className='text-5xl'>🎬</span>
						<h1 className='text-4xl font-black text-white tracking-tight'>
							Movie<span className='text-blue-400'>Pulse</span>
						</h1>
					</div>
					<p className='text-gray-400'>Découvrez les meilleurs films et séries</p>
				</div>

				<div className='bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700'>
					<div className='flex gap-2 mb-6'>
						<button
							onClick={() => setIsLogin(true)}
							className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
								isLogin
									? 'bg-blue-600 text-white'
									: 'bg-gray-700 text-gray-400 hover:text-white'
							}`}>
							Connexion
						</button>
						<button
							onClick={() => setIsLogin(false)}
							className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
								!isLogin
									? 'bg-blue-600 text-white'
									: 'bg-gray-700 text-gray-400 hover:text-white'
							}`}>
							Inscription
						</button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						{!isLogin && (
							<>
								<div>
									<label className='block text-sm font-semibold text-gray-400 mb-2'>Prénom</label>
									<input
										type='text'
										value={formData.first_name}
										onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
										className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-semibold text-gray-400 mb-2'>Nom</label>
									<input
										type='text'
										value={formData.last_name}
										onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
										className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
										required
									/>
								</div>
							</>
						)}

						<div>
							<label className='block text-sm font-semibold text-gray-400 mb-2'>Email</label>
							<input
								type='email'
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
								required
							/>
						</div>

						<div>
							<label className='block text-sm font-semibold text-gray-400 mb-2'>Mot de passe</label>
							<input
								type='password'
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								className='w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500'
								required
							/>
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
							{loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
