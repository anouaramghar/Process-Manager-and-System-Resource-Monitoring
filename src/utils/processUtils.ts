import { Process } from '../types/process';

const API_BASE_URL = 'http://localhost:3002/api';

// Simulate fetching system processes with real backend API
export const getSystemProcesses = async (): Promise<Process[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/processes`);
    if (!response.ok) {
      throw new Error('Failed to fetch processes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching processes:', error);
    throw error;
  }
};

// Simulate killing a process
export const killProcess = async (pid: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/processes/${pid}/kill`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to kill process');
    }
  } catch (error) {
    console.error('Error killing process:', error);
    throw error;
  }
};