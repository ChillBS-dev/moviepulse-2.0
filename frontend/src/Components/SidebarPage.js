import React from 'react';
import {
	FaHome,
	FaHeart,
	FaFire,
	FaSignOutAlt,
	FaRegClock,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

const SidebarPage = () => {
	const navigate = useNavigate();
	const { logout } = useApp();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<div className='w-56 border-r border-gray-800 h-screen bg-gray-900 text-white flex flex-col fixed shadow-2xl'>
			{/* Watch Icon Heading */}
			<div className='flex items-center p-5 bg-gray-800 border-b border-gray-700 shadow-lg'>
				<div className='bg-yellow-500/10 p-2 rounded-lg mr-3'>
					<FaRegClock className='text-yellow-400 text-xl' />
				</div>
				<span className='text-lg font-bold'>Watch List</span>
			</div>

			{/* Top Section: Home, Favorites, Trending */}
			<ul className='flex-1 mt-6 space-y-2 px-3'>
				<li className='group'>
					<Link to='/home' className='flex items-center w-full p-3.5 rounded-xl hover:bg-gray-800 cursor-pointer transition-all duration-200 group-hover:translate-x-1'>
						<div className='bg-blue-500/10 p-2 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors'>
							<FaHome className='text-blue-400 text-lg' />
						</div>
						<span className='font-medium group-hover:text-blue-400 transition-colors'>Home</span>
					</Link>
				</li>
				<li className='group'>
					<Link to='/favorites' className='flex items-center w-full p-3.5 rounded-xl hover:bg-gray-800 cursor-pointer transition-all duration-200 group-hover:translate-x-1'>
						<div className='bg-red-500/10 p-2 rounded-lg mr-3 group-hover:bg-red-500/20 transition-colors'>
							<FaHeart className='text-red-400 text-lg' />
						</div>
						<span className='font-medium group-hover:text-red-400 transition-colors'>Favorites</span>
					</Link>
				</li>
				<li className='group'>
					<Link to='/trending' className='flex items-center w-full p-3.5 rounded-xl hover:bg-gray-800 cursor-pointer transition-all duration-200 group-hover:translate-x-1'>
						<div className='bg-yellow-500/10 p-2 rounded-lg mr-3 group-hover:bg-yellow-500/20 transition-colors'>
							<FaFire className='text-yellow-400 text-lg' />
						</div>
						<span className='font-medium group-hover:text-yellow-400 transition-colors'>Trending</span>
					</Link>
				</li>
			</ul>

			{/* Bottom Section: Logout */}
			<div className='mt-auto border-t border-gray-800 p-3'>
				<button 
					onClick={handleLogout}
					className='flex items-center w-full p-3.5 rounded-xl hover:bg-red-500/10 cursor-pointer transition-all duration-200 group'>
					<div className='bg-red-500/10 p-2 rounded-lg mr-3 group-hover:bg-red-500/20 transition-colors'>
						<FaSignOutAlt className='text-red-500 text-lg' />
					</div>
					<span className='font-medium group-hover:text-red-400 transition-colors'>Log Out</span>
				</button>
			</div>
		</div>
	);
};

export default SidebarPage;
