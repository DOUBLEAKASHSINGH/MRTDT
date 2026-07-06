import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { deleteUser } from 'firebase/auth';
import { User, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
    );
    
    if (!confirmDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        navigate('/'); // Redirect to home on success
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('For security reasons, please log out and log back in before deleting your account.');
      } else {
        setError('Failed to delete account. Please try again later.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-600" /> Profile Information
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-100">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="text-base text-gray-900 font-semibold mt-1">{user.email}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm font-medium text-gray-500">Account ID</p>
            <p className="text-sm text-gray-900 font-mono mt-1">{user.uid}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 md:p-8">
        <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" /> Danger Zone
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Once you delete your account, there is no going back. All of your synced data, saved reports, and authentication credentials will be wiped from our Firebase servers. Please be certain.
        </p>
        
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" /> Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
            </>
          )}
        </button>
      </div>
    </div>
  );
}
