import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [searchQuery, setSearchQuery] = useState('Movies');
	const [localMovies, setLocalMovies] = useState([]);
	const [theme, setTheme] = useState(() => {
		return localStorage.getItem('appTheme') || 'dark';
	});

	useEffect(() => {
		localStorage.setItem('appTheme', theme);
	}, [theme]);

	const login = async (credentials) => {
		try {
			const response = await fetch('https://moviepulse-backend.onrender.com/api/login/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('accessToken', data.access);
				localStorage.setItem('refreshToken', data.refresh);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Login error:', error);
			return false;
		}
	};

	const register = async (userData) => {
		try {
			const response = await fetch('https://moviepulse-backend.onrender.com/api/register/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				return true;
			}
			return false;
		} catch (error) {
			console.error('Register error:', error);
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('isAdmin');
	};

	return (
		<AppContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				localMovies,
				setLocalMovies,
				login,
				register,
				logout,
				theme,
				setTheme,
			}}>
			{children}
		</AppContext.Provider>
	);
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useApp must be used within AppProvider');
	}
	return context;
};
