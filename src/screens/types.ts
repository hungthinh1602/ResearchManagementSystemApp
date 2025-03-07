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
    Settings: undefined;  
    About: undefined;  
  };