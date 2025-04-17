import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { accessToken } = JSON.parse(userData);
          if (accessToken) {
            headers.set('authorization', `Bearer ${accessToken}`);
            console.log('Authorization header set:', `Bearer ${accessToken}`);
          }
        }
        console.log('Request headers:', Object.fromEntries(headers.entries()));
      } catch (error) {
        console.error('Error preparing headers:', error);
      }
      headers.set('Accept', '*/*');
      return headers;
    },
  }) as BaseQueryFn,
  tagTypes: ['UserProfile', 'Users', 'Groups', 'DepartmentUsers', 'Notifications'] as const,
  endpoints: () => ({}),
}); 