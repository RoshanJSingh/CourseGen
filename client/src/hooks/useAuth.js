import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    error,
    getAccessTokenSilently
  } = useAuth0();

  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
        } catch (err) {
          console.error('Error getting access token:', err);
        }
      } else {
        setAuthToken(null);
      }
    };

    getToken();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  const login = () => {
    loginWithRedirect({
      redirectUri: window.location.origin
    });
  };

  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
    error,
    token: authToken
  };
};

export default useAuth;
