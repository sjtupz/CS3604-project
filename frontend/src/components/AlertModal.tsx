import React from 'react';
import { MODAL_MESSAGES } from '../constants/registerForm';
import { normalizeCJKSpaces } from '../utils/text';

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
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };
  const contentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '24px',
    maxWidth: '560px',
    width: '90%',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    lineHeight: 1.6,
  };
  const actionsStyle: React.CSSProperties = {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  };
  return (
    <div style={overlayStyle}>
      <div role="dialog" aria-modal="true" style={contentStyle}>
        <span>{displayMessage}</span>
        <div style={actionsStyle}>
          <button onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};
