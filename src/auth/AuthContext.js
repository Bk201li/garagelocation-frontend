import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import { setCompany } from 'app/store/companySlice';

import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Vous êtes reconnecté.' }));

      jwtService
        .signInWithToken()
        .then((session) => {
          success(session, 'Vous êtes reconnecté.');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    jwtService.on('onLogin', (session) => {
      success(session, 'Vous êtes connecté.');
    });

    jwtService.on('onLogout', () => {
      pass('Vous êtes deconnecté.');

      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.on('websocketClosed', (message) => {
      dispatch(
        showMessage({
          message,
          variant: 'error',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        })
      );
    });

    jwtService.init();

    function success(session, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        dispatch(setUser(session.user)),
        dispatch(setCompany(session.company)),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
