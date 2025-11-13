import { Bell } from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import { useApp } from '../Contexts/AppContext';

function Header () {
  const { isGuest } = useApp();
  
  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-xl border-b border-gray-800">
      <div className='flex items-center gap-3'>
        <div className='bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/50'>
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z' />
          </svg>
        </div>
        <div className='flex flex-col'>
          <span className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
            Movie Pulse
          </span>
          {isGuest && (
            <span className='text-xs text-gray-400'>Guest Mode</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {!isGuest && (
          <div className='relative group'>
            <Bell className="cursor-pointer text-gray-400 hover:text-blue-400 transition-colors duration-200" size={24} />
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg'>3</span>
          </div>
        )}
        <DropdownMenu username={isGuest ? "Guest" : "User"} />
      </div>
    </header>
  );
};

export default Header;