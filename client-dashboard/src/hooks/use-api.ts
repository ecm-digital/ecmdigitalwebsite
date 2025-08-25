'use client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://suimqa3s1h.execute-api.eu-west-1.amazonaws.com/prod'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
        message: data.message,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Auth endpoints
  async signUp(userData: { email: string; name: string; company?: string }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async verifyUser(data: { email: string; name?: string; firstName?: string; lastName?: string; company?: string }) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signIn(credentials: { email: string; password: string }) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getProfile(userId: string) {
    return this.request(`/auth/profile`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async updateProfile(userData: { id: string; name?: string; company?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Projects endpoints
  async getProjects(userId: string) {
    return this.request(`/projects`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
  }

  async createProject(projectData: {
    name: string
    description?: string
    userId: string
    status?: string
    budget?: number
    deadline?: string
  }) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(projectData: {
    id: string
    name?: string
    description?: string
    status?: string
    budget?: number
    deadline?: string
    progress?: number
  }) {
    return this.request(`/projects/${projectData.id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
  }

  // Documents endpoints
  async getDocuments(projectId: string, userId?: string) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify({ projectId, userId }),
    })
  }

  async getDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
  }

  async createDocument(documentData: {
    name: string
    type: string
    size?: number
    projectId: string
    userId: string
    description?: string
    tags?: string[]
  }) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    })
  }

  async updateDocument(documentData: {
    id: string
    name?: string
    description?: string
    tags?: string[]
    status?: string
  }) {
    return this.request(`/documents/${documentData.id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    })
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
  }

  // Chatbot endpoints
  async sendChatbotMessage(messageData: {
    message: string
    userId: string
    projectId?: string
    conversationId?: string
  }) {
    return this.request('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  async getConversation(conversationId: string, userId?: string, projectId?: string) {
    return this.request('/chatbot/conversation', {
      method: 'POST',
      body: JSON.stringify({ conversationId, userId, projectId }),
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Hook for using API in React components
export const useApi = () => {
  return {
    auth: {
      signUp: apiClient.signUp.bind(apiClient),
      signIn: apiClient.signIn.bind(apiClient),
      getProfile: apiClient.getProfile.bind(apiClient),
      updateProfile: apiClient.updateProfile.bind(apiClient),
      verify: apiClient.verifyUser.bind(apiClient),
    },
    projects: {
      getProjects: apiClient.getProjects.bind(apiClient),
      getProject: apiClient.getProject.bind(apiClient),
      createProject: apiClient.createProject.bind(apiClient),
      updateProject: apiClient.updateProject.bind(apiClient),
      deleteProject: apiClient.deleteProject.bind(apiClient),
    },
    documents: {
      getDocuments: apiClient.getDocuments.bind(apiClient),
      getDocument: apiClient.getDocument.bind(apiClient),
      createDocument: apiClient.createDocument.bind(apiClient),
      updateDocument: apiClient.updateDocument.bind(apiClient),
      deleteDocument: apiClient.deleteDocument.bind(apiClient),
    },
    chatbot: {
      sendMessage: apiClient.sendChatbotMessage.bind(apiClient),
      getConversation: apiClient.getConversation.bind(apiClient),
    },
  }
}



