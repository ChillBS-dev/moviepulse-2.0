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
					toast.success('🎉 Connexion réussie !');
					navigate('/home');
				} else {
					toast.error('❌ Email ou mot de passe incorrect');
				}
			} else {
				const success = await register(formData);

				if (success) {
					toast.success('✅ Compte créé ! Vous pouvez maintenant vous connecter');
					setIsLogin(true);
					setFormData({ email: '', password: '', first_name: '', last_name: '' });
				} else {
					toast.error('❌ Erreur lors de la création du compte');
				}
			}
		} catch (error) {
			toast.error('❌ Une erreur est survenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen relative overflow-hidden flex items-center justify-center p-4'>
			{/* Enhanced Animated Background */}
			<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'>
				<div className='absolute inset-0'>
					<div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse' />
					<div className='absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
					<div className='absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '2s' }} />
				</div>
			</div>

			{/* Floating particles */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className='absolute w-2 h-2 bg-white/20 rounded-full'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
							animationDelay: `${Math.random() * 5}s`,
						}}
					/>
				))}
			</div>

			<div className='relative max-w-md w-full z-10'>
				{/* Logo & Title */}
				<div className='text-center mb-8'>
					<div className='flex items-center justify-center gap-2 mb-4'>
						<span className='text-5xl'>🎬</span>
						<h1 className='text-4xl font-black text-white tracking-tight'>
							Movie<span className='text-blue-400'>Pulse</span>
						</h1>
					</div>
					<p className='text-gray-400'>Découvrez les meilleurs films et séries</p>
				</div>

				{/* Main Card */}
				<div className='bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700'>
					{/* Tabs */}
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

					{/* Form */}
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

			<style jsx>{`
				@keyframes float {
					0%, 100% { transform: translateY(0px) translateX(0px); }
					50% { transform: translateY(-20px) translateX(10px); }
				}
			`}</style>
		</div>
	);
};

export default Welcome;
