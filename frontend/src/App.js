import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WelcomeScreen from './pages/Welcome';
import Home from './pages/Home';
import Trending from './pages/Trending';
import AccountSettings from './pages/AccountSettings';
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
					<Route path='/home' element={<Layout><Home /></Layout>} />
					<Route path='/trending' element={<Layout><Trending /></Layout>} />
					<Route path='/movie/:id' element={<Layout><MovieDetail /></Layout>} />
					<Route path='/logout' element={<Navigate to='/' />} />
					<Route path='/account' element={<ProtectedRoute><Layout><AccountSettings /></Layout></ProtectedRoute>} />
					<Route path='/favorites' element={<Layout><Favourite /></Layout>} />
				</Routes>
			</Router>
		</AppProvider>
	);
}

export default App;
