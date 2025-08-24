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

dotenv.config();

// Import AWS RDS functions
import { 
  initializeDatabase, 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  testConnection 
} from './aws-rds';

// Import AWS Bedrock functions
import {
  generateAIResponse,
  searchFAQ,
  getServicesFromS3,
  getFAQFromS3,
  uploadServicesToS3,
  testBedrockConnection
} from './aws-bedrock';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory stores (dev only) - keeping for other entities
type Task = { id: string; title: string; assignee: string; status: string; dueAt?: string };
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
      console.log('🚀 Initializing AWS RDS database...');
      await initializeDatabase();
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
    const isConnected = await testConnection();
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
    
    const response = await generateAIResponse(question, language, context);
    
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
    
    let faq;
    if (query) {
      faq = await searchFAQ(query as string, language as 'pl' | 'en', category as string);
    } else {
      faq = await getFAQFromS3(language as 'pl' | 'en');
      if (category) {
        faq = faq.filter(f => f.category === category);
      }
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
    
    let services = await getServicesFromS3(language as 'pl' | 'en');
    
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

    const success = await uploadServicesToS3(services, language as 'pl' | 'en');

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
    const isConnected = await testBedrockConnection();
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
app.get('/api/users', authenticate, authorize('users'), (req, res) => {
  const users = usersStore.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: u.avatar,
    lastLogin: u.lastLogin,
    isActive: u.isActive,
    permissions: u.permissions
  }));
  res.json(users);
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
    // Using mock data instead of AWS RDS
    const mockProjects = [
      {
        id: '1',
        name: 'E-commerce Platform',
        status: 'In Progress',
        client: 'TechCorp',
        progress: 75,
        dueDate: '2025-09-15',
        budget: 45000,
        description: 'Modern e-commerce platform with payment integration'
      },
      {
        id: '2',
        name: 'Mobile App Development',
        status: 'Completed',
        client: 'StartupXYZ',
        progress: 100,
        dueDate: '2025-08-30',
        budget: 32000,
        description: 'Cross-platform mobile app for task management'
      },
      {
        id: '3',
        name: 'Website Redesign',
        status: 'Planning',
        client: 'FashionStore',
        progress: 20,
        dueDate: '2025-10-01',
        budget: 18000,
        description: 'Complete website redesign with modern UX'
      }
    ];
    res.json(mockProjects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Failed to get projects from database' });
  }
});

// Projekt - szczegóły
app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const project = await getProject(id);
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
    
    const project = await createProject({ name, client, status, description });
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
    
    const updatedProject = await updateProject(id, { name, client, status, description });
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
    await deleteProject(id);
    
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
app.get('/api/clients', (req, res) => {
  res.json([
    {
      id: 1,
      name: "LogisticsPro Sp. z o.o.",
      industry: "Logistyka",
      contact: {
        person: "Anna Kowalska",
        email: "anna.kowalska@logisticspro.pl",
        phone: "+48 600 100 200"
      },
      status: "Aktywny"
    },
    {
      id: 2,
      name: "EstateNow S.A.",
      industry: "Nieruchomości",
      contact: {
        person: "Piotr Nowak",
        email: "piotr.nowak@estatenow.com",
        phone: "+48 500 300 100"
      },
      status: "Współpraca"
    },
    {
      id: 3,
      name: "EduSmart",
      industry: "Edukacja",
      contact: {
        person: "Marta Zielińska",
        email: "marta.zielinska@edusmart.io",
        phone: "+48 790 111 222"
      },
      status: "Prospekt"
    }
  ]);
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});