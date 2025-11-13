import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import welcomeBackground from '../images/welcome-background.jpg';
import LoginModal from '../Components/LoginModal';

const WelcomeScreen = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleLoginModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div
			className='flex items-center justify-center min-h-screen bg-cover bg-center bg-opacity-90'
			style={{
				backgroundColor: 'rgba(13, 31, 51, 0.5)',
				backgroundImage: `linear-gradient(90deg, rgba(13, 31, 51, 0.9), rgba(13, 31, 51, 0.5)), url(${welcomeBackground})`,
			}}>
			<div className='text-center max-w-md px-6 animate-fadeIn'>
				<div className='mb-6 flex justify-center'>
					<div className='bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-600/50'>
						<svg className='w-12 h-12 text-white' fill='currentColor' viewBox='0 0 20 20'>
							<path d='M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z' />
						</svg>
					</div>
				</div>
				<h1 className='text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
					Movie Pulse
				</h1>
				<p className='text-lg text-gray-300 mb-10'>Discover and enjoy the latest movies and series</p>
				<div className='space-y-4'>
					<button
						onClick={toggleLoginModal}
						className='bg-[#0d1f33] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#162d4a] transition-all duration-300 w-full shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1'>
						Get Started
					</button>
					<Link 
						to={'/home'} 
						className='block text-gray-300 text-sm hover:text-white transition-colors duration-200 underline-offset-4 hover:underline'>
						Continue as Guest →
					</Link>
				</div>
			</div>
			{isModalOpen ? (
				<LoginModal isOpen={isModalOpen} onClose={toggleLoginModal} />
			) : null}
		</div>
	);
};

export default WelcomeScreen;
