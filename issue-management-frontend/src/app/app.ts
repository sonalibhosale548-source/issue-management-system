import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from './services/issue';
import { Issue, StatusType, PriorityType } from './models/issue';
import { HeaderComponent } from './components/header/header.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { IssueKanbanComponent } from './components/issue-kanban/issue-kanban.component';
import { IssueFormModalComponent } from './components/issue-form-modal/issue-form-modal.component';
import { IssueDetailModalComponent } from './components/issue-detail-modal/issue-detail-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    DashboardStatsComponent,
    IssueListComponent,
    IssueKanbanComponent,
    IssueFormModalComponent,
    IssueDetailModalComponent,
    ConfirmModalComponent,
    ToastContainerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  issueService = inject(IssueService);

  // App UI State Signals
  readonly activeView = signal<'table' | 'kanban'>('table');
  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<StatusType | 'ALL'>('ALL');
  readonly priorityFilter = signal<PriorityType | 'ALL'>('ALL');

  // Modal & Confirmation Signals
  readonly isFormModalOpen = signal<boolean>(false);
  readonly issueToEdit = signal<Issue | null>(null);
  readonly selectedDetailIssue = signal<Issue | null>(null);
  readonly issueToDelete = signal<Issue | null>(null);
  readonly pendingStatusChange = signal<{ issue: Issue; newStatus: StatusType } | null>(null);
  readonly pendingSaveIssue = signal<Issue | null>(null);
  readonly isSubmitting = signal<boolean>(false);

  // Modal Triggers
  openCreateModal() {
    this.issueToEdit.set(null);
    this.isFormModalOpen.set(true);
  }

  openEditModal(issue: Issue) {
    this.issueToEdit.set(issue);
    this.isFormModalOpen.set(true);
    // Close detail modal if open
    this.selectedDetailIssue.set(null);
  }

  closeFormModal() {
    this.isFormModalOpen.set(false);
    this.issueToEdit.set(null);
  }

  openDetailModal(issue: Issue) {
    this.selectedDetailIssue.set(issue);
  }

  closeDetailModal() {
    this.selectedDetailIssue.set(null);
  }

  confirmDeleteIssue(issue: Issue) {
    this.issueToDelete.set(issue);
    this.selectedDetailIssue.set(null);
  }

  cancelDelete() {
    this.issueToDelete.set(null);
  }

  // Request Save (Create or Edit Warning)
  requestSaveIssue(issue: Issue) {
    if (issue.id) {
      // Existing issue: ask for confirmation warning first
      this.pendingSaveIssue.set(issue);
    } else {
      // New issue creation
      this.executeSaveIssue(issue);
    }
  }

  confirmSaveIssue() {
    const issue = this.pendingSaveIssue();
    if (issue) {
      this.executeSaveIssue(issue);
      this.pendingSaveIssue.set(null);
    }
  }

  cancelSaveIssue() {
    this.pendingSaveIssue.set(null);
  }

  private executeSaveIssue(issue: Issue) {
    this.isSubmitting.set(true);

    if (issue.id) {
      this.issueService.updateIssue(issue.id, issue).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeFormModal();
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.issueService.createIssue(issue).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeFormModal();
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }

  // Request Status Change (Triggers warning confirmation dialog)
  requestStatusChange(event: { issue: Issue; newStatus: StatusType }) {
    if (!event.issue.id) return;
    if (event.issue.status === event.newStatus) return;
    this.pendingStatusChange.set(event);
  }

  confirmStatusChange() {
    const pending = this.pendingStatusChange();
    if (!pending || !pending.issue.id) return;

    const updated: Issue = {
      ...pending.issue,
      status: pending.newStatus
    };

    this.issueService.updateIssue(pending.issue.id, updated).subscribe({
      next: (res) => {
        this.pendingStatusChange.set(null);
        if (this.selectedDetailIssue()?.id === pending.issue.id) {
          this.selectedDetailIssue.set(res);
        }
      },
      error: () => this.pendingStatusChange.set(null)
    });
  }

  cancelStatusChange() {
    this.pendingStatusChange.set(null);
  }

  // Execute Deletion
  executeDelete() {
    const toDelete = this.issueToDelete();
    if (toDelete && toDelete.id) {
      this.issueService.deleteIssue(toDelete.id).subscribe({
        next: () => {
          this.issueToDelete.set(null);
        }
      });
    }
  }

  // Quick Stat Filters
  handleFilterStatus(status: StatusType) {
    this.statusFilter.set(status);
    this.priorityFilter.set('ALL');
  }

  handleFilterPriority(priority: PriorityType) {
    this.priorityFilter.set(priority);
    this.statusFilter.set('ALL');
  }

  handleFilterReset() {
    this.statusFilter.set('ALL');
    this.priorityFilter.set('ALL');
    this.searchQuery.set('');
  }

  formatStatus(status?: StatusType): string {
    if (!status) return '';
    switch (status) {
      case 'OPEN': return 'Open';
      case 'IN_PROGRESS': return 'In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'CLOSED': return 'Closed';
      default: return status;
    }
  }
}
