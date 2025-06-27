'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useApi<T>(
  apiCall: () => Promise<{ data: T }>,
  dependencies: any[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  return {
    ...state,
    refetch: fetchData,
    setData,
    setError,
    setLoading,
  };
}

// Specific hooks for common API operations
export function useProjects() {
  return useApi(() => apiService.getProjects());
}

export function useProject(id: number) {
  return useApi(() => apiService.getProject(id), [id]);
}

export function useTasks() {
  return useApi(() => apiService.getTasks());
}

export function useTask(id: number) {
  return useApi(() => apiService.getTask(id), [id]);
}

export function useProjectTasks(projectId: number) {
  return useApi(() => apiService.getProjectTasks(projectId), [projectId]);
}

export function useTaskComments(taskId: number) {
  return useApi(() => apiService.getTaskComments(taskId), [taskId]);
}

export function useTags() {
  return useApi(() => apiService.getTags());
} 