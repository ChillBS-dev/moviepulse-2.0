import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useApp } from '../../Contexts/AppContext';

function Search() {
	const { setSearchQuery } = useApp();
	const [formData, setFormData] = useState({
		searchQuery: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSearch = () => {
		setSearchQuery(formData.searchQuery);
	};

	return (
		<div className='w-full max-w-2xl'>
			<form onSubmit={handleSearch} className='relative'>
				<div className='relative group'>
					<div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
						<FaSearch
							size={20}
							className='text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200'
						/>
					</div>
					<input
						name='searchQuery'
						value={formData.searchQuery}
						onChange={(e) => {
							handleChange(e);
						}}
						placeholder='Search movies, series, documentaries...'
						className='text-gray-200 text-base w-full border-2 border-gray-700 outline-none bg-[#0d1f33] rounded-xl pl-12 pr-4 py-3 md:py-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500'
					/>
					{formData.searchQuery && (
						<button
							type='button'
							onClick={() => setFormData({ searchQuery: '' })}
							className='absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors'>
							<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					)}
				</div>
			</form>
		</div>
	);
}

export default Search;
