export interface InputFieldProps {
    label: string;
    type?: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
  }

  export interface SignUpInputFieldProps {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (id: string, value: string) => void;
  }
  
  export interface SignInFormData {
    email: string;
    password: string;
  }

  export interface SignUpInputFieldProps {
    label: string;
    id: string;
    type?: string;
  }
  
  export interface SignUpFormData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }

  export type RootStackParamList = {
    Auth: undefined;
    AppDrawer: undefined;
    Settings: undefined;
    Profile: undefined;
    About: undefined;
    CreateNewRequest: undefined;
    RequestDetail: { requestId: number; request: ResearchPaper };
    Requests: undefined;
    Projects: undefined;
    ProjectDetail: { projectId: number };
    Home: undefined;
    Notifications: undefined;
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    ResetPassword: undefined;
    ChangePassword: undefined;
  };

  // Make sure ResearchPaper interface is defined here or imported
  export interface ResearchPaper {
    id: number;
    type: string;
    title: string;
    abstract: string;
    publisher: string;
    department: Department;
    category: Category;
    status: string;
    submissionDate: string;
    publicationDate: string;
    authors: Author[];
    progress: number;
    royalties: Royalties;
  }

  // Add these interfaces if they're not already defined
  export interface Author {
    name: string;
    role: string;
    email: string;
  }

  export interface Department {
    id: number;
    name: string;
  }

  export interface Category {
    id: number;
    name: string;
  }

  export interface Royalties {
    total: number;
    received: number;
    pendingPayment: boolean;
  }