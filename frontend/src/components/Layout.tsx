import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, User } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">MedTranslator</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{user}</span>
                  </div>
                  <button 
                    onClick={logout}
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
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">MedTranslator</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Medical Research Translator. Built for professionals and patients.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
