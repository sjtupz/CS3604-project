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
  onSubmit?: (data: Passenger) => Promise<void> | void;
  onCancel?: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  passenger,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState<string>(passenger?.name || '');
  const [idType, setIdType] = useState<string>(passenger?.idType || '居民身份证');
  const [idNumber, setIdNumber] = useState<string>(passenger?.idNumber || '');
  const [phone, setPhone] = useState<string>(passenger?.phone || '');
  const [phoneFocused, setPhoneFocused] = useState<boolean>(false);
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
        setErrors(prev => ({ ...prev, idNumber: '请正确输入18位的证件号码！' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.idNumber;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    // 验证必填项
    if (!name) {
      newErrors.name = '请输入您的姓名！'; // Requirement 5.1.10.6
    }
    if (!idNumber) {
      newErrors.idNumber = '请输入证件号码！'; // Requirement 5.1.10.6
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
      newErrors.idNumber =
        errors.idNumber === '请正确输入18位的证件号码！'
          ? errors.idNumber
          : '请输入正确的证件号码！';
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
      try {
        if (onSubmit) {
          await onSubmit({
            passengerId: passenger?.passengerId, // Include passengerId when editing
            name,
            idType,
            idNumber,
            phone,
            discountType,
            expiryDate: needsDate ? expiryDate : undefined,
            birthDate: needsDate ? birthDate : undefined
          });
        }
      } catch (error) {
        // Handle server-side validation errors
        const err = error as { response?: { data?: { error?: string } }; message?: string };
        const msg = err.response?.data?.error ?? err.message ?? String(error);
        if (msg.includes('身份信息不一致') || msg.includes('证件号码')) {
          setErrors(prev => ({ ...prev, idNumber: msg }));
        } else if (msg.includes('乘车人已存在') || msg.includes('Passenger already exists')) {
           setErrors(prev => ({ ...prev, idNumber: '该乘车人已存在' }));
        } else {
           console.error('Submission error:', error);
           // Optional: set a general error
           // setErrors(prev => ({ ...prev, general: '保存失败' }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const maskPhone = (p: string) => {
    if (!p || p.length < 11) return p;
    return p.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  const needsDate = ['外国人永久居留身份证'].includes(idType);

  return (
    <div
      style={{
        padding: '20px',
        margin: '0 auto',
        maxWidth: '900px',
        border: '1px solid #91d5ff',
        backgroundColor: '#e6f7ff',
        borderRadius: '8px',
        textAlign: 'center'
      }}
    >
      <h2>{passenger ? '修改乘车人' : '添加乘车人'}</h2>

      {/* 基本信息部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>基本信息</h3>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="idType" style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>
            <span style={{ color: 'red' }}>*</span>证件类型：
          </label>
          {passenger ? (
            <span>{idType}</span>
          ) : (
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
          )}
        </div>

        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <label htmlFor="name" style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>
            <span style={{ color: 'red' }}>*</span>姓名：
          </label>
          {passenger ? (
            <span>{name}</span>
          ) : (
            <div style={{ display: 'inline-block' }}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                style={{ marginLeft: '10px', padding: '5px', color: name ? 'black' : '#ccc' }}
              />
              {errors.name && <div style={{ color: 'red', marginTop: '5px' }}>{errors.name}</div>}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <label htmlFor="idNumber" style={{ display: 'inline-block', width: '100px', textAlign: 'right', flexShrink: 0, paddingTop: '5px' }}>
            <span style={{ color: 'red' }}>*</span>证件号码：
          </label>
          {passenger ? (
             <span>{idNumber}</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                id="idNumber"
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                onBlur={handleIdNumberBlur}
                placeholder="请填写证件号码"
                style={{ marginLeft: '10px', padding: '5px', color: idNumber ? 'black' : '#ccc' }}
              />
              {errors.idNumber && <div style={{ color: 'red', marginTop: '5px', marginLeft: '10px', fontSize: '12px' }}>{errors.idNumber}</div>}
            </div>
          )}
        </div>
        
        {passenger && (
           <>
             <div style={{ marginBottom: '10px', textAlign: 'center' }}>
               <label style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>
                 <span style={{ color: 'red' }}>*</span>国家/地区：
               </label>
               <span>中国CN</span>
             </div>
             <div style={{ marginBottom: '10px', textAlign: 'center' }}>
               <label style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>添加日期：</label>
               <span>{passenger.passengerId === 'self' || passenger.passengerId?.startsWith('self') || !passenger.passengerId ? new Date().toISOString().split('T')[0] : '2023-01-01'}</span>
             </div>
             <div style={{ marginBottom: '10px', textAlign: 'center' }}>
               <label style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>核验状态：</label>
               <span style={{ color: '#1890ff' }}>已通过</span>
             </div>
           </>
        )}
      </div>

      {/* 联系方式部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>
          联系方式
          {passenger && <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '10px' }}>（请提供乘车人真实有效的联系方式）</span>}
        </h3>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="phone" style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>
             {/* Add Mode: "有效电话号" ? Requirement 5.1.10.2 says "有效电话号". Edit Mode 5.1.9.3 says "居中展示手机号". */}
             {passenger ? '手机号：' : '有效电话号：'}
          </label>
          
          {passenger ? (
             <div style={{ display: 'inline-block' }}>
               <select style={{ marginRight: '10px', padding: '5px' }}>
                 <option value="+86">+86</option>
                 <option value="+852">+852</option>
                 <option value="+853">+853</option>
                 <option value="+886">+886</option>
               </select>
               <input
                 id="phone"
                 type="tel"
                 value={phoneFocused ? phone : maskPhone(phone)}
                 onChange={(e) => setPhone(e.target.value)}
                 onFocus={() => setPhoneFocused(true)}
                 onBlur={() => setPhoneFocused(false)}
                 style={{ padding: '5px', width: '150px' }}
               />
               {/* Note: Requirement 5.1.9.3 says "Right box is phone number, 4-7 masked... CAN BE MODIFIED HERE". 
                   Implemented: Mask on blur, Reveal on focus. */}
             </div>
          ) : (
             <input
               id="phone"
               type="tel"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               placeholder="请填写手机号码"
               style={{ marginLeft: '10px', padding: '5px', color: phone ? 'black' : '#ccc' }}
             />
          )}
        </div>
      </div>

      {/* 附加信息部分 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>附加信息</h3>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="discountType" style={{ display: 'inline-block', width: '100px', textAlign: 'right' }}>
            <span style={{ color: 'red' }}>*</span>优惠类型：
          </label>
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
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <label htmlFor="expiryDate" style={{ display: 'inline-block', width: '100px', textAlign: 'right', paddingTop: '5px' }}>有效截止日期：</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  style={{ marginLeft: '10px', padding: '5px' }}
                />
                {errors.expiryDate && <div style={{ color: 'red', marginTop: '5px', marginLeft: '10px' }}>{errors.expiryDate}</div>}
              </div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <label htmlFor="birthDate" style={{ display: 'inline-block', width: '100px', textAlign: 'right', paddingTop: '5px' }}>出生日期：</label>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{ marginLeft: '10px', padding: '5px' }}
                />
                {errors.birthDate && <div style={{ color: 'red', marginTop: '5px', marginLeft: '10px' }}>{errors.birthDate}</div>}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 按钮 */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          onClick={onCancel}
          style={{ 
            padding: '10px 30px', 
            border: '1px solid #d9d9d9', 
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ 
            padding: '10px 30px',
            border: 'none',
            borderRadius: '4px',
            background: '#ff9900',
            color: 'white',
            cursor: 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
};

export default PassengerForm;
