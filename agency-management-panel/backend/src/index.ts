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

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory stores (dev only)
type Task = { id: string; title: string; assignee: string; status: string; dueAt?: string };
type Milestone = { id: string; name: string; date: string; status: string };
type Project = { id: number; name: string; client: string; status: string; description: string };
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

let projectsStore: Project[] = [
  {
    id: 1,
    name: "Platforma logistyczna",
    client: "LogisticsPro",
    status: "Aktywny",
    description: "System obsługujący 1000+ dostaw dziennie, React + Node.js + AWS."
  },
  {
    id: 2,
    name: "PropTech Real Estate",
    client: "EstateNow",
    status: "Zakończony",
    description: "Platforma zarządzania nieruchomościami, Vue.js + Django."
  },
  {
    id: 3,
    name: "EdTech LMS",
    client: "EduSmart",
    status: "Wdrożenie",
    description: "System edukacyjny z video streamingiem, Next.js + GraphQL."
  }
];

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

// Users and Authentication
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

// Projekty
app.get('/api/projects', (req, res) => {
  res.json(projectsStore);
});

// Projekt - szczegóły
app.get('/api/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const project = projectsStore.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create project
app.post('/api/projects', (req, res) => {
  const { name, client, status, description } = req.body as Partial<Project>;
  if (!name || !client || !status || !description) {
    return res.status(400).json({ error: 'Missing fields (name, client, status, description)' });
  }
  const id = (projectsStore.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1;
  const project: Project = { id, name, client, status, description };
  projectsStore = [project, ...projectsStore];
  res.status(201).json(project);
});

// Update project
app.patch('/api/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, client, status, description } = req.body as Partial<Project>;
  const idx = projectsStore.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  const current = projectsStore[idx];
  const updated: Project = {
    ...current,
    ...(name !== undefined ? { name } : {}),
    ...(client !== undefined ? { client } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(description !== undefined ? { description } : {}),
  } as Project;
  projectsStore = [
    ...projectsStore.slice(0, idx),
    updated,
    ...projectsStore.slice(idx + 1),
  ];
  res.json(updated);
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = projectsStore.length;
  projectsStore = projectsStore.filter(p => p.id !== id);
  // Also clean related stores (best-effort)
  delete tasksStore[id];
  delete milestonesStore[id];
  if (projectsStore.length === before) return res.status(404).json({ error: 'Project not found' });
  res.status(204).send();
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