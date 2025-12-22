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
  FULL_NAME_INVALID: '❌请输入您的姓名！',
  ID_NUMBER_TOO_SHORT: '证件号码长度不能小于18位',
  ID_NUMBER_INVALID_FORMAT: '❌请正确输入18位的证件号码！',
  INVALID_PHONE_NUMBER: '请输入有效的手机号码',
  INVALID_EMAIL: '请输入有效的电子邮箱',
  INVALID_EMAIL_ADDRESS_ALT: '请输入有效的电子邮件地址！',
  PASSENGER_TYPE_REQUIRED: '请选择旅客类型',
  ID_TYPE_REQUIRED: '请选择证件类型',
  ID_NUMBER_TAKEN: '证件号码已被注册',
  EMAIL_TAKEN: '电子邮箱已被注册',
  PHONE_NUMBER_TAKEN: '手机号码已被注册',
  USERNAME_REQUIRED: '❌请输入用户名！',
  PASSWORD_REQUIRED: '❌请输入登录密码！',
  CONFIRM_PASSWORD_REQUIRED: '❌请输入确认密码！',
  ID_NUMBER_REQUIRED: '❌请输入证件号码！',
};

export const USERNAME_RULE_HINT = '6-30位字母、数字或"_"，字母开头';
export const USERNAME_RULE_SUCCESS = '✅6-30位字母、数字或“_”,字母开头';
export const USERNAME_UNIFIED_ERROR = '❌用户名只能由字母、数字和_组成,须以字母开头！';

export const PLACEHOLDERS = {
  USERNAME: '用户名设置成功后不可更改',
  PASSWORD: '6-20位字母、数字或符号',
  CONFIRM_PASSWORD: '再次输入您的登录密码',
  FULL_NAME: '请输入姓名',
  IDENTITY_NUMBER: '请输入您的证件号码',
  PHONE_NUMBER: '手机号码',
  EMAIL: '请输入邮箱',
};

export const LIMITS = {
  MAX_USERNAME_LENGTH: 30,
  MAX_PASSWORD_LENGTH: 20,
  MAX_IDENTITY_NUMBER_LENGTH: 18,
  MAX_PHONE_NUMBER_LENGTH: 11,
};

export const HINT_MESSAGES = {
  IDENTITY_VERIFICATION: '（用于身份核验，请正确填写）',
  PHONE_VERIFICATION: '请正确填写手机号码，稍后将向该手机号码发送短信验证码',
};

export const PATTERNS = {
  FULL_NAME: /^[\u4e00-\u9fa5A-Za-z ]+$/,
  IDENTITY_NUMBER: /^\d{17}(\d|X)$/,
};

export const MODAL_MESSAGES = {
  CONFIRM_TERMS: '请确认服务条款！',
  PHONE_REQUIRED: '请输入手机号，以完成用户校验',
  IDENTITY_TAKEN_GUIDANCE:
    '该证件号码已经被注册过，请确认是否您本人注册，是请使用原账号登录，不是请通过铁路12306App办理抢注或持该证件到就近的办理客运业务的铁路车站办理被抢注处理，完成后即可继续注册，或致电12306客服咨询。',
  EMAIL_TAKEN_GUIDANCE:
    '您输入的邮箱已被其他注册用户使用，请确认是否本人注册。如果此邮箱是本人注册，您可使用此邮箱进行登录，或返回登录页点击忘记密码进行重置密码;如果邮箱不是您注册的，您可更换邮箱或致电12306客服协助处理。',
  PHONE_TAKEN_GUIDANCE:
    '您输入的手机号码已被其他注册用户使用，请确认是否本人注册。如果此手机号是本人注册，您可使用此手机号进行登录，或返回登录页点击忘记密码进行重置密码;如果手机号不是您注册的，您可更换手机号码或致电12306客服协助处理。',
};
