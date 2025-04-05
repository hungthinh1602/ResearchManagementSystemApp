import {
  API_ENDPOINTS,
  apiRequest,
  DEFAULT_HEADERS,
} from '../config/api';

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      return await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },

  register: async (userData: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    try {
      return await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Register error details:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      return await apiRequest(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Refresh token error details:', error);
      throw error;
    }
  },
};

// Research Services
export const researchService = {
  getAll: async () => {
    try {
      return await apiRequest(API_ENDPOINTS.RESEARCH.LIST);
    } catch (error) {
      console.error('Get all research error details:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      return await apiRequest(API_ENDPOINTS.RESEARCH.DETAIL(id));
    } catch (error) {
      console.error(`Get research by ID ${id} error details:`, error);
      throw error;
    }
  },

  create: async (researchData: any) => {
    try {
      return await apiRequest(API_ENDPOINTS.RESEARCH.CREATE, {
        method: 'POST',
        body: JSON.stringify(researchData),
      });
    } catch (error) {
      console.error('Create research error details:', error);
      throw error;
    }
  },

  update: async (id: string, researchData: any) => {
    try {
      return await apiRequest(API_ENDPOINTS.RESEARCH.UPDATE(id), {
        method: 'PUT',
        body: JSON.stringify(researchData),
      });
    } catch (error) {
      console.error(`Update research ${id} error details:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      return await apiRequest(API_ENDPOINTS.RESEARCH.DELETE(id), {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Delete research ${id} error details:`, error);
      throw error;
    }
  },
};

// User Services
export const userService = {
  getProfile: async (token: string) => {
    try {
      return await apiRequest(API_ENDPOINTS.USER.PROFILE, {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Get profile error details:', error);
      throw error;
    }
  },

  updateProfile: async (token: string, profileData: any) => {
    try {
      return await apiRequest(API_ENDPOINTS.USER.UPDATE_PROFILE, {
        method: 'PUT',
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.error('Update profile error details:', error);
      throw error;
    }
  },
}; 