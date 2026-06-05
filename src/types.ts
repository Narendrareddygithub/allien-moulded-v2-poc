export type Role = 'Designer' | 'Manager' | 'CEO';

export type Department = 'Sales' | 'Design' | 'Production' | 'Quality' | 'Dispatch';

export interface Project {
  id: string;
  name: string;
  client: string;
  salesOrder: string;
  status: Department;
  progress: number;
  currentRevision: string;
  dueDate: string;
}
