import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Issue, PriorityType, StatusType } from '../models/issue';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:8080/api/issues';
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  readonly isBackendConnected = signal<boolean>(false);
  readonly issues = signal<Issue[]>([]);
  readonly loading = signal<boolean>(false);

  // Mock initial seed data in case backend database is temporarily offline
  private initialMockIssues: Issue[] = [
    {
      id: 1,
      title: 'Database connection timeout in production cluster',
      description: 'The Spring Boot API experiences periodic 504 Gateway Timeouts during peak traffic loads.',
      priority: 'HIGH',
      status: 'OPEN',
      assignee: 'Alex Morgan',
      createdDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedDate: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 2,
      title: 'Implement JWT refresh token rotation mechanism',
      description: 'Add refresh token endpoint to maintain session persistence securely.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignee: 'Sarah Connor',
      createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedDate: new Date(Date.now() - 3600000 * 1).toISOString()
    },
    {
      id: 3,
      title: 'Fix CORS header configuration on REST endpoints',
      description: 'Allow cross-origin requests from http://localhost:4200 Angular frontend.',
      priority: 'HIGH',
      status: 'RESOLVED',
      assignee: 'David Chen',
      createdDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedDate: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 4,
      title: 'Update Maven pom.xml dependencies for Spring Boot 3',
      description: 'Upgrade Jakarta persistence dependencies to resolve vulnerability advisories.',
      priority: 'LOW',
      status: 'CLOSED',
      assignee: 'Alex Morgan',
      createdDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedDate: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  constructor() {
    // Initial fetch
    this.refreshIssues();
  }

  refreshIssues(): void {
    this.loading.set(true);
    this.getAllIssues().subscribe({
      next: (data) => {
        this.issues.set(data);
        this.isBackendConnected.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.isBackendConnected.set(false);
        this.loading.set(false);
        if (this.issues().length === 0) {
          this.issues.set(this.initialMockIssues);
          this.toastService.info('Backend unreachable - operating with local state mode');
        }
      }
    });
  }

  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl).pipe(
      tap(() => this.isBackendConnected.set(true)),
      catchError((err: HttpErrorResponse) => {
        this.isBackendConnected.set(false);
        return of(this.issues());
      })
    );
  }

  getIssueById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.issues().find(i => i.id === id);
        if (found) return of(found);
        return throwError(() => new Error(`Issue ${id} not found`));
      })
    );
  }

  createIssue(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue).pipe(
      tap(created => {
        this.isBackendConnected.set(true);
        this.issues.update(current => [created, ...current]);
        this.toastService.success(`Issue "${created.title}" created successfully!`);
      }),
      catchError((err) => {
        // Fallback for offline create
        const currentIssues = this.issues();
        const existingIds = new Set(currentIssues.map(i => i.id).filter((id): id is number => id !== undefined && id !== null));
        let nextId = 1;
        while (existingIds.has(nextId)) {
          nextId++;
        }
        const localIssue: Issue = {
          ...issue,
          id: nextId,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        };
        this.issues.update(current => [localIssue, ...current]);
        this.toastService.success(`Issue "${localIssue.title}" created (Local Mode)`);
        return of(localIssue);
      })
    );
  }

  updateIssue(id: number, issue: Issue): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/${id}`, issue).pipe(
      tap(updated => {
        this.isBackendConnected.set(true);
        this.issues.update(current => current.map(item => item.id === id ? updated : item));
        this.toastService.success(`Issue #${id} updated successfully!`);
      }),
      catchError(() => {
        const updatedLocal: Issue = {
          ...issue,
          id,
          updatedDate: new Date().toISOString()
        };
        this.issues.update(current => current.map(item => item.id === id ? updatedLocal : item));
        this.toastService.success(`Issue #${id} updated (Local Mode)`);
        return of(updatedLocal);
      })
    );
  }

  deleteIssue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.isBackendConnected.set(true);
        this.issues.update(current => current.filter(item => item.id !== id));
        this.toastService.success(`Issue #${id} deleted successfully.`);
      }),
      catchError(() => {
        this.issues.update(current => current.filter(item => item.id !== id));
        this.toastService.success(`Issue #${id} removed from list`);
        return of(undefined as unknown as void);
      })
    );
  }

  getIssuesByPriority(priority: PriorityType): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/priority/${priority}`).pipe(
      catchError(() => of(this.issues().filter(i => i.priority === priority)))
    );
  }

  getIssuesByStatus(status: StatusType): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/status/${status}`).pipe(
      catchError(() => of(this.issues().filter(i => i.status === status)))
    );
  }
}