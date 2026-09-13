# Issue Management System

A full-stack Issue Management Web Application built with **Java Spring Boot (Backend)** and **Angular 19 (Frontend)**. Users can report problems, track bug status, edit ticket details, filter issues, and manage task boards in real time.

---

## 🏗️ Project Architecture

```
GrowVenus-Projects/
├── issue-management-system/        # Spring Boot 3 Backend API
│   ├── src/main/java/              # REST Controller, Services, Entity, JPA Repository
│   ├── src/test/java/              # JUnit 5 & Mockito Unit/Integration Tests
│   ├── pom.xml                     # Maven dependencies
│   └── Issue_Management_System.postman_collection.json # Postman Test Collection
│
└── issue-management-frontend/      # Angular 19 Frontend Web App
    ├── src/app/components/         # Standalone Components (Table, Kanban, Modals)
    ├── src/app/services/           # Issue API HTTP Service & Toast Notifications
    └── src/app/models/             # Issue Data Models & Enums
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend API (Spring Boot)
```bash
cd issue-management-system
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080`*
*H2 Web Console available at `http://localhost:8080/h2-console`*

### 2. Start the Frontend Web App (Angular)
```bash
cd issue-management-frontend
npm start
```
*Frontend runs on `http://localhost:4200`*

---

## 📝 Functional Requirements Checklist

| Requirement | Implementation Status |
|---|---|
| Auto-generated `id` | ✅ Implemented (`@GeneratedValue(strategy = GenerationType.IDENTITY)`) |
| Required `title` field | ✅ Implemented (`@NotBlank` on backend, required input on frontend) |
| `description` field | ✅ Implemented |
| `priority` (`Low`, `Medium`, `High`) | ✅ Implemented (`Priority` Enum) |
| `status` (`Open`, `In Progress`, `Resolved`, `Closed`) | ✅ Implemented (`Status` Enum) |
| `createdDate` & `updatedDate` | ✅ Implemented (`@PrePersist` & `@PreUpdate` callbacks) |
| `assignee` (string field) | ✅ Implemented |
| **Create new issues** | ✅ Implemented (`POST /api/issues`) |
| **View all issues** | ✅ Implemented (`GET /api/issues`) |
| **Update issue details or status** | ✅ Implemented (`PUT /api/issues/{id}`) |
| **Delete issues** | ✅ Implemented (`DELETE /api/issues/{id}`) |
| **Filter issues by priority or status** | ✅ Implemented (`/api/issues/priority/{priority}`, `/api/issues/status/{status}`) |
| **Spring Boot Backend with RESTful endpoints** | ✅ Implemented |
| **JPA/Hibernate with H2 or MySQL** | ✅ Implemented (H2 default + MySQL config included) |
| **Exception Handling & HTTP Status Codes** | ✅ Implemented (200, 201, 204, 400, 404) |
| **Angular Frontend (Table + Kanban + Modals)** | ✅ Implemented |

---

## 🧪 Postman API Testing
To test all RESTful endpoints using Postman:
1. Open **Postman**.
2. Click **Import** and select `issue-management-system/Issue_Management_System.postman_collection.json`.
3. Execute tests against `http://localhost:8080/api/issues`.
