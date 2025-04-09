export interface ResearchPaper {
  id: number;
  title: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
  // Add other fields as needed
}

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  Research: undefined;
  CreateNewRequest: undefined;
  Notifications: undefined;
  Settings: undefined;
  RequestDetail: { requestId: number; request: ResearchPaper };
}; 