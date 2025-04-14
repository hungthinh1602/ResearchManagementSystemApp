import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, API_ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Project {
  projectId: number;
  projectName: string;
  projectType: number;
  description: string;
  approvedBudget: number;
  status: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string | null;
  groupId: number;
  groupName: string;
  departmentId: number;
}

interface ProjectStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ProjectState {
  projects: Project[];
  stats: ProjectStats;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('Please sign in to view projects');
      }

      const userData = JSON.parse(userDataString);
      const token = userData.accessToken;
      
      if (!token) {
        throw new Error('Please sign in to view projects');
      }

      const response = await apiRequest(
        API_ENDPOINTS.PROJECT.GET_MY_PROJECTS,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.statusCode === 200) {
        return response.data;
      } else if (response.statusCode === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('Please sign in to view project details');
      }

      const userData = JSON.parse(userDataString);
      const token = userData.accessToken;
      
      if (!token) {
        throw new Error('Please sign in to view project details');
      }

      const response = await apiRequest(
        API_ENDPOINTS.PROJECT.GET_PROJECT(projectId),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.statusCode === 200) {
        return response.data;
      } else if (response.statusCode === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      } else {
        throw new Error(response.message || 'Failed to fetch project details');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        // Calculate stats
        state.stats = {
          total: action.payload.length,
          pending: action.payload.filter((p: Project) => p.status === 0).length,
          approved: action.payload.filter((p: Project) => p.status === 1).length,
          rejected: action.payload.filter((p: Project) => p.status === 2).length,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific project in the projects array
        const index = state.projects.findIndex(p => p.projectId === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer; 