// Minimal, in-memory stubs for AWS RDS helpers used by the dev server

type ProjectRecord = {
  id: number;
  name: string;
  client: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const projectsStore: Map<number, ProjectRecord> = new Map();
let nextProjectId = 1;

export async function initializeDatabase(): Promise<void> {
  // No-op for local dev stub
}

export async function testConnection(): Promise<boolean> {
  // Always succeeds in local stub
  return true;
}

export async function getProjects(): Promise<ProjectRecord[]> {
  return Array.from(projectsStore.values());
}

export async function getProject(id: number): Promise<ProjectRecord | null> {
  return projectsStore.get(id) || null;
}

export async function createProject(input: {
  name: string;
  client: string;
  status: string;
  description: string;
}): Promise<ProjectRecord> {
  const now = new Date().toISOString();
  const record: ProjectRecord = {
    id: nextProjectId++,
    name: input.name,
    client: input.client,
    status: input.status,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };
  projectsStore.set(record.id, record);
  return record;
}

export async function updateProject(
  id: number,
  input: Partial<Pick<ProjectRecord, 'name' | 'client' | 'status' | 'description'>>
): Promise<ProjectRecord> {
  const existing = projectsStore.get(id);
  if (!existing) {
    throw new Error('Project not found');
  }
  const updated: ProjectRecord = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  projectsStore.set(id, updated);
  return updated;
}

export async function deleteProject(id: number): Promise<void> {
  projectsStore.delete(id);
}


