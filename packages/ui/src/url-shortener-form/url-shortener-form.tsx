"use client";

import React, { useState } from 'react';
import { Input } from '../input';
import { Button } from '../button';
import styles from './url-shortener-form.module.css';

export interface URLShortenerFormProps {
  onSubmit: (url: string) => Promise<string | { error: string }>;
}

export const URLShortenerForm: React.FC<URLShortenerFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setCopied(false);
    setLoading(true);
    try {
      const result = await onSubmit(url);
      if (typeof result === 'string') {
        setShortUrl(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>
        URL Shortener
        <img src="/link-icon.svg" alt="Link" style={{ width: '20px', height: '20px', marginLeft: '8px', color: '#888' }} />
      </h2>
      <div className={styles.subheading}>Enter the URL to shorten</div>
      <Input
        label="URL"
        labelClassName={styles.inputLabel}
        value={url}
        onChange={e => setUrl(e.target.value)}
        disabled={loading}
        error={error ? error : undefined}
        placeholder="https://example.com/foo/bar/biz"
        required
      />
      <Button
        type="submit"
        disabled={loading || !url}
        className={styles.button}
      >
        Shorten
      </Button>
      {shortUrl && (
        <div className={styles.success}>
          {copied ? 'Your URL is copied' : `Success! Here's your short URL:`}
          <div className={styles.successRow}>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className={styles.successLink}>
              {shortUrl}
            </a>
            <div className={styles.copyButtonRow}>
            <Button
              type="button"
              onClick={handleCopy}
              variant="copy"
            >
                <img src="/copy-icon.svg" alt="Copy" className={styles.copyIcon} />
                {'Copy'}
            </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
