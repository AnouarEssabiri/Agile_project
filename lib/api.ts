const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string; password_confirmation: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getUser() {
    return this.request('/user');
  }

  // Project methods
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id: number) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: number, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: number) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectTasks(projectId: number) {
    return this.request(`/projects/${projectId}/tasks`);
  }

  // Task methods
  async getTasks() {
    return this.request('/tasks');
  }

  async getTask(id: number) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: number, taskData: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: number) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async assignTask(taskId: number, userId: number) {
    return this.request(`/tasks/${taskId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async updateTaskStatus(taskId: number, status: string) {
    return this.request(`/tasks/${taskId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  // Comment methods
  async getTaskComments(taskId: number) {
    return this.request(`/tasks/${taskId}/comments`);
  }

  async createComment(taskId: number, commentData: { content: string }) {
    return this.request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(commentId: number, commentData: { content: string }) {
    return this.request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(commentId: number) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Tag methods
  async getTags() {
    return this.request('/tags');
  }

  async createTag(tagData: { name: string; color?: string }) {
    return this.request('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  }

  async attachTagToTask(taskId: number, tagId: number) {
    return this.request(`/tasks/${taskId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag_id: tagId }),
    });
  }

  async attachTagToProject(projectId: number, tagId: number) {
    return this.request(`/projects/${projectId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag_id: tagId }),
    });
  }

  // Attachment methods
  async uploadAttachment(taskId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/tasks/${taskId}/attachments`;
    
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload attachment');
    }

    return response.json();
  }

  async downloadAttachment(attachmentId: number) {
    const url = `${this.baseURL}/attachments/${attachmentId}/download`;
    const token = localStorage.getItem('auth_token');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to download attachment');
    }

    return response.blob();
  }

  async deleteAttachment(attachmentId: number) {
    return this.request(`/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService; 