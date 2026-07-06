import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Premium Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Activity className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  MRT <span className="text-blue-600">AI</span>
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex ml-10 space-x-8">
                <Link 
                  to="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/' ? 'border-blue-600 text-gray-950' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/architecture" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/architecture' ? 'border-blue-600 text-gray-950' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Architecture
                </Link>
              </div>
            </div>
            
            {/* Desktop Auth & Dashboard Buttons */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Launch Dashboard
                  </Link>
                  <div className="flex items-center gap-4 ml-2 pl-6 border-l border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span className="truncate max-w-[150px]">{user.email}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-4 space-y-1 shadow-md">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/architecture"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Architecture
            </Link>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 flex items-center gap-2 text-gray-500 text-sm">
                  <User className="w-4 h-4" /> {user.email}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Page Content injected via React Router */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-700">Medical Research Translator AI</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MRT AI. Built for clinical precision and public transparency.
          </p>
        </div>
      </footer>
    </div>
  );
}
