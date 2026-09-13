import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [class]="'toast-' + toast.type">
          <i class="fa-solid toast-icon" [class]="getIcon(toast.type)"></i>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      min-width: 300px;
      max-width: 440px;
      padding: 12px 18px;
      border-radius: 980px;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(200, 220, 225, 0.8);
      box-shadow: 0 10px 30px rgba(15, 45, 55, 0.12);
      display: flex;
      align-items: center;
      gap: 12px;
      color: #112a32;
      animation: slideInRight 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast-icon {
      font-size: 1.1rem;
    }

    .toast-success {
      border-left: 4px solid #10b981;
    }
    .toast-success .toast-icon { color: #059669; }

    .toast-error {
      border-left: 4px solid #f43f5e;
    }
    .toast-error .toast-icon { color: #e11d48; }

    .toast-info {
      border-left: 4px solid #0d9488;
    }
    .toast-info .toast-icon { color: #0d9488; }

    .toast-warning {
      border-left: 4px solid #f59e0b;
    }
    .toast-warning .toast-icon { color: #d97706; }

    .toast-message {
      font-size: 0.85rem;
      font-weight: 600;
      flex: 1;
      letter-spacing: -0.01em;
    }

    .toast-close {
      background: none;
      border: none;
      color: #7a9fa9;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 2px;
      transition: color 0.2s;
    }
    .toast-close:hover { color: #112a32; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'fa-circle-check';
      case 'error': return 'fa-circle-exclamation';
      case 'warning': return 'fa-triangle-exclamation';
      default: return 'fa-circle-info';
    }
  }
}
