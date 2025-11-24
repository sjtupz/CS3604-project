// frontend/src/constants/registerForm.ts

export const IDENTITY_TYPE_OPTIONS = [
  { value: '居民身份证', label: '居民身份证' },
  { value: '港澳居民居住证', label: '港澳居民居住证' },
  { value: '台湾居民居住证', label: '台湾居民居住证' },
  { value: '外国人永久居留身份证', label: '外国人永久居留身份证' },
  { value: '外国护照', label: '外国护照' },
  { value: '中国护照', label: '中国护照' },
  { value: '港澳居民来往内地通行证', label: '港澳居民来往内地通行证' },
  { value: '台湾居民来往大陆通行证', label: '台湾居民来往大陆通行证' },
];

export const PASSENGER_TYPE_OPTIONS = [
  { value: '成人', label: '成人' },
  { value: '儿童', label: '儿童' },
  { value: '学生', label: '学生' },
  { value: '残疾军人、伤残人民警察', label: '残疾军人、伤残人民警察' },
];

export const ERROR_MESSAGES = {
  USERNAME_TAKEN: '用户名已被占用',
  USERNAME_VALIDATION_ERROR: '无法验证用户名',
  AGREE_TO_TERMS: '请勾选服务条款',
  PHONE_NUMBER_REQUIRED: '请输入手机号码',
  REGISTRATION_FAILED: '注册失败，请稍后重试',
  USERNAME_TOO_SHORT: '用户名长度不能小于6位',
  USERNAME_INVALID_START: '用户名必须以字母开头',
  PASSWORD_TOO_SHORT: '密码长度不能小于6位',
  PASSWORD_WEAK: '密码必须包含字母、数字或符号中的至少两种',
  PASSWORDS_NO_MATCH: '两次输入的密码不一致',
  FULL_NAME_TOO_SHORT: '姓名长度不能小于2位',
  ID_NUMBER_TOO_SHORT: '证件号码长度不能小于18位',
  INVALID_PHONE_NUMBER: '请输入有效的手机号码',
  INVALID_EMAIL: '请输入有效的电子邮箱',
  PASSENGER_TYPE_REQUIRED: '请选择旅客类型',
  ID_TYPE_REQUIRED: '请选择证件类型',
  ID_NUMBER_TAKEN: '证件号码已被注册',
  EMAIL_TAKEN: '电子邮箱已被注册',
  PHONE_NUMBER_TAKEN: '手机号码已被注册',
};
