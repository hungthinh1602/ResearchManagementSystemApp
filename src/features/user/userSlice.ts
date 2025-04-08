import { apiSlice } from "../api/apiSlice";
import { API_ENDPOINTS } from "../../config/api";
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';

interface UserData {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: number;
  level: number;
  groups?: Array<{
    groupId: number;
    groupName: string;
    role: number;
  }>;
}

// Helper function to map level to readable format
const getLevelString = (level: number) => {
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
const getMemberRoleString = (role: number) => {
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
const getStatusString = (status: number) => {
  const statusMap: { [key: number]: string } = {
    0: "Pending",
    1: "Active",
    2: "Inactive",
    3: "Rejected"
  };
  return statusMap[status] || "Unknown";
};

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Get user profile
    getUserProfile: builder.query<UserData, number>({
      query: (userId: number) => ({
        url: `${API_ENDPOINTS.USER.PROFILE}/${userId}`,
        method: 'GET'
      }),
      transformResponse: (response: any) => {
        if (!response.data) return null;

        const userData = response.data;
        return {
          ...userData,
          levelText: getLevelString(userData.level),
          groups: userData.groups?.map((group: any) => ({
            ...group,
            roleText: getMemberRoleString(group.role)
          }))
        };
      },
      providesTags: ['UserProfile']
    }),

    // Get all users
    getAllUsers: builder.query({
      query: () => '/users',
      transformResponse: (response: any) => {
        if (!response.data) return [];
        
        return response.data.map((user: any) => ({
          ...user,
          levelText: getLevelString(user.level),
          statusText: getStatusString(user.status)
        }));
      },
      providesTags: ['Users']
    }),

    // Get user groups
    getUserGroups: builder.query({
      query: (userId) => `/users/${userId}/groups`,
      transformResponse: (response: any) => {
        if (!response.data) return [];

        return response.data.map((group: any) => ({
          ...group,
          members: group.members?.map((member: any) => ({
            ...member,
            roleText: getMemberRoleString(member.role),
            statusText: getStatusString(member.status)
          }))
        }));
      },
      providesTags: (result, error, userId) => 
        result
          ? [
              ...result.map(({ groupId }: { groupId: number }) => ({ 
                type: 'Groups', 
                id: groupId 
              })),
              { type: 'Groups', id: 'LIST' },
              { type: 'UserGroups', id: userId }
            ]
          : [
              { type: 'Groups', id: 'LIST' },
              { type: 'UserGroups', id: userId }
            ]
    }),

    // Update user profile
    updateUserProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['UserProfile']
    }),

    // Change user password
    changePassword: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/change-password`,
        method: 'PUT',
        body: data
      })
    }),

    // Get user by department
    getUsersByDepartment: builder.query({
      query: (departmentId) => `/departments/${departmentId}/users`,
      transformResponse: (response: any) => {
        if (!response.data) return [];

        const usersByRole: { [key: string]: any[] } = {
          lecturers: [],
          students: [],
          staff: []
        };

        response.data.forEach((user: any) => {
          const userData = {
            ...user,
            levelText: getLevelString(user.level),
            statusText: getStatusString(user.status)
          };

          // Categorize users based on their level
          if (user.level <= 2) { // Professor, Associate Professor, PhD
            usersByRole.lecturers.push(userData);
          } else if (user.level <= 4) { // Master, Bachelor
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