// src/pages/AuthSuccess.jsx

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthSuccess = () => {
      try {
        // Get data from URL params
        const data = searchParams.get('data');
        
        if (data) {
          // Parse the user data
          const authData = JSON.parse(decodeURIComponent(data));
          console.log('Auth success data:', authData);
          
          // Dispatch to Redux store
          dispatch(setCredentials(authData));
          
          // Send message to parent window (if opened as popup)
          if (window.opener) {
            window.opener.postMessage({
              type: 'AUTH_SUCCESS',
              payload: authData
            }, 'http://localhost:5173');
            window.close();
          } else {
            // If not a popup, navigate based on profile completeness
            if (!authData.user.name || !authData.user.category) {
              navigate('/profile-setup');
            } else {
              navigate('/home');
            }
          }
        } else {
          // Handle error case
          const error = searchParams.get('error');
          console.error('Auth error:', error);
          
          if (window.opener) {
            window.opener.postMessage({
              type: 'AUTH_ERROR',
              message: error || 'Authentication failed'
            }, 'http://localhost:5173');
            window.close();
          } else {
            navigate('/?error=' + (error || 'auth_failed'));
          }
        }
      } catch (err) {
        console.error('Error processing auth success:', err);
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'AUTH_ERROR',
            message: 'Failed to process authentication'
          }, 'http://localhost:5173');
          window.close();
        } else {
          navigate('/?error=processing_failed');
        }
      }
    };

    handleAuthSuccess();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processing Authentication...</h2>
        <p className="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}