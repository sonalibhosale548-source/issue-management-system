import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue, StatusType, PriorityType, STATUS_LIST, PRIORITY_LIST } from '../../models/issue';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-container glass-card">
      <div class="table-header-controls">
        <div class="filter-group">
          <div class="select-wrapper">
            <i class="fa-solid fa-filter filter-icon"></i>
            <select [value]="statusFilter()" (change)="onStatusFilterChange($event)">
              <option value="ALL">All Statuses</option>
              @for (st of statusOptions; track st.key) {
                <option [value]="st.key">{{ st.label }}</option>
              }
            </select>
          </div>

          <div class="select-wrapper">
            <i class="fa-solid fa-layer-group filter-icon"></i>
            <select [value]="priorityFilter()" (change)="onPriorityFilterChange($event)">
              <option value="ALL">All Priorities</option>
              @for (pr of priorityOptions; track pr.key) {
                <option [value]="pr.key">{{ pr.label }}</option>
              }
            </select>
          </div>

          @if (statusFilter() !== 'ALL' || priorityFilter() !== 'ALL' || searchQuery()) {
            <button class="reset-filter-btn" (click)="resetFilters()">
              <i class="fa-solid fa-rotate-left"></i>
              <span>Reset Filters</span>
            </button>
          }
        </div>

        <div class="results-summary">
          <span>Showing <strong>{{ filteredIssues().length }}</strong> of {{ issues().length }} issues</span>
        </div>
      </div>

      <div class="table-responsive">
        <table class="issue-table">
          <thead>
            <tr>
              <th class="th-id" (click)="toggleSort('id')">
                ID 
                @if (sortBy() === 'id') {
                  <i class="fa-solid" [class.fa-sort-up]="sortOrder() === 'asc'" [class.fa-sort-down]="sortOrder() === 'desc'"></i>
                }
              </th>
              <th (click)="toggleSort('title')">
                Title & Description
                @if (sortBy() === 'title') {
                  <i class="fa-solid" [class.fa-sort-up]="sortOrder() === 'asc'" [class.fa-sort-down]="sortOrder() === 'desc'"></i>
                }
              </th>
              <th (click)="toggleSort('priority')">Priority</th>
              <th (click)="toggleSort('status')">Status</th>
              <th>Assignee</th>
              <th (click)="toggleSort('updatedDate')">Last Updated</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            @for (issue of filteredIssues(); track issue.id; let i = $index) {
              <tr class="issue-row">
                <td class="td-id">#{{ i + 1 }}</td>
                <td class="td-title" (click)="viewDetail.emit(issue)">
                  <div class="title-text">{{ issue.title }}</div>
                  @if (issue.description) {
                    <div class="desc-preview">{{ truncateText(issue.description, 80) }}</div>
                  }
                </td>
                <td>
                  <span class="badge" [class]="'badge-' + issue.priority.toLowerCase()">
                    <i class="fa-solid" [class]="getPriorityIcon(issue.priority)"></i>
                    {{ issue.priority }}
                  </span>
                </td>
                <td>
                  <div class="status-dropdown-wrapper">
                    <span class="badge" [class]="'badge-' + issue.status.toLowerCase()">
                      <i class="fa-solid" [class]="getStatusIcon(issue.status)"></i>
                      {{ formatStatus(issue.status) }}
                    </span>
                    <select 
                      class="inline-status-select" 
                      [value]="issue.status" 
                      (change)="onQuickStatusChange(issue, $event)"
                      title="Quick Change Status"
                    >
                      @for (st of statusOptions; track st.key) {
                        <option [value]="st.key">{{ st.label }}</option>
                      }
                    </select>
                  </div>
                </td>
                <td>
                  <div class="assignee-cell">
                    <div class="avatar">{{ getAvatarInitials(issue.assignee) }}</div>
                    <span class="assignee-name">{{ issue.assignee || 'Unassigned' }}</span>
                  </div>
                </td>
                <td class="td-date">{{ formatDate(issue.updatedDate || issue.createdDate) }}</td>
                <td class="td-actions">
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="viewDetail.emit(issue)" title="View Details">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-icon" (click)="editIssue.emit(issue)" title="Edit Issue">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon delete-btn" (click)="deleteIssue.emit(issue)" title="Delete Issue">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-state-td">
                  <div class="empty-state">
                    <i class="fa-solid fa-clipboard-question empty-icon"></i>
                    <h4>No Issues Found</h4>
                    <p>No issues match your current search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .list-container {
      padding: 20px 24px;
      border-radius: var(--radius-lg);
    }

    .table-header-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .filter-icon {
      position: absolute;
      left: 14px;
      color: #7a9fa9;
      font-size: 0.85rem;
      pointer-events: none;
    }

    .select-wrapper select {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(200, 220, 225, 0.7);
      border-radius: 980px;
      color: #112a32;
      padding: 8px 34px 8px 36px;
      font-size: 0.825rem;
      font-weight: 600;
      font-family: var(--font-body);
      outline: none;
      cursor: pointer;
      appearance: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(15, 45, 55, 0.02);
    }

    .select-wrapper select:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2);
    }

    .select-wrapper select option,
    .inline-status-select option,
    select option {
      background-color: #ffffff;
      color: #112a32;
    }

    .select-wrapper::after {
      content: '\\f0d7';
      font-family: 'Font Awesome 6 Free';
      font-weight: 900;
      position: absolute;
      right: 14px;
      color: #7a9fa9;
      font-size: 0.75rem;
      pointer-events: none;
    }

    .reset-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(200, 220, 225, 0.7);
      color: #4e737e;
      padding: 7px 16px;
      border-radius: 980px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .reset-filter-btn:hover {
      background: #ffffff;
      color: #112a32;
      border-color: #0d9488;
    }

    .results-summary {
      font-size: 0.825rem;
      color: #4e737e;
      font-weight: 500;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .issue-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      text-align: left;
    }

    .issue-table th {
      padding: 12px 16px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #4e737e;
      border-bottom: 1px solid rgba(200, 220, 225, 0.7);
      cursor: pointer;
      user-select: none;
    }

    .issue-table th:hover {
      color: #112a32;
    }

    .th-id { width: 70px; }
    .th-actions { width: 120px; text-align: center; }

    .issue-row {
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .issue-row:hover {
      background: linear-gradient(90deg, rgba(13, 148, 136, 0.08) 0%, rgba(255, 255, 255, 0.75) 100%);
      transform: translateX(3px);
    }

    .issue-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(200, 220, 225, 0.45);
      font-size: 0.875rem;
      vertical-align: middle;
      color: #112a32;
    }

    .td-id {
      font-weight: 600;
      color: #4e737e;
      font-family: var(--font-heading);
    }

    .td-title {
      cursor: pointer;
    }

    .title-text {
      font-weight: 600;
      color: #112a32;
      transition: color 0.2s ease;
    }

    .td-title:hover .title-text {
      color: #0d9488;
    }

    .desc-preview {
      font-size: 0.78rem;
      color: #7a9fa9;
      margin-top: 2px;
    }

    .status-dropdown-wrapper {
      position: relative;
      display: inline-block;
    }

    .inline-status-select {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .assignee-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(13, 148, 136, 0.2);
    }

    .assignee-name {
      font-weight: 500;
      color: #112a32;
    }

    .td-date {
      font-size: 0.8rem;
      color: #4e737e;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .delete-btn:hover {
      background: rgba(244, 63, 94, 0.15) !important;
      color: #e11d48 !important;
      border-color: rgba(244, 63, 94, 0.4) !important;
    }

    .empty-state-td {
      padding: 48px 20px;
      text-align: center;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .empty-icon {
      font-size: 2.5rem;
      color: #7a9fa9;
      margin-bottom: 8px;
    }

    .empty-state h4 {
      font-size: 1.1rem;
      color: #112a32;
      font-weight: 600;
    }

    .empty-state p {
      font-size: 0.85rem;
      color: #4e737e;
    }
  `]
})
export class IssueListComponent {
  issues = input<Issue[]>([]);
  searchQuery = input<string>('');
  statusFilter = input<string>('ALL');
  priorityFilter = input<string>('ALL');

  statusFilterChange = output<StatusType | 'ALL'>();
  priorityFilterChange = output<PriorityType | 'ALL'>();
  viewDetail = output<Issue>();
  editIssue = output<Issue>();
  deleteIssue = output<Issue>();
  statusChange = output<{ issue: Issue; newStatus: StatusType }>();

  statusOptions = STATUS_LIST;
  priorityOptions = PRIORITY_LIST;

  sortBy = signal<'id' | 'title' | 'priority' | 'status' | 'updatedDate'>('updatedDate');
  sortOrder = signal<'asc' | 'desc'>('desc');

  filteredIssues = computed(() => {
    let list = [...this.issues()];
    const query = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();
    const pr = this.priorityFilter();

    if (st !== 'ALL') {
      list = list.filter(i => i.status === st);
    }
    if (pr !== 'ALL') {
      list = list.filter(i => i.priority === pr);
    }
    if (query) {
      list = list.filter(i => 
        i.title.toLowerCase().includes(query) ||
        (i.description && i.description.toLowerCase().includes(query)) ||
        (i.assignee && i.assignee.toLowerCase().includes(query))
      );
    }

    // Sorting
    const field = this.sortBy();
    const isAsc = this.sortOrder() === 'asc';

    list.sort((a, b) => {
      let valA = a[field] ?? '';
      let valB = b[field] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });

    return list;
  });

  onStatusFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as StatusType | 'ALL';
    this.statusFilterChange.emit(val);
  }

  onPriorityFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as PriorityType | 'ALL';
    this.priorityFilterChange.emit(val);
  }

  onQuickStatusChange(issue: Issue, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as StatusType;
    this.statusChange.emit({ issue, newStatus });
  }

  resetFilters() {
    this.statusFilterChange.emit('ALL');
    this.priorityFilterChange.emit('ALL');
  }

  toggleSort(field: 'id' | 'title' | 'priority' | 'status' | 'updatedDate') {
    if (this.sortBy() === field) {
      this.sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortOrder.set('asc');
    }
  }

  formatStatus(status: StatusType): string {
    const match = STATUS_LIST.find(s => s.key === status);
    return match ? match.label : status;
  }

  getStatusIcon(status: StatusType): string {
    const match = STATUS_LIST.find(s => s.key === status);
    return match ? match.icon : 'fa-circle';
  }

  getPriorityIcon(priority: PriorityType): string {
    const match = PRIORITY_LIST.find(p => p.key === priority);
    return match ? match.icon : 'fa-circle';
  }

  getAvatarInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  truncateText(text: string, max: number): string {
    if (text.length <= max) return text;
    return text.substring(0, max) + '...';
  }

  formatDate(isoStr?: string): string {
    if (!isoStr) return '-';
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoStr;
    }
  }
}
