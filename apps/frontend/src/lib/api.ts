const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export async function fetchHealthStatus(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch health status:', error);
    return null;
  }
}
