import FuseUtils from '@fuse/utils/FuseUtils';
import jwtDecode from 'jwt-decode';
import { axiosWithoutAccess, axiosMain } from 'app/configs/axiosConfig';
import jwtServiceConfig from './jwtServiceConfig';
import UserAdaptor from '../../AuthAdaptor';

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    // executé au l'ouverture d'une nouvelle page ou au rafraichisement
    this.setInterceptors();
    this.handleAuthentication();
    if (window.sessionStorage.getItem('single_jwt_access_token')) {
      this.setInterceptorsForDirectConnect();
    }
  }

  // interceptors
  setInterceptors = () => {
    // executé avant chaque request
    axiosMain.interceptors.request.use(
      async (config) => {
        const access_token = this.getAccessToken();

        if (!this.isAuthTokenValid(access_token)) {
          const refresh_token = this.getRefreshToken();
          if (this.isAuthTokenValid(refresh_token)) {
            await this.getNewAccessToken();
            config.headers = {
              Authorization: `Bearer ${this.getAccessToken()}`,
            };
          } else {
            this.emit('onAutoLogout', 'Votre session a expiré.');
            this.setSession(null);
          }
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    // executé apres chaque request
    axiosMain.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            this.emit('onAutoLogout', 'Votre session a expiré.');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  setInterceptorsForDirectConnect = () => {
    // executé avant chaque request
    axiosMain.interceptors.request.use(
      async (config) => {
        const access_token = this.getAccessToken();
        if (this.isAuthTokenValid(access_token)) {
          config.headers = {
            'X-Authorization': `Bearer ${this.getAccessToken()}`,
          };
        } else {
          this.emit('onAutoLogout', 'Votre session a expiré.');
          this.setSession(null);
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    // executé apres chaque request
    axiosMain.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            this.emit('onAutoLogout', 'Votre session a expiré.');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  // authentication
  handleAuthentication = () => {
    const refresh_token = this.getRefreshToken();
    if (!refresh_token) {
      this.emit('onNoAccessToken', 'Votre session a expiré.');
      return;
    }
    if (this.isAuthTokenValid(refresh_token)) {
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'Votre session a expiré.');
    }
  };

  signInWithEmailAndPassword = async (email, password) => {
    try {
      const tokens = await axiosWithoutAccess.post(jwtServiceConfig.token, {
        email,
        password,
      });
      this.setSession(tokens.data.refresh);
      this.setAccess(tokens.data.access);
      try {
        const session = await this.getUserInfo();
        this.emit('onLogin', session);
        return session;
      } catch (err) {
        throw err;
      }
    } catch (err) {
      throw err;
    }
  };

  signInWithIdAndKey = async (id, password) => {
    try {
      const tokens = await axiosWithoutAccess.post(jwtServiceConfig.applicantToken, {
        id,
        password,
      });
      this.setSession(tokens.data.refresh);
      this.setAccess(tokens.data.access);
      try {
        const session = await this.getUserInfo();
        this.emit('onLogin', session);
        return session;
      } catch (err) {
        throw err;
      }
    } catch (err) {
      throw err;
    }
  };

  signInWithToken = async () => {
    try {
      await this.getNewAccessToken();
      const userInfos = await this.getUserInfo();
      return userInfos;
    } catch (err) {
      throw err;
    }
  };


  // JWT Management
  isAuthTokenValid = (token) => {
    if (!token) {
      return false;
    }
    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    const token = window.localStorage.getItem('jwt_access_token');
    if (token) {
      return token;
    }
    return window.sessionStorage.getItem('single_jwt_access_token');
  };

  getRefreshToken = () => {
    return window.localStorage.getItem('jwt_refresh_token');
  };

  getNewAccessToken = async () => {
    const refresh_token = this.getRefreshToken();

    await axiosWithoutAccess
      .post(jwtServiceConfig.refreshToken, {
        refresh: refresh_token,
      })
      .then((response) => {
        this.setAccess(response.data.access);
      });
  };

  setSession = (refresh_token) => {
    if (refresh_token) {
      localStorage.setItem('jwt_refresh_token', refresh_token);
    } else {
      localStorage.removeItem('jwt_access_token');
      localStorage.removeItem('jwt_refresh_token');
      delete axiosMain.defaults.headers.common.Authorization;
    }
  };

  setAccess = (access_token) => {
    localStorage.setItem('jwt_access_token', access_token);
    axiosMain.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Vous êtes deconnecté.');
  };

  updateUserData = (user) => {
    return axiosMain.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setTemporarySession = (token) => {
    // do not store session in localStorage.
    window.sessionStorage.setItem('single_jwt_access_token', token);
  };

  directConnect = (token) => {
    // handle auto login with scoped Bearer.
    // should return the scope if valid.
    if (this.isAuthTokenValid(token)) {
      this.setTemporarySession(token);
      const payload = jwtDecode(token);
      this.setInterceptorsForDirectConnect();
      return payload.scope;
    }
  };
}

const instance = new JwtService();

export default instance;
