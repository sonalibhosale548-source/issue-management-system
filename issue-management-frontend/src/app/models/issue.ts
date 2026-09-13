export type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH';
export type StatusType = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Issue {
  id?: number;
  title: string;
  description?: string;
  priority: PriorityType;
  status: StatusType;
  createdDate?: string;
  updatedDate?: string;
  assignee?: string;
}

export const STATUS_LIST: { key: StatusType; label: string; icon: string }[] = [
  { key: 'OPEN', label: 'Open', icon: 'fa-circle-dot' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: 'fa-spinner' },
  { key: 'RESOLVED', label: 'Resolved', icon: 'fa-circle-check' },
  { key: 'CLOSED', label: 'Closed', icon: 'fa-box-archive' },
];

export const PRIORITY_LIST: { key: PriorityType; label: string; icon: string }[] = [
  { key: 'HIGH', label: 'High', icon: 'fa-fire' },
  { key: 'MEDIUM', label: 'Medium', icon: 'fa-layer-group' },
  { key: 'LOW', label: 'Low', icon: 'fa-arrow-down' },
];