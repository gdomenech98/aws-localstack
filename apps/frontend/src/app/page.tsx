'use client';

import { useState, useEffect } from 'react';
import type { HealthResponse } from '@/lib/api';
import { fetchHealthStatus } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHealth = async () => {
      setLoading(true);
      setError(null);
      const result = await fetchHealthStatus();
      
      if (result) {
        setHealth(result);
      } else {
        setError('Failed to fetch health status from API');
      }
      
      setLoading(false);
    };

    getHealth();
    
    // Refresh every 10 seconds
    const interval = setInterval(getHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Frontend Application</h1>
        
        <section className={styles.section}>
          <h2>API Health Status</h2>
          
          {loading && !health ? (
            <div className={styles.status + ' ' + styles.loading}>
              ⏳ Loading health status...
            </div>
          ) : error ? (
            <div className={styles.status + ' ' + styles.error}>
              ❌ {error}
            </div>
          ) : health ? (
            <div className={styles.statusCard}>
              <div className={styles.statusBadge + ' ' + styles.healthy}>
                ✅ {health.status.toUpperCase()}
              </div>
              <div className={styles.details}>
                <p><strong>Status:</strong> {health.status}</p>
                <p><strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ) : null}
        </section>

        <section className={styles.section}>
          <h2>Configuration</h2>
          <div className={styles.config}>
            <p>
              <strong>API URL:</strong> <code>{process.env.NEXT_PUBLIC_API_URL}</code>
            </p>
            <p>
              <strong>Frontend Port:</strong> <code>{process.env.NEXT_PUBLIC_FRONTEND_PORT}</code>
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Environment Variables</h2>
          <div className={styles.envVars}>
            <p>Set these environment variables to configure the frontend:</p>
            <ul>
              <li><code>NEXT_PUBLIC_API_URL</code> - The API server URL (default: http://localhost:3000)</li>
              <li><code>NEXT_PUBLIC_FRONTEND_PORT</code> - The frontend port (default: 3001)</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
