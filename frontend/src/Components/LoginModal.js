import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';
import { toast } from 'react-toastify';

function LoginModal({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		password2: '',
		first_name: '',
		last_name: '',
	});
	const [isRegister, setIsRegister] = useState(false);

	const navigate = useNavigate();
	const { login, register } = useApp();

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			navigate('/home');
		}
	}, [navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			let success;
			if (isRegister) {
				if (formData.password !== formData.password2) {
					toast.error('Passwords do not match!');
					return;
				}

				success = await register({
					email: formData.email,
					first_name: formData.first_name,
					last_name: formData.last_name,
					password: formData.password,
					password2: formData.password2,
				});
			} else {
				success = await login({
					email: formData.email,
					password: formData.password,
				});
			}

			if (success) {
				toast.success(
					isRegister ? 'Registration successful' : 'Login successful'
				);
				navigate('/home');
				onClose();
			} else {
				toast.error('Authentication failed. Please try again.');
			}
		} catch (error) {
			toast.error('An error occurred. Please try again.');
		}
	};

	const toggleIsRegister = () => {
		setIsRegister(!isRegister);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn'>
			<div className='bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-3xl font-bold text-gray-800'>
						{isRegister ? 'Create Account' : 'Welcome Back'}
					</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg'>
						<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='email'
							className='block mb-2 text-sm font-semibold text-gray-700'>
							Email Address
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
							placeholder='you@example.com'
							required
						/>
					</div>
					{isRegister && (
						<>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label
										htmlFor='first_name'
										className='block mb-2 text-sm font-semibold text-gray-700'>
										First Name
									</label>
									<input
										type='text'
										id='first_name'
										name='first_name'
										value={formData.first_name}
										onChange={handleChange}
										className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
										placeholder='John'
										required
									/>
								</div>
								<div>
									<label
										htmlFor='last_name'
										className='block mb-2 text-sm font-semibold text-gray-700'>
										Last Name
									</label>
									<input
										type='text'
										id='last_name'
										name='last_name'
										value={formData.last_name}
										onChange={handleChange}
										className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
										placeholder='Doe'
										required
									/>
								</div>
							</div>
						</>
					)}
					<div>
						<label
							htmlFor='password'
							className='block mb-2 text-sm font-semibold text-gray-700'>
							Password
						</label>
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
							placeholder='••••••••'
							required
						/>
					</div>
					{isRegister && (
						<div>
							<label
								htmlFor='password2'
								className='block mb-2 text-sm font-semibold text-gray-700'>
								Confirm Password
							</label>
							<input
								type='password'
								id='password2'
								name='password2'
								value={formData.password2}
								onChange={handleChange}
								className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
								placeholder='••••••••'
								required
							/>
						</div>
					)}
					<button
						type='submit'
						className='w-full bg-[#0d1f33] text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-[#162d4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
						{isRegister ? 'Create Account' : 'Sign In'}
					</button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-gray-600 text-sm'>
						{isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
						<button
							onClick={toggleIsRegister}
							className='text-[#0d1f33] font-semibold hover:underline transition-all'>
							{isRegister ? 'Sign In' : 'Sign Up'}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}

export default LoginModal;
