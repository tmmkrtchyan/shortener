"use client";

import React, { ReactNode, ButtonHTMLAttributes } from "react";
import styles from './button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'copy';
}

export const Button = ({ children, className = '', variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button
      className={[
        styles.button,
        variant === 'copy' ? styles.copy : '',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};
