import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue, StatusType, PriorityType } from '../../models/issue';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <div 
        class="stat-card glass-card total" 
        [class.selected]="selectedStatus() === 'ALL' && selectedPriority() === 'ALL'"
        (click)="filterReset.emit()"
      >
        <div class="stat-icon total-icon">
          <i class="fa-solid fa-list"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">Total Issues</span>
          <span class="stat-value">{{ totalCount() }}</span>
        </div>
      </div>

      <div 
        class="stat-card glass-card open" 
        [class.selected]="selectedStatus() === 'OPEN'"
        (click)="filterStatus.emit('OPEN')"
      >
        <div class="stat-icon open-icon">
          <i class="fa-solid fa-circle-dot"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">Open</span>
          <span class="stat-value">{{ openCount() }}</span>
        </div>
      </div>

      <div 
        class="stat-card glass-card in-progress" 
        [class.selected]="selectedStatus() === 'IN_PROGRESS'"
        (click)="filterStatus.emit('IN_PROGRESS')"
      >
        <div class="stat-icon in-progress-icon">
          <i class="fa-solid fa-spinner"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">In Progress</span>
          <span class="stat-value">{{ inProgressCount() }}</span>
        </div>
      </div>

      <div 
        class="stat-card glass-card resolved" 
        [class.selected]="selectedStatus() === 'RESOLVED'"
        (click)="filterStatus.emit('RESOLVED')"
      >
        <div class="stat-icon resolved-icon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">Resolved</span>
          <span class="stat-value">{{ resolvedCount() }}</span>
        </div>
      </div>

      <div 
        class="stat-card glass-card high-priority" 
        [class.selected]="selectedPriority() === 'HIGH'"
        (click)="filterPriority.emit('HIGH')"
      >
        <div class="stat-icon high-icon">
          <i class="fa-solid fa-fire"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">High Priority</span>
          <span class="stat-value">{{ highPriorityCount() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 22px;
      cursor: pointer;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 253, 250, 0.7) 50%, rgba(255, 255, 255, 0.8) 100%);
      backdrop-filter: blur(28px) saturate(200%);
      -webkit-backdrop-filter: blur(28px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 12px 30px -8px rgba(13, 148, 136, 0.08), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(13, 148, 136, 0.04);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: transparent;
      transition: background 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px) scale(1.015);
      box-shadow: 0 20px 40px -10px rgba(13, 148, 136, 0.18), inset 0 2px 2px #ffffff, inset 0 -2px 6px rgba(13, 148, 136, 0.1);
      border-color: rgba(13, 148, 136, 0.4);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(230, 250, 248, 0.85) 100%);
    }

    .stat-card.selected {
      border-color: #0d9488;
      box-shadow: 0 0 25px rgba(13, 148, 136, 0.28), inset 0 2px 2px #ffffff;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(220, 248, 245, 0.9) 100%);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 980px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .total-icon { background: rgba(13, 148, 136, 0.14); color: #0d9488; }
    .open-icon { background: rgba(16, 185, 129, 0.14); color: #059669; }
    .in-progress-icon { background: rgba(245, 158, 11, 0.14); color: #d97706; }
    .resolved-icon { background: rgba(139, 92, 246, 0.14); color: #7c3aed; }
    .high-icon { background: rgba(244, 63, 94, 0.14); color: #e11d48; }

    .total::after { background: #0d9488; }
    .open::after { background: #10b981; }
    .in-progress::after { background: #f59e0b; }
    .resolved::after { background: #8b5cf6; }
    .high-priority::after { background: #f43f5e; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #4e737e;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #112a32;
      line-height: 1.2;
      letter-spacing: -0.03em;
      font-family: var(--font-heading);
    }
  `]
})
export class DashboardStatsComponent {
  issues = input<Issue[]>([]);
  selectedStatus = input<string>('ALL');
  selectedPriority = input<string>('ALL');

  filterStatus = output<StatusType>();
  filterPriority = output<PriorityType>();
  filterReset = output<void>();

  totalCount = computed(() => this.issues().length);
  openCount = computed(() => this.issues().filter(i => i.status === 'OPEN').length);
  inProgressCount = computed(() => this.issues().filter(i => i.status === 'IN_PROGRESS').length);
  resolvedCount = computed(() => this.issues().filter(i => i.status === 'RESOLVED').length);
  highPriorityCount = computed(() => this.issues().filter(i => i.priority === 'HIGH').length);
}
