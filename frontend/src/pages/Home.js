import TopBar from '../Components/TopBar';
import Catalogue from '../Components/Catalogue';
import { useApp } from '../Contexts/AppContext';
import Header from '../Components/Header';

function Home() {
	const { user } = useApp();

	return (
		<div className='md:flex flex-row min-h-screen bg-gray-900'>
			<div className={`${user ? 'hidden md:flex' : 'hidden'}`}>
				<SidebarPage />
			</div>
			<div
				className={`${user ? 'md:ml-56 basis-11/12' : 'w-full'} bg-gray-900`}>
				<Header />
				<Catalogue />
			</div>
		</div>
	);
}

export default Home;
