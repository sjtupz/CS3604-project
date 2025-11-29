export type PasswordStrengthLevel = 'none' | 'weak' | 'medium' | 'strong';

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  identityType: string;
  identityNumber: string;
  passengerType: string;
  email: string;
  phoneNumber: string;
  agreeToTerms: boolean;
  errors: RegisterFormErrors;
  isLoading: boolean;
}

export interface RegisterFormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  identityType?: string;
  identityNumber?: string;
  passengerType?: string;
  email?: string;
  phoneNumber?: string;
  agreeToTerms?: string;
  form?: string;
}
