export interface InputFieldProps {
    label: string;
    type?: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
  }
  
  export interface SignInFormData {
    email: string;
    password: string;
  }