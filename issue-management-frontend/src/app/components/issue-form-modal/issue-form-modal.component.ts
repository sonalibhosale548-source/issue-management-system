import { Component, input, output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Issue, StatusType, PriorityType, STATUS_LIST, PRIORITY_LIST } from '../../models/issue';

@Component({
  selector: 'app-issue-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-group">
            <i class="fa-solid" [class]="issueToEdit() ? 'fa-pen-to-square' : 'fa-circle-plus'"></i>
            <h3>{{ issueToEdit() ? 'Edit Issue #' + issueToEdit()?.id : 'Create New Issue' }}</h3>
          </div>
          <button class="close-btn" (click)="closeModal()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form [formGroup]="issueForm" (ngSubmit)="onSubmit()" class="modal-form">
          <div class="form-group">
            <label for="title">Title <span class="required-star">*</span></label>
            <input 
              id="title"
              type="text" 
              formControlName="title"
              placeholder="Brief summary of the issue..."
              [class.invalid]="isFieldInvalid('title')"
            />
            @if (isFieldInvalid('title')) {
              <span class="error-msg">Title is required</span>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority <span class="required-star">*</span></label>
              <div class="select-box">
                <select id="priority" formControlName="priority">
                  @for (pr of priorityOptions; track pr.key) {
                    <option [value]="pr.key">{{ pr.label }}</option>
                  }
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>

            <div class="form-group">
              <label for="status">Status <span class="required-star">*</span></label>
              <div class="select-box">
                <select id="status" formControlName="status">
                  @for (st of statusOptions; track st.key) {
                    <option [value]="st.key">{{ st.label }}</option>
                  }
                </select>
                <i class="fa-solid fa-chevron-down select-arrow"></i>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="assignee">Assignee</label>
            <div class="input-with-icon">
              <i class="fa-regular fa-user input-icon"></i>
              <input 
                id="assignee"
                type="text" 
                formControlName="assignee"
                placeholder="Assignee name (e.g. Alex Morgan)"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              formControlName="description"
              rows="4"
              placeholder="Provide context, steps to reproduce, or notes..."
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="issueForm.invalid || submitting()">
              <i class="fa-solid" [class]="submitting() ? 'fa-spinner fa-spin' : (issueToEdit() ? 'fa-check' : 'fa-plus')"></i>
              <span>{{ issueToEdit() ? 'Save Changes' : 'Create Issue' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(200, 220, 225, 0.6);
    }

    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #0d9488;
      font-size: 1.1rem;
    }

    .modal-title-group h3 {
      color: #112a32;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .close-btn {
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

    .modal-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #4e737e;
      letter-spacing: -0.01em;
    }

    .required-star {
      color: #f43f5e;
    }

    input[type="text"], textarea {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(200, 220, 225, 0.7);
      border-radius: var(--radius-md);
      padding: 10px 14px;
      color: #112a32;
      font-size: 0.875rem;
      outline: none;
      font-family: var(--font-body);
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(15, 45, 55, 0.02);
    }

    input::placeholder, textarea::placeholder {
      color: #7a9fa9;
    }

    input:focus, textarea:focus, select:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2);
      background: #ffffff;
    }

    input.invalid {
      border-color: #f43f5e;
    }

    .error-msg {
      font-size: 0.75rem;
      color: #f43f5e;
    }

    .select-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .select-box select {
      width: 100%;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(200, 220, 225, 0.7);
      border-radius: var(--radius-md);
      padding: 10px 36px 10px 14px;
      color: #112a32;
      font-size: 0.875rem;
      font-family: var(--font-body);
      outline: none;
      appearance: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(15, 45, 55, 0.02);
    }

    .select-box select option,
    select option {
      background-color: #ffffff;
      color: #112a32;
    }

    .select-arrow {
      position: absolute;
      right: 14px;
      color: #7a9fa9;
      font-size: 0.75rem;
      pointer-events: none;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: #7a9fa9;
    }

    .input-with-icon input {
      width: 100%;
      padding-left: 38px;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 10px;
      padding-top: 18px;
      border-top: 1px solid rgba(200, 220, 225, 0.6);
    }
  `]
})
export class IssueFormModalComponent implements OnInit, OnChanges {
  issueToEdit = input<Issue | null>(null);
  submitting = input<boolean>(false);

  close = output<void>();
  save = output<Issue>();

  statusOptions = STATUS_LIST;
  priorityOptions = PRIORITY_LIST;

  issueForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issueToEdit']) {
      this.populateForm();
    }
  }

  private initForm() {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      priority: ['MEDIUM', [Validators.required]],
      status: ['OPEN', [Validators.required]],
      assignee: ['']
    });
  }

  private populateForm() {
    const issue = this.issueToEdit();
    if (issue && this.issueForm) {
      this.issueForm.patchValue({
        title: issue.title,
        description: issue.description || '',
        priority: issue.priority || 'MEDIUM',
        status: issue.status || 'OPEN',
        assignee: issue.assignee || ''
      });
    } else if (this.issueForm) {
      this.issueForm.reset({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'OPEN',
        assignee: ''
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.issueForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }

    const formValues = this.issueForm.value;
    const result: Issue = {
      ...this.issueToEdit(),
      title: formValues.title.trim(),
      description: formValues.description ? formValues.description.trim() : '',
      priority: formValues.priority,
      status: formValues.status,
      assignee: formValues.assignee ? formValues.assignee.trim() : 'Unassigned'
    };

    this.save.emit(result);
  }

  closeModal() {
    this.close.emit();
  }
}
