import React from 'react';
import { MODAL_MESSAGES } from '../constants/registerForm';
import { normalizeCJKSpaces } from '../utils/text';
import './AlertModal.css';

type Props = {
  visible: boolean;
  message?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export const AlertModal: React.FC<Props> = ({ visible, message, onClose, children }) => {
  if (!visible) return null;
  const displayMessage = typeof message === 'string' ? normalizeCJKSpaces(message) : '';
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
          <div className="alert-message">{children ?? displayMessage}</div>
        </div>
        <div className="alert-actions">
          <button className="alert-confirm" onClick={onClose}>确定</button>
        </div>
      </div>
    </div>
  );
};
