import React from 'react';

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong' | 'none';

interface PasswordStrengthProps {
  strength: PasswordStrengthLevel;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  return (
    <div className="password-strength-indicator">
      <div className={`strength-bar red`}></div>
      <div className={`strength-bar ${strength === 'medium' || strength === 'strong' ? 'orange' : ''}`}></div>
      <div className={`strength-bar ${strength === 'strong' ? 'green' : ''}`}></div>
    </div>
  );
};

export { PasswordStrength };
