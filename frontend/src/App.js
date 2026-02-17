import Trending from './pages/Trending';  // en haut
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WelcomeScreen from './pages/Welcome';
import Home from './pages/Home';
import { AppProvider, useApp } from './Contexts/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieDetail from './Components/MovieDetail';
import DropdownMenu from './Components/DropdownMenu';
import Favourite from './Components/Favourite';

// ProtectedRoute: Only for routes that MUST have authentication
const ProtectedRoute = ({ children }) => {
	const { user } = useApp();
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
					{/* Home is now accessible to guests */}
                    <Route path='/trending' element={<Trending />} />
					<Route path='/home' element={<Home />} />
					<Route path='/movie/:id' element={<MovieDetail />} />
					<Route path='/logout' element={<Navigate to='/' />} />
					<Route
						path='/account'
						element={
							<ProtectedRoute>
								<DropdownMenu username={username} />
							</ProtectedRoute>
						}
					/>
					{/* Favorites accessible to guests (uses localStorage) */}
					<Route path='/favorites' element={<Favourite />} />
				</Routes>
			</Router>
		</AppProvider>
	);
}

export default App;
