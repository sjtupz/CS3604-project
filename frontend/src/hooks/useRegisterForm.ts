import { useRef, useState } from 'react';
import { LIMITS, USERNAME_UNIFIED_ERROR, MODAL_MESSAGES } from '../constants/registerForm';
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
  const hasUnderscore = /_/.test(password);

  if (password.length === 0) return 'none';
  if (password.length < 6) return 'weak';

  const score = (hasNumber ? 1 : 0) + (hasLetter ? 1 : 0) + (hasUnderscore ? 1 : 0);

  if (password.length >= 8 && score >= 3) return 'strong';
  if (password.length >= 6 && score >= 2) return 'medium';

  return 'weak';
};

type State = RegisterFormData & { passwordStrength: PasswordStrengthLevel; usernameAvailable: boolean; usernameExceededLimit: boolean };

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
    usernameAvailable: false,
    usernameExceededLimit: false,
  });
  const usernameExceededRef = useRef<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let value = (e.target as HTMLInputElement | HTMLSelectElement).value;
    if (name === 'username') {
      const exceeded = value.length > LIMITS.MAX_USERNAME_LENGTH;
      value = value.slice(0, LIMITS.MAX_USERNAME_LENGTH);
      usernameExceededRef.current = exceeded;
      setState((prevState: State) => {
        const errorsUpdate = { ...prevState.errors, form: undefined } as RegisterFormErrors;
        errorsUpdate.username = exceeded ? USERNAME_UNIFIED_ERROR : undefined;
        return {
          ...prevState,
          usernameExceededLimit: exceeded,
          [name]: value,
          errors: errorsUpdate,
        };
      });
    } else {
      if (name !== 'password') {
        usernameExceededRef.current = false;
        setState((prev) => ({ ...prev, usernameExceededLimit: false }));
      }
      if (name === 'password') {
        value = value.slice(0, LIMITS.MAX_PASSWORD_LENGTH);
      } else if (name === 'identityNumber') {
        value = value.slice(0, LIMITS.MAX_IDENTITY_NUMBER_LENGTH);
      } else if (name === 'phoneNumber') {
        value = value.slice(0, LIMITS.MAX_PHONE_NUMBER_LENGTH);
      }
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
    }
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
        if (usernameExceededRef.current) {
          error = USERNAME_UNIFIED_ERROR;
          setState((prev) => ({ ...prev, usernameAvailable: false }));
          break;
        }
        error = validateUsername(value) || undefined;
        if (!error) {
          try {
            const { isAvailable } = await checkUsername(value);
            if (!isAvailable) {
              error = ERROR_MESSAGES.USERNAME_TAKEN;
            }
            setState((prev) => ({ ...prev, usernameAvailable: !!isAvailable } as State));
          } catch (err) {
            error = ERROR_MESSAGES.USERNAME_VALIDATION_ERROR;
            setState((prev) => ({ ...prev, usernameAvailable: false } as State));
          }
        } else {
          setState((prev) => ({ ...prev, usernameAvailable: false } as State));
        }
        break;
      case 'password':
        error = validatePassword(value) || undefined;
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(state.password, value) || undefined;
        break;
      case 'fullName':
        error = validateFullName(value) || undefined;
        break;
      case 'identityNumber':
        error = validateIdentityNumber(value) || undefined;
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
        error = validatePhoneNumber(value) || undefined;
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
        error = validateEmail(value) || undefined;
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
    const canValidateDetailFields = !!state.phoneNumber && !!state.agreeToTerms;
    if (canValidateDetailFields) {
      if (!state.username) {
        errors.username = ERROR_MESSAGES.USERNAME_REQUIRED;
      } else {
        const usernameError = validateUsername(state.username);
        if (usernameError) errors.username = usernameError;
      }
      if (!state.password) {
        errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
      } else {
        const passwordError = validatePassword(state.password);
        if (passwordError) errors.password = passwordError;
      }
      if (!state.confirmPassword) {
        errors.confirmPassword = ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
      } else {
        const confirmError = validateConfirmPassword(state.password, state.confirmPassword);
        if (confirmError) errors.confirmPassword = confirmError;
      }
      if (!state.fullName) {
        errors.fullName = ERROR_MESSAGES.FULL_NAME_INVALID;
      } else {
        const fullNameError = validateFullName(state.fullName);
        if (fullNameError) errors.fullName = fullNameError;
      }
      if (!state.identityNumber) {
        errors.identityNumber = ERROR_MESSAGES.ID_NUMBER_REQUIRED;
      } else {
        const idNumberError = validateIdentityNumber(state.identityNumber);
        if (idNumberError) errors.identityNumber = idNumberError;
      }
      const passengerTypeError = validatePassengerType(state.passengerType);
      if (passengerTypeError) errors.passengerType = passengerTypeError;
      const identityTypeError = validateIdentityType(state.identityType);
      if (identityTypeError) errors.identityType = identityTypeError;
    }
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
      const err = error as { response?: { status?: number; data?: { error?: string } } };
      const status = err?.response?.status;
      const apiError: string | undefined = err?.response?.data?.error;
      let formMessage = ERROR_MESSAGES.REGISTRATION_FAILED;
      if (status === 409) {
        if (apiError === '该证件号码已被注册') {
          formMessage = MODAL_MESSAGES.IDENTITY_TAKEN_GUIDANCE;
        } else if (apiError === '该电子邮箱已被注册') {
          formMessage = MODAL_MESSAGES.EMAIL_TAKEN_GUIDANCE;
        } else if (apiError === '该手机号码已被注册') {
          formMessage = MODAL_MESSAGES.PHONE_TAKEN_GUIDANCE;
        }
      }
      setState((prevState: State) => ({
        ...prevState,
        errors: { ...prevState.errors, form: formMessage },
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
    clearFormError: () => {
      setState((prevState: State) => ({
        ...prevState,
        errors: { ...prevState.errors, form: undefined },
      }));
    },
  };
};
