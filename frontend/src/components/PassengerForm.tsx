// TODO: 实现添加/修改乘车人表单组件
import React, { useState, useEffect } from 'react';

interface Passenger {
  passengerId?: string;
  name?: string;
  idType?: string;
  idNumber?: string;
  phone?: string;
  discountType?: string;
  expiryDate?: string;
  birthDate?: string;
}

interface PassengerFormProps {
  passenger?: Passenger;
  onSubmit?: (data: Passenger) => void;
  onCancel?: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passenger,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState<string>(passenger?.name || '');
  const [idType, setIdType] = useState<string>(passenger?.idType || '');
  const [idNumber, setIdNumber] = useState<string>(passenger?.idNumber || '');
  const [phone, setPhone] = useState<string>(passenger?.phone || '');
  const [discountType, setDiscountType] = useState<string>(passenger?.discountType || '');
  const [expiryDate, setExpiryDate] = useState<string>(passenger?.expiryDate || '');
  const [birthDate, setBirthDate] = useState<string>(passenger?.birthDate || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (passenger) {
      setName(passenger.name || '');
      setIdType(passenger.idType || '');
      setIdNumber(passenger.idNumber || '');
      setPhone(passenger.phone || '');
      setDiscountType(passenger.discountType || '');
      setExpiryDate(passenger.expiryDate || '');
      setBirthDate(passenger.birthDate || '');
    }
  }, [passenger]);

  const validateIdNumber = (idType: string, idNumber: string): boolean => {
    if (!idNumber) return false;

    // 居民身份证：18位数字，最后一位可能是X
    if (idType === '居民身份证') {
      return /^\d{17}[\dXx]$/.test(idNumber);
    }

    // 其他证件类型的验证规则可以在这里添加
    return idNumber.length > 0;
  };

  const validateName = (idType: string, name: string): boolean => {
    if (!name) return false;

    if (['居民身份证', '港澳居民来往大陆通行证', '中国护照'].includes(idType)) {
      return /^[\u4e00-\u9fa5a-zA-Z]+$/.test(name);
    }

    if (idType === '外国护照') {
      return /^[a-zA-Z\s]+$/.test(name);
    }

    return name.length > 0;
  };

  const validateDate = (date: string): boolean => {
    if (!date) return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const handleIdNumberBlur = () => {
    if (idNumber && idType) {
      if (!validateIdNumber(idType, idNumber)) {
        setErrors(prev => ({ ...prev, idNumber: '请输入正确的证件号码！' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.idNumber;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    // 验证必填项
    if (!name) {
      newErrors.name = '请输入姓名';
    }
    if (!idNumber) {
      newErrors.idNumber = '请输入证件号码';
    }

    // 验证姓名格式
    if (name && idType && !validateName(idType, name)) {
      if (['居民身份证', '港澳居民来往大陆通行证', '中国护照'].includes(idType)) {
        newErrors.name = '姓名只能包含中文或英文';
      } else if (idType === '外国护照') {
        newErrors.name = '姓名只能为英文或空格';
      }
    }

    // 验证证件号格式
    if (idNumber && idType && !validateIdNumber(idType, idNumber)) {
      newErrors.idNumber = '请输入正确的证件号码！';
    }

    // 验证日期格式（如果需要）
    const needsDate = ['外国人永久居留身份证'].includes(idType);
    if (needsDate) {
      if (expiryDate && !validateDate(expiryDate)) {
        newErrors.expiryDate = '日期格式错误';
      }
      if (birthDate && !validateDate(birthDate)) {
        newErrors.birthDate = '日期格式错误';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      onSubmit?.({
        name,
        idType,
        idNumber,
        phone,
        discountType,
        expiryDate: needsDate ? expiryDate : undefined,
        birthDate: needsDate ? birthDate : undefined
      });
      setIsSubmitting(false);
    }
  };

  const needsDate = ['外国人永久居留身份证'].includes(idType);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{passenger ? '修改乘车人' : '添加乘车人'}</h2>

      {/* 基本信息部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>基本信息</h3>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="idType">证件类型：</label>
          <select
            id="idType"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">请选择</option>
            <option value="居民身份证">居民身份证</option>
            <option value="港澳居民来往大陆通行证">港澳居民来往大陆通行证</option>
            <option value="中国护照">中国护照</option>
            <option value="外国护照">外国护照</option>
            <option value="外国人永久居留身份证">外国人永久居留身份证</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">姓名：</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
          {errors.name && <div style={{ color: 'red', marginTop: '5px' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="idNumber">证件号码：</label>
          <input
            id="idNumber"
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            onBlur={handleIdNumberBlur}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
          {errors.idNumber && <div style={{ color: 'red', marginTop: '5px' }}>{errors.idNumber}</div>}
        </div>
      </div>

      {/* 联系方式部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>联系方式</h3>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="phone">有效电话号：</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
      </div>

      {/* 附加信息部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>附加信息</h3>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="discountType">优惠类型：</label>
          <select
            id="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">请选择</option>
            <option value="成人">成人</option>
            <option value="儿童">儿童</option>
            <option value="学生">学生</option>
            <option value="残疾军人">残疾军人</option>
          </select>
        </div>

        {needsDate && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="expiryDate">有效截止日期：</label>
              <input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
              {errors.expiryDate && <div style={{ color: 'red', marginTop: '5px' }}>{errors.expiryDate}</div>}
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="birthDate">出生日期：</label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
              {errors.birthDate && <div style={{ color: 'red', marginTop: '5px' }}>{errors.birthDate}</div>}
            </div>
          </>
        )}
      </div>

      {/* 按钮 */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {isSubmitting ? '提交中...' : '提交'}
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '10px 20px' }}
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default PassengerForm;
