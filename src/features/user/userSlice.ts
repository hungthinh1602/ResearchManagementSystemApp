import { createApi } from '@reduxjs/toolkit/query/react';
import type { EndpointBuilder } from '@reduxjs/toolkit/query';
import { apiSlice } from "../api/apiSlice";
import { API_ENDPOINTS } from "../../config/api";

interface UserData {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: number;
  level: number;
  levelText?: string;
  status?: number;
  statusText?: string;
  groups?: Array<GroupData>;
}

interface GroupData {
  groupId: number;
  groupName: string;
  role: number;
  roleText?: string;
  members?: Array<GroupMemberData>;
}

interface GroupMemberData {
  userId: number;
  fullName: string;
  role: number;
  roleText?: string;
  status: number;
  statusText?: string;
}

interface UpdateUserProfileData {
  userId: number;
  data: Partial<UserData>;
}

interface ChangePasswordData {
  userId: number;
  data: {
    currentPassword: string;
    newPassword: string;
  };
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

type TagTypes = 'UserProfile' | 'Users' | 'Groups' | 'DepartmentUsers';

// Helper function to map level to readable format
const getLevelString = (level: number): string => {
  const levelMap: { [key: number]: string } = {
    0: "Professor",
    1: "Associate Professor",
    2: "PhD",
    3: "Master",
    4: "Bachelor"
  };
  return levelMap[level] || "Unknown";
};

// Helper function to map role to readable format
const getMemberRoleString = (role: number): string => {
  const roleMap: { [key: number]: string } = {
    0: "Leader",
    1: "Member",
    2: "Supervisor",
    3: "Council Chairman",
    4: "Secretary",
    5: "Council Member"
  };
  return roleMap[role] || "Unknown";
};

// Helper function to map status to readable format
const getStatusString = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    0: "Pending",
    1: "Active",
    2: "Inactive",
    3: "Rejected"
  };
  return statusMap[status] || "Unknown";
};

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Get user profile
    getUserProfile: builder.query<UserData, number>({
      query: (userId: number) => ({
        url: `${API_ENDPOINTS.USER.PROFILE}/${userId}`,
        method: 'GET'
      }),
      transformResponse: (response: ApiResponse<UserData>) => {
        if (!response.data) {
          throw new Error('No data received');
        }

        const userData = response.data;
        return {
          ...userData,
          levelText: getLevelString(userData.level),
          groups: userData.groups?.map((group) => ({
            ...group,
            roleText: getMemberRoleString(group.role)
          }))
        };
      },
      providesTags: ['UserProfile']
    }),

    // Get all users
    getAllUsers: builder.query<UserData[], void>({
      query: () => '/users',
      transformResponse: (response: ApiResponse<UserData[]>) => {
        if (!response.data) return [];
        
        return response.data.map((user) => ({
          ...user,
          levelText: getLevelString(user.level),
          statusText: user.status !== undefined ? getStatusString(user.status) : undefined
        }));
      },
      providesTags: ['Users']
    }),

    // Get user groups
    getUserGroups: builder.query<GroupData[], number>({
      query: (userId: number) => `/users/${userId}/groups`,
      transformResponse: (response: ApiResponse<GroupData[]>) => {
        if (!response.data) return [];

        return response.data.map((group) => ({
          ...group,
          members: group.members?.map((member) => ({
            ...member,
            roleText: getMemberRoleString(member.role),
            statusText: getStatusString(member.status)
          }))
        }));
      },
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ groupId }) => ({ 
                type: 'Groups' as const, 
                id: groupId 
              })),
              { type: 'Groups' as const, id: 'LIST' }
            ]
          : [{ type: 'Groups' as const, id: 'LIST' }]
    }),

    // Update user profile
    updateUserProfile: builder.mutation<void, UpdateUserProfileData>({
      query: ({ userId, data }: UpdateUserProfileData) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['UserProfile']
    }),

    // Change user password
    changePassword: builder.mutation<void, ChangePasswordData>({
      query: ({ userId, data }: ChangePasswordData) => ({
        url: `/users/${userId}/change-password`,
        method: 'PUT',
        body: data
      })
    }),

    // Get user by department
    getUsersByDepartment: builder.query<{ [key: string]: UserData[] }, number>({
      query: (departmentId: number) => `/departments/${departmentId}/users`,
      transformResponse: (response: ApiResponse<UserData[]>) => {
        if (!response.data) return { lecturers: [], students: [], staff: [] };

        const usersByRole: { [key: string]: UserData[] } = {
          lecturers: [],
          students: [],
          staff: []
        };

        response.data.forEach((user) => {
          const userData = {
            ...user,
            levelText: getLevelString(user.level),
            statusText: user.status !== undefined ? getStatusString(user.status) : undefined
          };

          if (user.level <= 2) {
            usersByRole.lecturers.push(userData);
          } else if (user.level <= 4) {
            usersByRole.students.push(userData);
          } else {
            usersByRole.staff.push(userData);
          }
        });

        return usersByRole;
      },
      providesTags: ['DepartmentUsers']
    })
  })
});

export const {
  useGetUserProfileQuery,
  useGetAllUsersQuery,
  useGetUserGroupsQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetUsersByDepartmentQuery
} = userApiSlice;