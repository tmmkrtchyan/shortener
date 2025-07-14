'use client';

import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { URLShortenerForm } from '@repo/ui';
import { shortenUrl } from '../hooks/useShortenUrl';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ApiService } from '../lib/api';
import { Button } from '@repo/ui';

export default function Home() {
  const { user, loading, error, login, continueAsGuest, isAuthenticated, logout } = useAuth();
  const [urls, setUrls] = useState<any[]>([]);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [urlsError, setUrlsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editSlugUrl, setEditSlugUrl] = useState<any | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugLoading, setSlugLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAllUrls = useCallback(async (pageNum = 1) => {
    if (!isAuthenticated) return;

    setUrlsLoading(true);
    setUrlsError(null);

    try {
      const result = await ApiService.getAllUrlsWithUserFlag(pageNum, 5);
      if (result.data) {
        setUrls(result.data.urls);
        setTotalPages(result.data.totalPages);
        setPage(result.data.page);
      } else {
        setUrlsError(result.error || 'Failed to fetch URLs');
      }
    } catch (err) {
      setUrlsError('Failed to fetch URLs');
    } finally {
      setUrlsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllUrls(page);
    } else {
      setUrls([]);
      setUrlsError(null);
    }
  }, [isAuthenticated, fetchAllUrls, page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const openEditSlug = (url: any) => {
    setEditSlugUrl(url);
    setNewSlug(url.shortUrl.split('/').pop() || '');
    setSlugError(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };
  const closeEditSlug = () => {
    setEditSlugUrl(null);
    setNewSlug('');
    setSlugError(null);
  };
  const handleSlugSave = async () => {
    if (!editSlugUrl) return;
    setSlugLoading(true);
    setSlugError(null);
    const result = await ApiService.updateSlug(editSlugUrl.id, newSlug);
    setSlugLoading(false);
    if (result.error) {
      setSlugError(result.error);
    } else {
      closeEditSlug();
      fetchAllUrls(page);
    }
  };

  const handleShortenUrl = async (url: string) => {
    const result = await shortenUrl(url);
    if (typeof result === 'string') {
      // Only refresh if successful
      fetchAllUrls(page);
    }
    return result;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={login}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <URLShortenerForm onSubmit={handleShortenUrl} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>All URLs (Top Visits)</h2>
        <Button onClick={logout} style={{ minWidth: 100 }}>
          Logout
        </Button>
      </div>
      {urlsLoading ? (
        <div>Loading URLs...</div>
      ) : urlsError ? (
        <div style={{ color: 'red' }}>{urlsError}</div>
      ) : urls.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center' }}>No URLs yet.</div>
      ) : (
        <>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Short URL</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Original URL</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Visits</th>
              <th style={{ textAlign: 'center', padding: 8 }}>Your URL?</th>
            </tr>
          </thead>
          <tbody>
            {urls.map(url => (
              <tr key={url.id}>
                <td style={{ padding: 8 }}>
                  <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a>
                </td>
                <td style={{ padding: 8, wordBreak: 'break-all' }}>{url.originalUrl}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{url.visits}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{url.isUserUrl ? '✅' : ''}
                  {url.isUserUrl && (
                    <Button style={{ marginLeft: 8, minWidth: 60, fontSize: 12, padding: '4px 8px' }} onClick={() => openEditSlug(url)}>
                      Edit Slug
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
          <Button onClick={handlePrev} disabled={page === 1} style={{ minWidth: 100 }}>
            Previous
          </Button>
          <span style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</span>
          <Button onClick={handleNext} disabled={page === totalPages} style={{ minWidth: 100 }}>
            Next
          </Button>
        </div>
        </>
      )}

      {/* Slug Edit Modal */}
      {editSlugUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
            <h3>Edit Slug</h3>
            <div style={{ margin: '16px 0' }}>
              <input
                ref={inputRef}
                value={newSlug}
                onChange={e => setNewSlug(e.target.value)}
                style={{ padding: 8, fontSize: 16, width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
                disabled={slugLoading}
              />
            </div>
            {slugError && <div style={{ color: 'red', marginBottom: 8 }}>{slugError}</div>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button onClick={closeEditSlug} disabled={slugLoading} style={{ minWidth: 80 }}>Cancel</Button>
              <Button onClick={handleSlugSave} disabled={slugLoading || !newSlug.trim()} style={{ minWidth: 80 }}>
                {slugLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
