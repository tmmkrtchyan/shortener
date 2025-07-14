"use client";

import React, { forwardRef, InputHTMLAttributes } from 'react';
import styles from './input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', labelClassName = '', ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label className={[styles.label, labelClassName].filter(Boolean).join(' ')}>{label}</label>
        )}
        <input
          ref={ref}
          className={[
            styles.input,
            error ? styles.inputError : '',
            className
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {error && (
          <span className={styles.error}>{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
