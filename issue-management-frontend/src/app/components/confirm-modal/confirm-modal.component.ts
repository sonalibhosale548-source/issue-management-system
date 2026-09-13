import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="cancel.emit()">
        <div class="modal-container confirm-modal" (click)="$event.stopPropagation()">
          <div class="confirm-content">
            <div class="warning-icon-wrapper" [class]="'type-' + type()">
              <i class="fa-solid" [class]="getIcon()"></i>
            </div>

            <h3 class="confirm-title">{{ title() }}</h3>
            <p class="confirm-message">{{ message() }}</p>

            <div class="confirm-actions">
              <button class="btn btn-secondary" (click)="cancel.emit()">Cancel</button>
              <button class="btn" [class]="type() === 'danger' ? 'btn-danger' : 'btn-primary'" (click)="confirm.emit()">
                <i class="fa-solid" [class]="confirmIcon()"></i>
                <span>{{ confirmText() }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-modal {
      max-width: 440px;
      padding: 28px;
      border-radius: 24px;
    }

    .confirm-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .warning-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 16px;
    }

    .type-danger {
      background: rgba(244, 63, 94, 0.12);
      color: #e11d48;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }

    .type-warning {
      background: rgba(245, 158, 11, 0.12);
      color: #d97706;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .type-primary {
      background: rgba(13, 148, 136, 0.12);
      color: #0d9488;
      border: 1px solid rgba(13, 148, 136, 0.3);
    }

    .confirm-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #112a32;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .confirm-message {
      font-size: 0.88rem;
      color: #4e737e;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .confirm-actions {
      display: flex;
      gap: 12px;
      width: 100%;
    }

    .confirm-actions button {
      flex: 1;
    }
  `]
})
export class ConfirmModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  confirmText = input<string>('Confirm');
  confirmIcon = input<string>('fa-check');
  type = input<'danger' | 'warning' | 'primary'>('primary');

  cancel = output<void>();
  confirm = output<void>();

  getIcon(): string {
    if (this.type() === 'danger') return 'fa-triangle-exclamation';
    if (this.type() === 'warning') return 'fa-circle-exclamation';
    return 'fa-circle-question';
  }
}
