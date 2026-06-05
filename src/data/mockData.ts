import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'PRJ-1001',
    name: 'Enclosure Panel Type A',
    client: 'GlobalTech Industries',
    salesOrder: 'SO-2026-089',
    status: 'Production',
    progress: 65,
    currentRevision: 'R2',
    dueDate: '2026-11-15',
  },
  {
    id: 'PRJ-1002',
    name: 'Custom Control Box',
    client: 'Nexus Energy',
    salesOrder: 'SO-2026-092',
    status: 'Design',
    progress: 20,
    currentRevision: 'R0',
    dueDate: '2026-12-01',
  },
  {
    id: 'PRJ-1003',
    name: 'Standard Moulded Base',
    client: 'Apex Manufacturing',
    salesOrder: 'SO-2026-105',
    status: 'Quality',
    progress: 90,
    currentRevision: 'R1',
    dueDate: '2026-10-20',
  }
];
