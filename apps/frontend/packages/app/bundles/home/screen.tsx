import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthResponse {
  status: string;
  message?: string;
}

export const HomeScreen: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/v1/health');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HealthResponse = await response.json();
        setHealthStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando estado de la API...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al obtener el estado de la API: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de la API</Text>
      <Text style={styles.statusText}>Estado: {healthStatus?.status}</Text>
      {healthStatus?.message && <Text style={styles.messageText}>Mensaje: {healthStatus.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default HomeScreen;
