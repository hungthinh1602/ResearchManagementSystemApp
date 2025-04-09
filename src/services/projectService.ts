import { apiRequest, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add project endpoints to API_ENDPOINTS
declare module '../config/api' {
  export interface API_ENDPOINTS {
    PROJECT: {
      GET_MY_PROJECTS: string;
      GET_PROJECT: (id: number) => string;
      CREATE_PROJECT: string;
      UPDATE_PROJECT: (id: number) => string;
      DELETE_PROJECT: (id: number) => string;
    };
  }
}

const getAuthHeader = async () => {
  const userData = await AsyncStorage.getItem('userData');
  if (userData) {
    const { accessToken } = JSON.parse(userData);
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }
  throw new Error('No access token found');
};

// Project service functions
export const projectService = {
  getMyProjects: async () => {
    try {
      const authHeader = await getAuthHeader();
      const response = await apiRequest('/api/project/get-my-projects', {
        method: 'GET',
        headers: authHeader,
      });
      return response;
    } catch (error) {
      console.error('Error in getMyProjects:', error);
      throw error;
    }
  },

  getProject: async (id: number) => {
    try {
      const authHeader = await getAuthHeader();
      const response = await apiRequest(`/api/project/${id}`, {
        method: 'GET',
        headers: authHeader,
      });
      return response;
    } catch (error) {
      console.error('Error in getProject:', error);
      throw error;
    }
  },

  createProject: async (projectData: any) => {
    try {
      const authHeader = await getAuthHeader();
      const response = await apiRequest('/api/project', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify(projectData),
      });
      return response;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  updateProject: async (id: number, projectData: any) => {
    try {
      const authHeader = await getAuthHeader();
      const response = await apiRequest(`/api/project/${id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(projectData),
      });
      return response;
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    try {
      const authHeader = await getAuthHeader();
      const response = await apiRequest(`/api/project/${id}`, {
        method: 'DELETE',
        headers: authHeader,
      });
      return response;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  },
}; 