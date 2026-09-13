import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue, StatusType, PriorityType, STATUS_LIST, PRIORITY_LIST } from '../../models/issue';

@Component({
  selector: 'app-issue-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kanban-board">
      @for (column of columns; track column.key) {
        <div class="kanban-column glass-card">
          <div class="column-header" [class]="'header-' + column.key.toLowerCase()">
            <div class="column-title">
              <i class="fa-solid" [class]="column.icon"></i>
              <span>{{ column.label }}</span>
            </div>
            <span class="column-count">{{ getColumnIssues(column.key).length }}</span>
          </div>

          <div class="column-cards">
            @for (issue of getColumnIssues(column.key); track issue.id) {
              <div class="kanban-card" (click)="viewDetail.emit(issue)">
                <div class="card-top">
                  <span class="card-id">#{{ issue.id }}</span>
                  <span class="badge" [class]="'badge-' + issue.priority.toLowerCase()">
                    <i class="fa-solid" [class]="getPriorityIcon(issue.priority)"></i>
                    {{ issue.priority }}
                  </span>
                </div>

                <h4 class="card-title">{{ issue.title }}</h4>

                @if (issue.description) {
                  <p class="card-desc">{{ truncateText(issue.description, 70) }}</p>
                }

                <div class="card-footer">
                  <div class="assignee-info">
                    <div class="avatar">{{ getAvatarInitials(issue.assignee) }}</div>
                    <span class="assignee-name">{{ issue.assignee || 'Unassigned' }}</span>
                  </div>

                  <div class="card-actions" (click)="$event.stopPropagation()">
                    @if (column.key !== 'OPEN') {
                      <button 
                        class="move-btn" 
                        (click)="moveStatus(issue, getPrevStatus(column.key))"
                        [title]="'Move to ' + getPrevStatus(column.key)"
                      >
                        <i class="fa-solid fa-chevron-left"></i>
                      </button>
                    }
                    @if (column.key !== 'CLOSED') {
                      <button 
                        class="move-btn" 
                        (click)="moveStatus(issue, getNextStatus(column.key))"
                        [title]="'Move to ' + getNextStatus(column.key)"
                      >
                        <i class="fa-solid fa-chevron-right"></i>
                      </button>
                    }
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-column">
                <i class="fa-regular fa-folder-open"></i>
                <span>No issues in {{ column.label }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .kanban-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      align-items: start;
    }

    @media (max-width: 1024px) {
      .kanban-board {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
    }

    .kanban-column {
      padding: 16px;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 220px);
      overflow-y: auto;
      border-radius: var(--radius-lg);
    }

    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      margin-bottom: 16px;
      background: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(200, 220, 225, 0.7);
    }

    .column-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .header-open .column-title { color: #059669; }
    .header-in_progress .column-title { color: #d97706; }
    .header-resolved .column-title { color: #7c3aed; }
    .header-closed .column-title { color: #475569; }

    .column-count {
      background: rgba(13, 148, 136, 0.12);
      padding: 2px 10px;
      border-radius: 980px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #0d9488;
    }

    .column-cards {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .kanban-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 253, 250, 0.72) 100%);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      border-radius: var(--radius-md);
      padding: 16px;
      cursor: pointer;
      box-shadow: 0 8px 24px -6px rgba(15, 45, 55, 0.05), inset 0 1.5px 1px rgba(255, 255, 255, 0.95);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .kanban-card:hover {
      transform: translateY(-3px) scale(1.01);
      border-color: rgba(13, 148, 136, 0.4);
      box-shadow: 0 16px 36px -8px rgba(13, 148, 136, 0.16), inset 0 2px 2px #ffffff;
      background: linear-gradient(135deg, #ffffff 0%, rgba(230, 250, 248, 0.9) 100%);
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .card-id {
      font-size: 0.75rem;
      font-weight: 600;
      color: #4e737e;
      font-family: var(--font-heading);
    }

    .card-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #112a32;
      margin-bottom: 8px;
      line-height: 1.35;
    }

    .card-desc {
      font-size: 0.78rem;
      color: #7a9fa9;
      margin-bottom: 14px;
      line-height: 1.4;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(200, 220, 225, 0.5);
      padding-top: 12px;
      margin-top: 6px;
    }

    .assignee-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(13, 148, 136, 0.2);
    }

    .assignee-name {
      font-size: 0.78rem;
      color: #4e737e;
      font-weight: 500;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .move-btn {
      width: 26px;
      height: 26px;
      border-radius: 980px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(200, 220, 225, 0.7);
      color: #4e737e;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.7rem;
      transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .move-btn:hover {
      background: #0d9488;
      color: #ffffff;
      border-color: #0d9488;
    }

    .empty-column {
      padding: 30px 16px;
      text-align: center;
      color: #7a9fa9;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      border: 1px dashed rgba(200, 220, 225, 0.8);
      border-radius: var(--radius-md);
    }
  `]
})
export class IssueKanbanComponent {
  issues = input<Issue[]>([]);
  searchQuery = input<string>('');

  viewDetail = output<Issue>();
  statusChange = output<{ issue: Issue; newStatus: StatusType }>();

  columns = STATUS_LIST;

  getColumnIssues(status: StatusType): Issue[] {
    let list = this.issues().filter(i => i.status === status);
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(i => 
        i.title.toLowerCase().includes(query) ||
        (i.description && i.description.toLowerCase().includes(query)) ||
        (i.assignee && i.assignee.toLowerCase().includes(query))
      );
    }
    return list;
  }

  moveStatus(issue: Issue, newStatus: StatusType) {
    this.statusChange.emit({ issue, newStatus });
  }

  getPrevStatus(current: StatusType): StatusType {
    const idx = STATUS_LIST.findIndex(s => s.key === current);
    if (idx > 0) return STATUS_LIST[idx - 1].key;
    return current;
  }

  getNextStatus(current: StatusType): StatusType {
    const idx = STATUS_LIST.findIndex(s => s.key === current);
    if (idx < STATUS_LIST.length - 1) return STATUS_LIST[idx + 1].key;
    return current;
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
}
