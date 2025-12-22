import React from 'react';
import { MODAL_MESSAGES } from '../constants/registerForm';
import { normalizeCJKSpaces } from '../utils/text';
import './AlertModal.css';

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export const AlertModal: React.FC<Props> = ({ visible, message, onClose }) => {
  if (!visible) return null;
  const exactMessage = (() => {
    if (message.includes('手机号码已被其他注册用户使用')) return MODAL_MESSAGES.PHONE_TAKEN_GUIDANCE;
    if (message.includes('邮箱已被其他注册用户使用') || message.includes('电子邮箱已被注册')) return MODAL_MESSAGES.EMAIL_TAKEN_GUIDANCE;
    if (message.includes('证件号码已经被注册过') || message.includes('证件号码已被注册')) return MODAL_MESSAGES.IDENTITY_TAKEN_GUIDANCE;
    return message;
  })();
  const displayMessage = normalizeCJKSpaces(exactMessage);
  return (
    <div className="alert-overlay">
      <div role="dialog" aria-modal="true" className="alert-modal">
        <div className="alert-header">
          <div className="alert-title">提示</div>
          <button className="alert-close" aria-label="关闭" onClick={onClose}>×</button>
        </div>
        <div className="alert-body">
          <div className="alert-icon" aria-hidden="true">
            <span className="alert-exclam">!</span>
          </div>
          <div className="alert-message">{displayMessage}</div>
        </div>
        <div className="alert-actions">
          <button className="alert-confirm" onClick={onClose}>确定</button>
        </div>
      </div>
    </div>
  );
};
