import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue, StatusType, PriorityType, STATUS_LIST, PRIORITY_LIST } from '../../models/issue';

@Component({
  selector: 'app-issue-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (issue()) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-container detail-modal" (click)="$event.stopPropagation()">
          <div class="detail-header">
            <div class="detail-title-row">
              <span class="detail-id">Issue #{{ issue()?.id }}</span>
              <div class="badges-row">
                <span class="badge" [class]="'badge-' + issue()?.priority?.toLowerCase()">
                  <i class="fa-solid" [class]="getPriorityIcon(issue()?.priority)"></i>
                  {{ issue()?.priority }} Priority
                </span>
                <span class="badge" [class]="'badge-' + issue()?.status?.toLowerCase()">
                  <i class="fa-solid" [class]="getStatusIcon(issue()?.status)"></i>
                  {{ formatStatus(issue()?.status) }}
                </span>
              </div>
            </div>

            <h2 class="detail-heading">{{ issue()?.title }}</h2>

            <button class="close-btn" (click)="close.emit()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="detail-body">
            <div class="meta-section glass-card">
              <div class="meta-item">
                <span class="meta-label"><i class="fa-regular fa-user"></i> Assignee</span>
                <div class="assignee-box">
                  <div class="avatar">{{ getAvatarInitials(issue()?.assignee) }}</div>
                  <span class="assignee-name">{{ issue()?.assignee || 'Unassigned' }}</span>
                </div>
              </div>

              <div class="meta-item">
                <span class="meta-label"><i class="fa-regular fa-calendar"></i> Created On</span>
                <span class="meta-value">{{ formatDate(issue()?.createdDate) }}</span>
              </div>

              <div class="meta-item">
                <span class="meta-label"><i class="fa-regular fa-clock"></i> Last Updated</span>
                <span class="meta-value">{{ formatDate(issue()?.updatedDate) }}</span>
              </div>
            </div>

            <div class="desc-section">
              <h4 class="section-title"><i class="fa-regular fa-file-lines"></i> Description</h4>
              <div class="desc-box">
                @if (issue()?.description) {
                  <p>{{ issue()?.description }}</p>
                } @else {
                  <p class="no-desc">No description provided for this issue.</p>
                }
              </div>
            </div>

            <div class="status-workflow-section">
              <h4 class="section-title"><i class="fa-solid fa-arrows-rotate"></i> Quick Status Update</h4>
              <div class="workflow-buttons">
                @for (st of statusOptions; track st.key) {
                  <button 
                    class="workflow-btn" 
                    [class.active]="issue()?.status === st.key"
                    (click)="changeStatus(st.key)"
                  >
                    <i class="fa-solid" [class]="st.icon"></i>
                    <span>{{ st.label }}</span>
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="detail-footer">
            <button class="btn btn-secondary" (click)="edit.emit(issue()!)">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Edit Issue</span>
            </button>
            <button class="btn btn-danger" (click)="delete.emit(issue()!)">
              <i class="fa-solid fa-trash-can"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-modal {
      max-width: 640px;
    }

    .detail-header {
      padding: 24px;
      border-bottom: 1px solid rgba(200, 220, 225, 0.6);
      position: relative;
    }

    .detail-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-right: 48px;
    }

    .detail-id {
      font-size: 0.85rem;
      font-weight: 700;
      color: #4e737e;
      font-family: var(--font-heading);
    }

    .badges-row {
      display: flex;
      gap: 8px;
    }

    .detail-heading {
      font-size: 1.3rem;
      color: #112a32;
      font-weight: 700;
      line-height: 1.3;
      padding-right: 48px;
      letter-spacing: -0.02em;
    }

    .close-btn {
      position: absolute;
      top: 24px;
      right: 24px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(200, 220, 225, 0.7);
      color: #7a9fa9;
      font-size: 0.9rem;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 980px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .close-btn:hover {
      background: #ffffff;
      color: #112a32;
      border-color: #0d9488;
    }

    .detail-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .meta-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(200, 220, 225, 0.6);
      border-radius: var(--radius-md);
    }

    @media (max-width: 540px) {
      .meta-section {
        grid-template-columns: 1fr;
      }
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #4e737e;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .meta-value {
      font-size: 0.88rem;
      color: #112a32;
      font-weight: 600;
    }

    .assignee-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(13, 148, 136, 0.2);
    }

    .assignee-name {
      font-size: 0.88rem;
      color: #112a32;
      font-weight: 500;
    }

    .section-title {
      font-size: 0.825rem;
      font-weight: 600;
      color: #4e737e;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: -0.01em;
    }

    .desc-box {
      background: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(200, 220, 225, 0.6);
      border-radius: var(--radius-md);
      padding: 16px;
      color: #112a32;
      font-size: 0.88rem;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .no-desc {
      color: #7a9fa9;
      font-style: italic;
    }

    .workflow-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    @media (max-width: 540px) {
      .workflow-buttons {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .workflow-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(200, 220, 225, 0.7);
      border-radius: 980px;
      color: #4e737e;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .workflow-btn:hover {
      background: #ffffff;
      color: #112a32;
      border-color: #0d9488;
    }

    .workflow-btn.active {
      background: var(--accent-primary-gradient);
      color: #ffffff;
      border-color: #0d9488;
      box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
    }

    .detail-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 18px 24px;
      border-top: 1px solid rgba(200, 220, 225, 0.6);
    }
  `]
})
export class IssueDetailModalComponent {
  issue = input<Issue | null>(null);

  close = output<void>();
  edit = output<Issue>();
  delete = output<Issue>();
  statusChange = output<{ issue: Issue; newStatus: StatusType }>();

  statusOptions = STATUS_LIST;

  changeStatus(newStatus: StatusType) {
    const i = this.issue();
    if (i && i.status !== newStatus) {
      this.statusChange.emit({ issue: i, newStatus });
    }
  }

  formatStatus(status?: StatusType): string {
    if (!status) return '';
    const match = STATUS_LIST.find(s => s.key === status);
    return match ? match.label : status;
  }

  getStatusIcon(status?: StatusType): string {
    if (!status) return 'fa-circle';
    const match = STATUS_LIST.find(s => s.key === status);
    return match ? match.icon : 'fa-circle';
  }

  getPriorityIcon(priority?: PriorityType): string {
    if (!priority) return 'fa-circle';
    const match = PRIORITY_LIST.find(p => p.key === priority);
    return match ? match.icon : 'fa-circle';
  }

  getAvatarInitials(name?: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  formatDate(isoStr?: string): string {
    if (!isoStr) return '-';
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, { 
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  }
}
