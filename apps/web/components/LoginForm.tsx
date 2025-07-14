'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLogin: (username: string) => Promise<boolean>;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({ onLogin, loading = false, error }: LoginFormProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await onLogin(username.trim());
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>URL Shortener</h1>
        <p className={styles.subtitle}>Enter your username to get started</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={styles.input}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading || !username.trim()}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
