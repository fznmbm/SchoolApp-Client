import axiosInstance from '@utils/api/axios';


const AuthService = {
  isAuthenticated: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    try {
      await axiosInstance.get('/auth/me');
      return true;
    } catch (error) {
      // If token validation fails, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  },
  
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // If Remember Me is enabled, store this preference
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  

  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isRememberMeEnabled: () => {
    return localStorage.getItem('rememberMe') === 'true';
  }
};

export default AuthService;