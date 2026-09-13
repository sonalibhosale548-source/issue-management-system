import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header glass-card">
      <div class="header-left">
        <div class="brand-logo">
          <i class="fa-solid fa-bug-slash logo-icon"></i>
          <div class="brand-text">
            <span class="brand-title">IssueTracker</span>
            <span class="brand-subtitle">Spring Boot & Angular 21</span>
          </div>
        </div>

        <div class="backend-badge" [class.online]="isBackendConnected()" [class.offline]="!isBackendConnected()">
          <span class="pulse-dot"></span>
          <span class="status-label">
            {{ isBackendConnected() ? 'Backend Live (Port 8080)' : 'Offline / Demo Mode' }}
          </span>
        </div>
      </div>

      <div class="header-center">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            placeholder="Search issues by title, description or assignee..."
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
          @if (searchQuery()) {
            <button class="clear-btn" (click)="clearSearch()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          }
        </div>
      </div>

      <div class="header-right">
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            [class.active]="activeView() === 'table'"
            (click)="activeViewChange.emit('table')"
            title="List Table View"
          >
            <i class="fa-solid fa-list-check"></i>
            <span>Table</span>
          </button>
          <button 
            class="toggle-btn" 
            [class.active]="activeView() === 'kanban'"
            (click)="activeViewChange.emit('kanban')"
            title="Kanban Board View"
          >
            <i class="fa-solid fa-table-columns"></i>
            <span>Kanban</span>
          </button>
        </div>

        <button class="btn btn-primary" (click)="openCreateModal.emit()">
          <i class="fa-solid fa-plus"></i>
          <span>New Issue</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      margin-bottom: 24px;
      gap: 20px;
      flex-wrap: wrap;
      border-radius: var(--radius-lg);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 1.3rem;
      color: #0d9488;
      background: rgba(13, 148, 136, 0.12);
      padding: 10px;
      border-radius: 980px;
      border: 1px solid rgba(13, 148, 136, 0.25);
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #112a32;
      display: block;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: #4e737e;
      font-weight: 500;
    }

    .backend-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 980px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid transparent;
      letter-spacing: -0.01em;
    }

    .backend-badge.online {
      background-color: rgba(16, 185, 129, 0.12);
      color: #059669;
      border-color: rgba(16, 185, 129, 0.28);
    }

    .backend-badge.offline {
      background-color: rgba(245, 158, 11, 0.12);
      color: #d97706;
      border-color: rgba(245, 158, 11, 0.28);
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      position: relative;
    }

    .online .pulse-dot {
      background-color: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .offline .pulse-dot {
      background-color: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
    }

    .header-center {
      flex: 1;
      max-width: 440px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      color: #7a9fa9;
      font-size: 0.85rem;
    }

    .search-box input {
      width: 100%;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(200, 220, 225, 0.7);
      border-radius: 980px;
      padding: 9px 36px 9px 38px;
      color: #112a32;
      font-size: 0.875rem;
      font-family: var(--font-body);
      outline: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(15, 45, 55, 0.02);
    }

    .search-box input::placeholder {
      color: #7a9fa9;
    }

    .search-box input:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2);
      background: #ffffff;
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: #7a9fa9;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .clear-btn:hover {
      color: #112a32;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .view-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(200, 220, 225, 0.7);
      border-radius: 980px;
      padding: 3px;
      gap: 2px;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border: none;
      background: transparent;
      color: #4e737e;
      font-size: 0.825rem;
      font-weight: 600;
      border-radius: 980px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .toggle-btn.active {
      background: var(--accent-primary-gradient);
      color: #ffffff;
      box-shadow: 0 3px 12px rgba(13, 148, 136, 0.35);
    }

    .toggle-btn:hover:not(.active) {
      color: #112a32;
    }
  `]
})
export class HeaderComponent {
  searchQuery = input<string>('');
  activeView = input<'table' | 'kanban'>('table');
  isBackendConnected = input<boolean>(false);

  searchQueryChange = output<string>();
  activeViewChange = output<'table' | 'kanban'>();
  openCreateModal = output<void>();

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQueryChange.emit(val);
  }

  clearSearch() {
    this.searchQueryChange.emit('');
  }
}
