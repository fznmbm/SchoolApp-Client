import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Wrap the login function to handle navigation
  const login = async (credentials, redirectPath = '/') => {
    // Create a redirect callback to avoid issues with navigation during the login process
    const redirectCallback = () => {
      navigate(redirectPath, { replace: true });
    };

    return await auth.login(credentials, redirectCallback);
  };

  // Wrap the logout function to handle navigation
  const logout = () => {
    auth.logout();
    navigate('/login', { replace: true });
  };

  return {
    // Spread all auth context values
    ...auth,
    
    // Override with navigation-enhanced versions
    login,
    logout
  };
};

export default useAuth;