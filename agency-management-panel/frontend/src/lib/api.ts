/**
 * API Client for communicating with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth_token') 
      : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || errorData.message || 'Request failed');
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Projects
  async getProjects() {
    return this.request<any[]>('/api/projects');
  }

  async getProject(id: string | number) {
    return this.request<any>(`/api/projects/${id}`);
  }

  async createProject(data: any) {
    return this.request<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string | number, data: any) {
    return this.request<any>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string | number) {
    return this.request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Clients
  async getClients() {
    return this.request<any[]>('/api/clients');
  }

  async getClient(id: string) {
    return this.request<any>(`/api/clients/${id}`);
  }

  async createClient(data: any) {
    return this.request<any>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: any) {
    return this.request<any>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request<void>(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  }

  async getClientProjects(clientId: string) {
    return this.request<{ projects: any[] }>(`/api/clients/${clientId}/projects`);
  }

  // Dashboard & Analytics
  async getDashboardStats() {
    return this.request<any>('/api/dashboard/stats');
  }

  async getMarketingStats() {
    return this.request<any>('/api/marketing/stats');
  }

  // Finances
  async getFinances() {
    return this.request<any>('/api/finances');
  }

  // Notifications
  async getNotifications(params?: { limit?: number; unreadOnly?: boolean }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
    
    const query = queryParams.toString();
    return this.request<any>(`/api/notifications${query ? `?${query}` : ''}`);
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/api/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  async deleteNotification(id: string) {
    return this.request<void>(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks & Milestones
  async getProjectTasks(projectId: string | number) {
    return this.request<any[]>(`/api/projects/${projectId}/tasks`);
  }

  async createTask(projectId: string | number, data: any) {
    return this.request<any>(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(projectId: string | number, taskId: string, data: any) {
    return this.request<any>(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(projectId: string | number, taskId: string) {
    return this.request<void>(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async getProjectMilestones(projectId: string | number) {
    return this.request<any[]>(`/api/projects/${projectId}/milestones`);
  }

  async createMilestone(projectId: string | number, data: any) {
    return this.request<any>(`/api/projects/${projectId}/milestones`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMilestone(projectId: string | number, milestoneId: string, data: any) {
    return this.request<any>(`/api/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMilestone(projectId: string | number, milestoneId: string) {
    return this.request<void>(`/api/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'DELETE',
    });
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request<any>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me');
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();


