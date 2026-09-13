# Issue Management System - Frontend (Angular 19)

A responsive single-page web application built with Angular 19 for issue tracking, status updates, and interactive issue management.

---

## 🛠️ Technologies Used
- **Framework**: Angular 19 (Standalone Components, Signals, Reactive state)
- **Language**: TypeScript
- **Styling**: Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Micro-animations)
- **Icons**: FontAwesome 6 (CDN)

---

## 📋 Features & Functionality
- **Dual View Modes**:
  - **Table View**: Compact view with sorting, searching, priority indicators, and quick status badges.
  - **Kanban Board**: Drag-and-drop / single-click status updates across Open, In Progress, Resolved, and Closed columns.
- **Interactive Forms & Validation**: Modal forms for issue creation and editing with real-time field validation.
- **Live Search & Filtering**: Multi-criteria filter support by Priority, Status, and search term.
- **Dashboard Counters & Quick Stats**: Real-time analytical counts for total, open, in-progress, resolved, and high-priority issues.
- **Toast Notifications & Modals**: Instant user feedback on create, update, delete, and connection state changes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Run the Development Server
```bash
# Navigate to frontend directory
cd issue-management-frontend

# Install dependencies (if not already installed)
npm install

# Start Angular development server
npm start
```
*Open your browser and navigate to `http://localhost:4200`*

### Build for Production
```bash
npm run build
```
*Build artifacts will be stored in the `dist/` directory.*
