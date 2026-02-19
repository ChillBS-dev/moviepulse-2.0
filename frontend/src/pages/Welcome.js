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
			{/* Animated Background */}
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
						className='absolute w-2 h-2 bg-white/20 rounded-full animate-float'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${5 + Math.random() * 10}s`,
						}}
					/>
				))}
			</div>

			<div className='relative max-w-md w-full z-10'>
				{/* Logo & Title */}
				<div className='text-center mb-8 animate-fade-in-down'>
					<div className='flex items-center justify-center gap-3 mb-4'>
						<div className='relative'>
							<span className='text-6xl animate-bounce-slow'>🎬</span>
							<div className='absolute inset-0 blur-xl bg-blue-400/50 rounded-full animate-pulse' />
						</div>
						<h1 className='text-5xl font-black text-white tracking-tight'>
							Movie<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'>Pulse</span>
						</h1>
					</div>
					<p className='text-gray-300 text-lg font-medium'>
						Découvrez les meilleurs films et séries 🍿
					</p>
				</div>

				{/* Main Card */}
				<div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in-up'>
					{/* Tabs */}
					<div className='flex gap-2 mb-8 bg-black/30 rounded-2xl p-1.5'>
						<button
							onClick={() => setIsLogin(true)}
							className={`flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
								isLogin
									? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
									: 'text-gray-300 hover:text-white'
							}`}>
							🔐 Connexion
						</button>
						<button
							onClick={() => setIsLogin(false)}
							className={`flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
								!isLogin
									? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
									: 'text-gray-300 hover:text-white'
							}`}>
							✨ Inscription
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-5'>
						{!isLogin && (
							<div className='grid grid-cols-2 gap-4 animate-slide-in-left'>
								<div>
									<label className='block text-sm font-bold text-gray-200 mb-2'>Prénom</label>
									<input
										type='text'
										value={formData.first_name}
										onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
										className='w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all'
										placeholder='John'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-bold text-gray-200 mb-2'>Nom</label>
									<input
										type='text'
										value={formData.last_name}
										onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
										className='w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all'
										placeholder='Doe'
										required
									/>
								</div>
							</div>
						)}

						<div className='animate-slide-in-right'>
							<label className='block text-sm font-bold text-gray-200 mb-2'>📧 Email</label>
							<input
								type='email'
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className='w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all'
								placeholder='vous@exemple.com'
								required
							/>
						</div>

						<div className='animate-slide-in-left'>
							<label className='block text-sm font-bold text-gray-200 mb-2'>🔒 Mot de passe</label>
							<input
								type='password'
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								className='w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all'
								placeholder='••••••••'
								required
							/>
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100'>
							{loading ? (
								<span className='flex items-center justify-center gap-2'>
									<svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
										<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
										<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
									</svg>
									Chargement...
								</span>
							) : (
								<span className='flex items-center justify-center gap-2'>
									{isLogin ? '🚀 Se connecter' : '✨ Créer mon compte'}
								</span>
							)}
						</button>
					</form>
				</div>

				{/* Footer */}
				<p className='text-center text-gray-400 text-sm mt-6 animate-fade-in'>
					En continuant, vous acceptez nos conditions d'utilisation
				</p>
			</div>

			<style jsx>{`
				@keyframes float {
					0%, 100% { transform: translateY(0px) translateX(0px); }
					50% { transform: translateY(-20px) translateX(10px); }
				}
				@keyframes fade-in-down {
					from { opacity: 0; transform: translateY(-20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes fade-in-up {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes slide-in-left {
					from { opacity: 0; transform: translateX(-20px); }
					to { opacity: 1; transform: translateX(0); }
				}
				@keyframes slide-in-right {
					from { opacity: 0; transform: translateX(20px); }
					to { opacity: 1; transform: translateX(0); }
				}
				@keyframes fade-in {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes bounce-slow {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-10px); }
				}
				.animate-float { animation: float linear infinite; }
				.animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
				.animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.2s both; }
				.animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
				.animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
				.animate-fade-in { animation: fade-in 1s ease-out 0.5s both; }
				.animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
			`}</style>
		</div>
	);
};

export default Welcome;
