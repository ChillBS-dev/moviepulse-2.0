import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	// Theme: persisted as 'dark' or 'light' in localStorage
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [theme, setTheme] = useState('dark');
	const [searchQuery, setSearchQuery] = useState('Trending');
	const [isGuest, setIsGuest] = useState(true); // Track guest status
	const [localMovies, setLocalMovies] = useState([]); // cache of last-fetched movies for client-side search
	
	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			setUser({ token });
			setIsGuest(false);
		} else {
			setIsGuest(true);
		}

		// Initialize theme from localStorage or default to 'dark'
		const savedTheme = localStorage.getItem('theme') || 'dark';
		setTheme(savedTheme);
		setIsDarkMode(savedTheme === 'dark');
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const login = async (userData) => {
		try {
			const response = await axios.post(API_ENDPOINTS.login, userData);
			const { access, refresh } = response.data;
			localStorage.setItem('accessToken', access);
			localStorage.setItem('refreshToken', refresh);

			setUser(response.data);
			setIsGuest(false);
			toast.success('Login successful!', { autoClose: 3000 });

			return true;
		} catch (error) {
			console.error('An error occurred while logging in', error);
			toast.error('Login failed! Please check your credentials.', {
				autoClose: 3000,
			});
			return false;
		}
	};

	const register = async (userData) => {
		try {
			await axios.post(API_ENDPOINTS.register, userData);
			toast.success('Registration successful! Please login.', { autoClose: 3000 });
			return true;
		} catch (error) {
			toast.error('Registration failed! Please try again.', {
				autoClose: 3000,
			});
			return false;
		}
	};

	const logout = () => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			axios.post(API_ENDPOINTS.logout, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).catch(err => console.error('Logout error:', err));
		}
		
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setUser(null);
		setIsGuest(true);
		toast.success('Logout successful!', { autoClose: 3000 });
	};

	const toggleTheme = () => {
		const next = !isDarkMode;
		setIsDarkMode(next);
		const nextTheme = next ? 'dark' : 'light';
		setTheme(nextTheme);
		localStorage.setItem('theme', nextTheme);
		if (next) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const contextValue = {
		searchQuery,
		setSearchQuery,
		user,
		isGuest,
		localMovies,
		setLocalMovies,
		login,
		logout,
		register,
		isDarkMode,
		theme,
		toggleTheme,
	};

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	);
};

export const useApp = () => useContext(AppContext);
