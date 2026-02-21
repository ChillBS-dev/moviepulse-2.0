import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WelcomeScreen from './pages/Welcome';
import Home from './pages/Home';
import Trending from './pages/Trending';
import AccountSettings from './pages/AccountSettings';
import AdminPanel from './pages/AdminPanel';
import { AppProvider } from './Contexts/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieDetail from './Components/MovieDetail';
import Favourite from './Components/Favourite';
import Layout from './Components/Layout';

const ProtectedRoute = ({ children }) => {
	const accessToken = localStorage.getItem('accessToken');
	return accessToken ? children : <Navigate to='/' />;
};

const AdminRoute = ({ children }) => {
	const accessToken = localStorage.getItem('accessToken');
	const isAdmin = localStorage.getItem('isAdmin') === 'true';
	return accessToken && isAdmin ? children : <Navigate to='/home' />;
};

function App() {
	const accessToken = localStorage.getItem('accessToken');
	let username = '';
	if (accessToken) {
		try {
			const decodedToken = jwtDecode(accessToken);
			username = decodedToken.username;
		} catch (error) {
			console.error('Error decoding token:', error);
		}
	}

	return (
		<AppProvider>
			<Router>
				<ToastContainer position='top-right' autoClose={3000} />
				<Routes>
					<Route path='/' element={<WelcomeScreen />} />
					<Route path='/home' element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
					<Route path='/trending' element={<ProtectedRoute><Layout><Trending /></Layout></ProtectedRoute>} />
					<Route path='/movie/:id' element={<ProtectedRoute><Layout><MovieDetail /></Layout></ProtectedRoute>} />
					<Route path='/logout' element={<Navigate to='/' />} />
					<Route path='/account' element={<ProtectedRoute><Layout><AccountSettings /></Layout></ProtectedRoute>} />
					<Route path='/favorites' element={<ProtectedRoute><Layout><Favourite /></Layout></ProtectedRoute>} />
					<Route path='/admin' element={<AdminRoute><Layout><AdminPanel /></Layout></AdminRoute>} />
				</Routes>
			</Router>
		</AppProvider>
	);
}

export default App;
