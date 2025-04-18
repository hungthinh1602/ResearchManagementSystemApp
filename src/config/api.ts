import { Platform } from 'react-native';

// Base API URL - using ngrok URL for development
// export const API_BASE_URL = 'https://lrms-api-hgdyf4ere7gmbff5.canadacentral-01.azurewebsites.net';
export const API_BASE_URL = 'https://1064-2405-4802-a3f7-a460-c539-bcb4-b440-3ec.ngrok-free.app';

// Common headers for all API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
  RESEARCH: {
    LIST: '/api/research',
    DETAIL: (id: string) => `/api/research/${id}`,
    CREATE: '/api/research',
    UPDATE: (id: string) => `/api/research/${id}`,
    DELETE: (id: string) => `/api/research/${id}`,
  },
  USER: {
    PROFILE: '/api/users',
    UPDATE_PROFILE: '/api/user/profile',
  },
  PROJECT: {
    GET_MY_PROJECTS: '/api/project/get-my-projects',
    GET_PROJECT: (id: number) => `/api/project/get-project-by-projectId/${id}`,
    GET_PROJECT_DETAIL: (id: number) => `/api/project/details/${id}`,
    CREATE_PROJECT: '/api/project',
    DELETE_PROJECT: (id: number) => `/api/project/${id}`,
  },
  NOTIFICATIONS: {
    GET_USER_NOTIFICATIONS: (userId: number) => `/api/notifications?userId=${userId}`,
    MARK_AS_READ: (notificationId: number) => `/api/notifications/${notificationId}`,
  },
  INVITATIONS: {
    ACCEPT: (invitationId: number) => `/api/invitations/${invitationId}/accept`,
    REJECT: (invitationId: number) => `/api/invitations/${invitationId}/reject`,
  },
};

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  // First check if the response is ok
  if (!response.ok) {
    // Try to parse the error as JSON
    try {
      const errorData = await response.clone().json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch (jsonError) {
      // If it's not JSON, get the text
      const errorText = await response.text();
      console.error('API Error Response (text):', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText.substring(0, 100)}`);
    }
  }
  
  // For successful responses, try to parse as JSON
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const clonedResponse = response.clone();
      return await clonedResponse.json();
    } else {
      // If not JSON, return the text
      const text = await response.text();
      console.warn('API Response is not JSON:', text.substring(0, 100));
      return { text };
    }
  } catch (error) {
    console.error('Error parsing API response:', error);
    throw new Error('Failed to parse API response');
  }
};

// Helper function to handle API errors
export const handleError = (error: any) => {
  console.error('API Error:', error);
  
  // Provide more user-friendly error messages
  if (error.message.includes('Network request failed')) {
    throw new Error('Network connection failed. Please check your internet connection.');
  } else if (error.message.includes('JSON Parse error')) {
    throw new Error('Received invalid response from server. Please try again later.');
  } else {
    throw error;
  }
};

// API request wrapper with error handling
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API request to: ${url}`);
    
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}; 