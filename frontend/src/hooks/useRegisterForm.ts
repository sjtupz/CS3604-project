import { useState } from 'react';
import {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validateIdentityNumber,
  validatePhoneNumber,
  validateEmail,
  validatePassengerType,
  validateIdentityType,
} from '../utils/validation';
import {
  checkUsername,
  registerUser,
  checkIdentityNumber,
  checkPhoneNumber,
  checkEmail,
} from '../api/user';
import {
  RegisterFormData,
  RegisterFormErrors,
  PasswordStrengthLevel,
} from '../types/user';
import { ERROR_MESSAGES } from '../constants/registerForm';

const calculatePasswordStrength = (password: string): PasswordStrengthLevel => {
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length === 0) return 'none';
  if (password.length < 6) return 'weak';

  const score = (hasNumber ? 1 : 0) + (hasLetter ? 1 : 0) + (hasSymbol ? 1 : 0);

  if (password.length >= 8 && score >= 3) return 'strong';
  if (password.length >= 6 && score >= 2) return 'medium';

  return 'weak';
};

type State = RegisterFormData & { passwordStrength: PasswordStrengthLevel };

export const useRegisterForm = (onRegisterSuccess: () => void) => {
  const [state, setState] = useState<State>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    identityType: '居民身份证',
    identityNumber: '',
    passengerType: '成人',
    email: '',
    phoneNumber: '',
    agreeToTerms: false,
    errors: {},
    isLoading: false,
    passwordStrength: 'none',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setState((prevState: State) => {
      const newState: State = {
        ...prevState,
        [name]: value,
        errors: { ...prevState.errors, [name]: undefined, form: undefined },
      };

      if (name === 'password') {
        newState.passwordStrength = calculatePasswordStrength(value);
      }

      return newState;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setState((prevState: State) => ({
      ...prevState,
      [name]: checked,
      errors: { ...prevState.errors, [name]: undefined },
    }));
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error: string | undefined;

    switch (name) {
      case 'username':
        error = validateUsername(value);
        if (!error) {
          try {
            const { isAvailable } = await checkUsername(value);
            if (!isAvailable) {
              error = ERROR_MESSAGES.USERNAME_TAKEN;
            }
          } catch (err) {
            error = ERROR_MESSAGES.USERNAME_VALIDATION_ERROR;
          }
        }
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(state.password, value);
        break;
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'identityNumber':
        error = validateIdentityNumber(value);
        if (!error) {
          try {
            const { isAvailable } = await checkIdentityNumber(value);
            if (!isAvailable) {
              error = ERROR_MESSAGES.ID_NUMBER_TAKEN;
            }
          } catch (err) {
            // In a mock API, this won't be triggered
          }
        }
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(value);
        if (!error) {
          try {
            const { isAvailable } = await checkPhoneNumber(value);
            if (!isAvailable) {
              error = ERROR_MESSAGES.PHONE_NUMBER_TAKEN;
            }
          } catch (err) {
            // In a mock API, this won't be triggered
          }
        }
        break;
      case 'email':
        error = validateEmail(value);
        if (!error) {
          try {
            const { isAvailable } = await checkEmail(value);
            if (!isAvailable) {
              error = ERROR_MESSAGES.EMAIL_TAKEN;
            }
          } catch (err) {
            // In a mock API, this won't be triggered
          }
        }
        break;
      default:
        break;
    }

    setState((prevState: State) => ({
      ...prevState,
      errors: { ...prevState.errors, [name]: error },
    }));
  };

  const validateForm = (): RegisterFormErrors => {
    const errors: RegisterFormErrors = {};
    if (!state.agreeToTerms)
      errors.agreeToTerms = ERROR_MESSAGES.AGREE_TO_TERMS;
    if (!state.phoneNumber)
      errors.phoneNumber = ERROR_MESSAGES.PHONE_NUMBER_REQUIRED;
    const passengerTypeError = validatePassengerType(state.passengerType);
    if (passengerTypeError) errors.passengerType = passengerTypeError;
    const identityTypeError = validateIdentityType(state.identityType);
    if (identityTypeError) errors.identityType = identityTypeError;
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setState((prevState: State) => ({
        ...prevState,
        errors: { ...prevState.errors, ...validationErrors },
      }));
      return;
    }

    setState((prevState: State) => ({ ...prevState, isLoading: true }));

    try {
      await registerUser({
        username: state.username,
        password: state.password,
        identityType: state.identityType,
        fullName: state.fullName,
        identityNumber: state.identityNumber,
        passengerType: state.passengerType,
        email: state.email,
        phoneNumber: state.phoneNumber,
      });
      onRegisterSuccess();
    } catch (error) {
      setState((prevState: State) => ({
        ...prevState,
        errors: { ...prevState.errors, form: ERROR_MESSAGES.REGISTRATION_FAILED },
        isLoading: false,
      }));
    }
  };

  return {
    state,
    handleInputChange,
    handleCheckboxChange,
    handleBlur,
    handleSubmit,
  };
};
