import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import morgan from 'morgan';
import dotenv from 'dotenv';
import { DynamoDBClient, ScanCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

dotenv.config();

// Import AWS services
// AWS services will be imported when backend is restructured
// For now, using mock implementations

const app = express();
const PORT = process.env.PORT || 3001;
const AWS_REGION = process.env.AWS_REGION || 'eu-west-1'

const ddb = new DynamoDBClient({ region: AWS_REGION })

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory stores (dev only) - keeping for other entities
type Task = { id: string; title: string; assignee: string; status: string; dueAt?: string };
type Notification = {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  message: string;
  data: any;
  createdAt: string;
  read: boolean;
};
type Milestone = { id: string; name: string; date: string; status: string };
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
  permissions: string[];
};
type AuthToken = {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

// Initialize AWS RDS database on startup
app.use(async (req, res, next) => {
  if (!req.app.locals.dbInitialized) {
    try {
      console.log('🚀 Initializing database...');
      // Mock database initialization for now
      req.app.locals.dbInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      // Continue without database for now
    }
  }
  next();
});

// In-memory stores for tasks and milestones (will be moved to AWS RDS later)
const tasksStore: Record<number, Task[]> = {
  1: [
    { id: 'T-1', title: 'Integracja API przewoźników', assignee: 'Marta Górska', status: 'In Progress', dueAt: '2025-08-20' },
    { id: 'T-2', title: 'Panel raportów SLA', assignee: 'Karol Czechowski', status: 'Todo', dueAt: '2025-08-25' },
    { id: 'T-3', title: 'Monitoring i alerty (CloudWatch)', assignee: 'Roman Dominia', status: 'Done', dueAt: '2025-08-05' },
  ],
  2: [
    { id: 'T-4', title: 'Eksport danych do BI', assignee: 'Tomasz Gnat', status: 'Done', dueAt: '2025-07-10' },
  ],
  3: [
    { id: 'T-5', title: 'Moduł quizów', assignee: 'Marta Górska', status: 'In Progress', dueAt: '2025-08-28' },
  ],
};

const milestonesStore: Record<number, Milestone[]> = {
  1: [
    { id: 'M-1', name: 'MVP logistyki', date: '2025-08-15', status: 'On Track' },
    { id: 'M-2', name: 'Wdrożenie produkcyjne', date: '2025-09-01', status: 'Planned' },
  ],
  2: [
    { id: 'M-3', name: 'Zamknięcie projektu', date: '2025-07-20', status: 'Done' },
  ],
  3: [
    { id: 'M-4', name: 'Beta użytkowników', date: '2025-08-30', status: 'At Risk' },
  ],
};

const notifications: Notification[] = [];

let usersStore: User[] = [
  {
    id: 'u1',
    email: 'admin@ecm-digital.com',
    name: 'Tomasz Gnat',
    role: 'admin',
    avatar: 'https://assets.ecm-digital.com/avatars/tomasz.jpg',
    lastLogin: '2025-01-15T10:30:00Z',
    isActive: true,
    permissions: ['all']
  },
  {
    id: 'u2',
    email: 'marta@ecm-digital.com',
    name: 'Marta Górska',
    role: 'manager',
    avatar: 'https://assets.ecm-digital.com/avatars/marta.jpg',
    lastLogin: '2025-01-15T09:15:00Z',
    isActive: true,
    permissions: ['projects', 'clients', 'case-studies', 'team']
  },
  {
    id: 'u3',
    email: 'karol@ecm-digital.com',
    name: 'Karol Czechowski',
    role: 'employee',
    avatar: 'https://assets.ecm-digital.com/avatars/karol.jpg',
    lastLogin: '2025-01-14T16:45:00Z',
    isActive: true,
    permissions: ['projects', 'case-studies']
  },
  {
    id: 'u4',
    email: 'roman@ecm-digital.com',
    name: 'Roman Dominia',
    role: 'employee',
    avatar: 'https://assets.ecm-digital.com/avatars/roman.jpg',
    lastLogin: '2025-01-14T14:20:00Z',
    isActive: true,
    permissions: ['clients', 'services', 'automations']
  }
];

let authTokensStore: AuthToken[] = [];

// Passwords (in real app, use proper hashing)
const userPasswords: Record<string, string> = {
  'admin@ecm-digital.com': 'admin123',
  'marta@ecm-digital.com': 'manager123',
  'karol@ecm-digital.com': 'dev123',
  'roman@ecm-digital.com': 'specialist123'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test AWS RDS connection
app.get('/api/test-aws', async (req, res) => {
  try {
    // For now, assume connection is successful in local development
    const isConnected = true;
    res.json({ 
      status: 'success', 
      message: 'AWS RDS connection test successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AWS RDS connection test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'AWS RDS connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// AI Endpoint - /ask
app.post('/api/ask', async (req, res) => {
  try {
    const { question, language = 'pl', context } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ 
        error: 'Question is required' 
      });
    }

    console.log(`🤖 AI Question: ${question} (${language})`);
    
    // Mock AI response for now
    const response = `Mock AI response for: ${question}`;
    
    res.json({
      status: 'success',
      data: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in AI endpoint:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to generate AI response',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// FAQ Endpoint - /faq
app.get('/api/faq', async (req, res) => {
  try {
    const { language = 'pl', category, query } = req.query;
    
    console.log(`📚 FAQ Request: lang=${language}, category=${category}, query=${query}`);
    
    // Mock FAQ data for now
    let faq = [
      { id: 1, question: 'Jak mogę się zarejestrować?', answer: 'Użyj formularza rejestracji na stronie głównej.', category: 'general' },
      { id: 2, question: 'Jakie są koszty usług?', answer: 'Koszty zależą od zakresu projektu. Skontaktuj się z nami.', category: 'pricing' }
    ];
    
    if (query && typeof query === 'string') {
      faq = faq.filter(f => f.question.toLowerCase().includes(query.toLowerCase()) || f.answer.toLowerCase().includes(query.toLowerCase()));
    }
    
    if (category) {
      faq = faq.filter(f => f.category === category);
    }
    
    res.json({
      status: 'success',
      data: {
        faq,
        total: faq.length,
        language,
        category: category || 'all'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in FAQ endpoint:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch FAQ',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Services Endpoint - /services
app.get('/api/services', async (req, res) => {
  try {
    const { language = 'pl', category } = req.query;
    
    console.log(`🛠️ Services Request: lang=${language}, category=${category}`);
    
    // Mock services data for now
    let services = [
      { id: 'srv-1', name: 'Strony WWW', description: 'Projektowanie i wdrożenia nowoczesnych stron internetowych.', category: 'web' },
      { id: 'srv-2', name: 'Aplikacje mobilne', description: 'Natywne i cross-platform aplikacje mobilne.', category: 'mobile' },
      { id: 'srv-3', name: 'E-commerce', description: 'Sklepy internetowe i platformy sprzedażowe.', category: 'ecommerce' }
    ];
    
    if (category) {
      services = services.filter(s => s.category === category);
    }
    
    res.json({
      status: 'success',
      data: {
        services,
        total: services.length,
        language,
        category: category || 'all'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in Services endpoint:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch services',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Upload Services Endpoint
app.post('/api/services/upload', async (req, res) => {
  try {
    const { services, language = 'pl' } = req.body;

    if (!services || !Array.isArray(services)) {
      return res.status(400).json({
        status: 'error',
        message: 'Services array is required'
      });
    }

    // Mock upload for now
    const success = true;

    if (success) {
      res.json({
        status: 'success',
        message: 'Services uploaded successfully',
        data: {
          count: services.length,
          language
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to upload services to S3'
      });
    }
  } catch (error) {
    console.error('Error uploading services:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload services',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test Bedrock Connection
app.get('/api/test-bedrock', async (req, res) => {
  try {
    // Mock Bedrock connection for now
    const isConnected = true;
    res.json({ 
      status: 'success', 
      message: 'AWS Bedrock connection test successful',
      connected: isConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AWS Bedrock connection test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'AWS Bedrock connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Authentication middleware
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.substring(7);
  const authToken = authTokensStore.find(t => t.token === token && t.expiresAt > new Date());

  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or expired token' });
  }

  const user = usersStore.find(u => u.id === authToken.userId);
  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Unauthorized - User not found or inactive' });
  }

  req.user = user;
  next();
};

// Authorization middleware
const authorize = (permission: string) => {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.permissions.includes('all') || user.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
  };
};

// Authentication endpoints
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = usersStore.find(u => u.email === email);
  const correctPassword = userPasswords[email];

  if (!user || !user.isActive || password !== correctPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token (in real app, use JWT)
  const token = `token_${Date.now()}_${user.id}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const authToken: AuthToken = {
    userId: user.id,
    token,
    expiresAt,
    createdAt: new Date()
  };

  authTokensStore.push(authToken);

  // Update last login
  user.lastLogin = new Date().toISOString();

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      permissions: user.permissions
    },
    token,
    expiresAt: expiresAt.toISOString()
  });
});

app.post('/auth/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);

  if (token) {
    authTokensStore = authTokensStore.filter(t => t.token !== token);
  }

  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    permissions: user.permissions
  });
});

// Token validation endpoint for frontend
app.get('/auth/validate', authenticate, (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    permissions: user.permissions
  });
});

// Users management endpoints
app.get('/api/users', authenticate, authorize('users'), async (req, res) => {
  try {
    const baseUrl = process.env.API_BASE_URL || 'https://suimqa3s1h.execute-api.eu-west-1.amazonaws.com/prod'
    const resp = await fetch(`${baseUrl}/auth/users`)
    if (!resp.ok) {
      const text = await resp.text()
      return res.status(502).json({ error: 'Failed to fetch users from API', details: text })
    }
    const json = await resp.json() as any
    const users = json.users || []
    return res.json(users)
  } catch (error) {
    console.error('Error fetching users from API:', error)
    return res.status(500).json({ error: 'Internal error fetching users' })
  }
});

app.get('/api/users/:id', authenticate, authorize('users'), (req, res) => {
  const user = usersStore.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
    isActive: user.isActive,
    permissions: user.permissions
  });
});

app.patch('/api/users/:id', authenticate, authorize('users'), (req, res) => {
  const user = usersStore.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, role, isActive, permissions } = req.body;

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (permissions !== undefined) user.permissions = permissions;

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
    isActive: user.isActive,
    permissions: user.permissions
  });
});

// Zadania projektu
app.get('/api/projects/:id/tasks', (req, res) => {
  const id = Number(req.params.id);
  res.json(tasksStore[id] || []);
});

app.post('/api/projects/:id/tasks', (req, res) => {
  const id = Number(req.params.id);
  const { title, assignee, status = 'Todo', dueAt } = req.body as Partial<Task>;
  if (!title || !assignee) return res.status(400).json({ error: 'Missing title or assignee' });
  const list = tasksStore[id] || [];
  const newTask: Task = {
    id: `T-${Date.now()}`,
    title,
    assignee,
    status,
    ...(dueAt ? { dueAt } : {}),
  };
  tasksStore[id] = [newTask, ...list];
  res.status(201).json(newTask);
});

// Update task status
app.patch('/api/projects/:id/tasks/:taskId', (req, res) => {
  const id = Number(req.params.id);
  const { taskId } = req.params as { taskId: string };
  const { status, title, assignee, dueAt } = req.body as Partial<Task>;
  const list = tasksStore[id] || [];
  const idx = list.findIndex(t => t.id === taskId);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  list[idx] = { ...list[idx], ...(status ? { status } : {}), ...(title ? { title } : {}), ...(assignee ? { assignee } : {}), ...(dueAt !== undefined ? { dueAt } : {}) };
  tasksStore[id] = list;
  res.json(list[idx]);
});

// Delete task
app.delete('/api/projects/:id/tasks/:taskId', (req, res) => {
  const id = Number(req.params.id);
  const { taskId } = req.params as { taskId: string };
  const list = tasksStore[id] || [];
  const next = list.filter(t => t.id !== taskId);
  if (next.length === list.length) return res.status(404).json({ error: 'Task not found' });
  tasksStore[id] = next;
  res.status(204).send();
});

// Kamienie milowe projektu
app.get('/api/projects/:id/milestones', (req, res) => {
  const id = Number(req.params.id);
  res.json(milestonesStore[id] || []);
});

app.post('/api/projects/:id/milestones', (req, res) => {
  const id = Number(req.params.id);
  const { name, date, status = 'Planned' } = req.body as Partial<Milestone>;
  if (!name || !date) return res.status(400).json({ error: 'Missing name or date' });
  const list = milestonesStore[id] || [];
  const newMs: Milestone = {
    id: `M-${Date.now()}`,
    name,
    date,
    status,
  };
  milestonesStore[id] = [newMs, ...list];
  res.status(201).json(newMs);
});

// Update milestone
app.patch('/api/projects/:id/milestones/:milestoneId', (req, res) => {
  const id = Number(req.params.id);
  const { milestoneId } = req.params as { milestoneId: string };
  const { name, date, status } = req.body as Partial<Milestone>;
  const list = milestonesStore[id] || [];
  const idx = list.findIndex(m => m.id === milestoneId);
  if (idx === -1) return res.status(404).json({ error: 'Milestone not found' });
  list[idx] = { ...list[idx], ...(name ? { name } : {}), ...(date ? { date } : {}), ...(status ? { status } : {}) };
  milestonesStore[id] = list;
  res.json(list[idx]);
});

// Delete milestone
app.delete('/api/projects/:id/milestones/:milestoneId', (req, res) => {
  const id = Number(req.params.id);
  const { milestoneId } = req.params as { milestoneId: string };
  const list = milestonesStore[id] || [];
  const next = list.filter(m => m.id !== milestoneId);
  if (next.length === list.length) return res.status(404).json({ error: 'Milestone not found' });
  milestonesStore[id] = next;
  res.status(204).send();
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'ECM Digital management API' });
});

// Case studies endpoint
app.get('/api/case-studies/publish', (req, res) => {
  res.json({
    success: true,
    caseStudies: [
      {
        id: '1',
        title: 'E-commerce Platform for Fashion Brand',
        description: 'Complete e-commerce solution with payment integration',
        status: 'published'
      },
      {
        id: '2',
        title: 'Mobile App Development',
        description: 'Cross-platform mobile application for logistics',
        status: 'draft'
      }
    ]
  });
});

app.post('/api/case-studies/publish', (req, res) => {
  res.json({
    success: true,
    message: 'Case study published successfully',
    caseStudyId: 'new_' + Date.now()
  });
});

// FAQ endpoint
app.get('/api/faq', (req, res) => {
  res.json({
    success: true,
    data: {
      faq: [
        {
          id: '1',
          question: 'Jak długo trwa realizacja projektu?',
          answer: 'Czas realizacji zależy od złożoności projektu, ale standardowo trwa od 2 do 12 tygodni.'
        },
        {
          id: '2',
          question: 'Czy oferujecie wsparcie po zakończeniu projektu?',
          answer: 'Tak, oferujemy pakiety wsparcia technicznego i utrzymania.'
        }
      ]
    }
  });
});

// Projekty
app.get('/api/projects', async (req, res) => {
  try {
    const out = await ddb.send(new ScanCommand({ TableName: 'ecm-projects' }))
    const items = (out.Items || []).map(i => unmarshall(i))
    const projects = items.map((p: any) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      client: p.userId,
      progress: Math.min(100, Math.round(((p.budget_used || 0) / Math.max(1, p.budget_total || 0)) * 100)),
      dueDate: p.deadline || p.updatedAt || p.createdAt,
      budget: p.budget_total || 0,
      description: p.description || '',
    }))
    res.json(projects)
  } catch (error) {
    console.error('Error getting projects (DynamoDB):', error)
    res.status(500).json({ error: 'Failed to get projects from DynamoDB' })
  }
});

// Projekt - szczegóły
app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Mock project data for now
    const project = { id, name: 'Mock Project', client: 'Mock Client', status: 'Active', description: 'Mock description' };
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Failed to get project from database' });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, client, status, description } = req.body;
    if (!name || !client || !status || !description) {
      return res.status(400).json({ error: 'Missing fields (name, client, status, description)' });
    }
    
    // Mock project creation for now
    const project = { id: Math.floor(Math.random() * 1000), name, client, status, description };
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project in database' });
  }
});

// Update project
app.patch('/api/projects/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, client, status, description } = req.body;
    
    // Mock project update for now
    const updatedProject = { id, name, client, status, description };
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project in database' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Mock project deletion for now
    console.log(`Mock deleting project ${id}`);
    
    // Also clean related stores (best-effort)
    delete tasksStore[id];
    delete milestonesStore[id];
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project from database' });
  }
});

// Klienci
app.get('/api/clients', async (req, res) => {
  try {
    const out = await ddb.send(new ScanCommand({ TableName: 'ecm-users' }))
    const items = (out.Items || []).map(i => unmarshall(i))
    const clients = items.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      company: user.company || '',
      role: user.role || 'client',
      status: user.isEmailVerified ? 'Zweryfikowany' : 'Niezweryfikowany',
      registration_date: user.createdAt,
      lastLoginAt: user.lastLoginAt || null
    }))
    res.json(clients)
  } catch (error) {
    console.error('Błąd podczas pobierania klientów (DynamoDB):', error)
    res.json([])
  }
});

// Dodaj nowego klienta
app.post('/api/clients', (req, res) => {
  try {
    const clientData = req.body;

    // Walidacja danych
    if (!clientData.email || !clientData.contact_person) {
      return res.status(400).json({
        error: 'Email i osoba kontaktowa są wymagane'
      });
    }

    // Tutaj będzie logika zapisywania do bazy danych
    console.log('Nowy klient:', clientData);

    // Na razie zwracamy sukces
    res.status(201).json({
      message: 'Klient dodany pomyślnie',
      client: {
        id: Date.now().toString(),
        ...clientData,
        status: 'active',
        registration_date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Błąd dodawania klienta:', error);
    res.status(500).json({
      error: 'Błąd serwera podczas dodawania klienta'
    });
  }
});

// Edytuj klienta
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'ID klienta jest wymagane'
      });
    }

    console.log(`Edytowanie klienta ${id}:`, updateData);

    // Pobierz klienta z panelu klienta, żeby sprawdzić czy istnieje
    const clientDashboardUrl = process.env.CLIENT_DASHBOARD_API_BASE_URL || 'http://localhost:3002';

    // Najpierw pobierz wszystkich klientów, żeby znaleźć tego z właściwym ID
    const getResponse = await fetch(`${clientDashboardUrl}/api/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      return res.status(500).json({
        error: 'Błąd pobierania listy klientów'
      });
    }

    const { users } = await getResponse.json() as { users: any[] };
    const existingClient = users.find((user: any) => user.id === id);

    if (!existingClient) {
      return res.status(404).json({
        error: 'Klient nie znaleziony'
      });
    }

    // Przygotuj dane do aktualizacji
    const updatedClient = {
      ...existingClient,
      ...updateData
    };

    // Aktualizuj klienta w panelu klienta
    const updateResponse = await fetch(`${clientDashboardUrl}/api/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      return res.status(500).json({
        error: 'Błąd aktualizacji klienta w bazie danych'
      });
    }

    const updatedUser = await updateResponse.json() as any;
    console.log(`✅ Klient zaktualizowany: ${existingClient.email} -> ${updatedUser.email || existingClient.email}`);

    res.json({
      message: 'Klient zaktualizowany pomyślnie',
      client: {
        id: updatedUser.id || updatedClient.id,
        email: updatedUser.email || existingClient.email,
        firstName: updatedUser.firstName || existingClient.firstName,
        lastName: updatedUser.lastName || existingClient.lastName,
        name: updatedUser.name || existingClient.name,
        company: updatedUser.company || existingClient.company,
        role: updatedUser.role || existingClient.role,
        status: updatedUser.isEmailVerified ? 'Zweryfikowany' : 'Niezweryfikowany',
        registration_date: updatedUser.createdAt || existingClient.createdAt,
        lastLoginAt: updatedUser.lastLoginAt || existingClient.lastLoginAt
      }
    });
  } catch (error) {
    console.error('Błąd edycji klienta:', error);
    res.status(500).json({
      error: 'Błąd serwera podczas edycji klienta'
    });
  }
});

// Usuń klienta
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'ID klienta jest wymagane'
      });
    }

    // Pobierz klienta z panelu klienta, żeby sprawdzić czy istnieje
    const clientDashboardUrl = process.env.CLIENT_DASHBOARD_API_BASE_URL || 'http://localhost:3002';

    // Najpierw pobierz wszystkich klientów, żeby znaleźć tego z właściwym ID
    const getResponse = await fetch(`${clientDashboardUrl}/api/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      return res.status(500).json({
        error: 'Błąd pobierania listy klientów'
      });
    }

    const { users } = await getResponse.json() as { users: any[] };
    const clientToDelete = users.find((user: any) => user.id === id);

    if (!clientToDelete) {
      return res.status(404).json({
        error: 'Klient nie znaleziony'
      });
    }

    // Usuń klienta z panelu klienta
    const deleteResponse = await fetch(`${clientDashboardUrl}/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      return res.status(500).json({
        error: 'Błąd usuwania klienta z bazy danych'
      });
    }

    console.log(`✅ Klient usunięty: ${clientToDelete.email}`);

    res.json({
      message: 'Klient usunięty pomyślnie',
      deletedClient: {
        id: clientToDelete.id,
        email: clientToDelete.email,
        name: clientToDelete.name
      }
    });

  } catch (error) {
    console.error('Błąd usuwania klienta:', error);
    res.status(500).json({
      error: 'Błąd serwera podczas usuwania klienta'
    });
  }
});

// Zespół
app.get('/api/team', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Tomasz Gnat",
      role: "Discovery Consultant",
      bio: "Ekspert w odkrywaniu potrzeb biznesowych i strategii cyfrowej"
    },
    {
      id: 2,
      name: "Marta Górska",
      role: "UX/UI Designer",
      bio: "Specjalistka od projektowania doświadczeń użytkownika"
    },
    {
      id: 3,
      name: "Karol Czechowski",
      role: "QA Specialist & Developer",
      bio: "Specjalista od zapewnienia jakości i testowania aplikacji"
    },
    {
      id: 4,
      name: "Roman Dominia",
      role: "Social Media & Automations Specialist",
      bio: "Ekspert od social media i automatyzacji procesów biznesowych"
    }
  ]);
});

// 🔥 MARKETING ANALYTICS - Statystyki marketingowe
app.get('/api/marketing/stats', async (req, res) => {
  try {
    // Pobierz statystyki klientów z DynamoDB
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    const weekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Symulacja danych - w rzeczywistości pobrać z DynamoDB
    const stats = {
      overview: {
        totalClients: 8,
        activeClients: 7,
        newClientsToday: 1,
        newClientsThisWeek: 3,
        newClientsThisMonth: 5,
        conversionRate: 85.7,
        avgProjectValue: 25000,
        totalRevenue: 420000
      },
      trends: {
        clientsByDay: [
          { date: today, count: 1 },
          { date: weekAgo, count: 2 },
          { date: monthAgo, count: 5 }
        ],
        revenueByMonth: [
          { month: '2025-01', revenue: 150000 },
          { month: '2025-02', revenue: 270000 }
        ]
      },
      sources: {
        organic: 45,
        referral: 25,
        paid: 20,
        direct: 10
      },
      topPerforming: {
        services: [
          { name: 'Strony WWW', conversions: 12, revenue: 180000 },
          { name: 'Sklepy Shopify', conversions: 8, revenue: 120000 },
          { name: 'Automatyzacje', conversions: 5, revenue: 75000 }
        ],
        clients: [
          { name: 'Tech Solutions', revenue: 45000, projects: 3 },
          { name: 'Design Studio', revenue: 35000, projects: 2 },
          { name: 'Test Company', revenue: 28000, projects: 2 }
        ]
      },
      alerts: [
        {
          type: 'success',
          message: '🎉 Świetna konwersja! 85.7% rejestracji przechodzi do klientów',
          timestamp: new Date().toISOString()
        },
        {
          type: 'info',
          message: '📈 3 nowych klientów w tym tygodniu',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'warning',
          message: '⚡ Sprawdź lead quality - 2 potencjalnych klientów wymaga follow-up',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching marketing stats:', error);
    res.status(500).json({ error: 'Failed to fetch marketing statistics' });
  }
});

// Finanse
app.get('/api/finances', (req, res) => {
  res.json({
    kpis: {
      mrr: 42000,
      arr: 42000 * 12,
      expensesMonthly: 21500,
      profitMonthly: 42000 - 21500,
      invoicesOverdue: 2,
    },
    invoices: [
      {
        id: 'FV/2025/08/001',
        client: 'LogisticsPro Sp. z o.o.',
        amount: 12500,
        currency: 'PLN',
        issuedAt: '2025-08-01',
        dueAt: '2025-08-14',
        status: 'Unpaid',
      },
      {
        id: 'FV/2025/07/014',
        client: 'EstateNow S.A.',
        amount: 9800,
        currency: 'PLN',
        issuedAt: '2025-07-15',
        dueAt: '2025-07-29',
        status: 'Paid',
      },
      {
        id: 'FV/2025/07/009',
        client: 'EduSmart',
        amount: 6400,
        currency: 'PLN',
        issuedAt: '2025-07-08',
        dueAt: '2025-07-22',
        status: 'Overdue',
      },
    ],
    expenses: [
      { id: 'EXP-001', category: 'Infra (AWS)', amount: 3800, currency: 'PLN' },
      { id: 'EXP-002', category: 'Narzędzia (SaaS)', amount: 1200, currency: 'PLN' },
      { id: 'EXP-003', category: 'Wynagrodzenia', amount: 14500, currency: 'PLN' },
    ],
  });
});

// 🔥 NOTIFICATIONS SYSTEM - System powiadomień o nowych klientach
app.post('/api/notifications/new-client', (req, res) => {
  try {
    const { type, client, priority, message } = req.body;

    if (!client || !message) {
      return res.status(400).json({ error: 'Missing required fields: client, message' });
    }

    // Utwórz nową powiadomienie
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type || 'new_client_registration',
      priority: priority || 'high',
      message,
      data: client,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Dodaj do in-memory store
    notifications.unshift(notification); // Dodaj na początek (najnowsze)

    // Ogranicz do 100 powiadomień
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    console.log(`🔔 NEW CLIENT NOTIFICATION: ${message}`);
    console.log(`   👤 Client: ${client.fullName} (${client.email})`);
    console.log(`   🏢 Company: ${client.companyName || 'Not provided'}`);
    console.log(`   📞 Phone: ${client.phone || 'Not provided'}`);

    res.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Pobierz wszystkie powiadomienia
app.get('/api/notifications', (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;

    let filteredNotifications = notifications;

    if (unreadOnly === 'true') {
      filteredNotifications = notifications.filter(n => !n.read);
    }

    const limitedNotifications = filteredNotifications.slice(0, parseInt(limit as string));

    res.json({
      notifications: limitedNotifications,
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Oznacz powiadomienie jako przeczytane
app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;

    res.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Usuń powiadomienie
app.delete('/api/notifications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = notifications.findIndex(n => n.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const deletedNotification = notifications.splice(index, 1)[0];

    res.json({
      success: true,
      deletedNotification
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Oznacz wszystkie powiadomienia jako przeczytane
app.patch('/api/notifications/mark-all-read', (req, res) => {
  try {
    notifications.forEach(notification => {
      notification.read = true;
    });

    res.json({
      success: true,
      updated: notifications.length
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.get('/api/clients/:id/projects', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Client id is required' });

    // Resolve client email from users table by id
    const usersOut = await ddb.send(new ScanCommand({ TableName: 'ecm-users' }))
    const users = (usersOut.Items || []).map(i => unmarshall(i))
    const matched = users.find((u: any) => u.id === id)
    if (!matched) return res.status(404).json({ error: 'Client not found' })
    const email = matched.email

    // Query projects by GSI userId
    const projOut = await ddb.send(new QueryCommand({
      TableName: 'ecm-projects',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#uid = :uid',
      ExpressionAttributeNames: { '#uid': 'userId' },
      ExpressionAttributeValues: { ':uid': { S: email } },
    }))
    const items = (projOut.Items || []).map(i => unmarshall(i))
    const projects = items.map((p: any) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      client: p.userId,
      progress: Math.min(100, Math.round(((p.budget_used || 0) / Math.max(1, p.budget_total || 0)) * 100)),
      dueDate: p.deadline || p.updatedAt || p.createdAt,
      budget: p.budget_total || 0,
      description: p.description || '',
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))
    return res.json({ projects })
  } catch (error) {
    console.error('Error fetching client projects (DynamoDB):', error)
    return res.status(500).json({ error: 'Internal error fetching client projects' })
  }
});