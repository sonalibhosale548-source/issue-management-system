# Issue Management System - Backend (Spring Boot API)

A RESTful web service built using Java 17 and Spring Boot for reporting, tracking, and managing software issues and bug tickets.

---

## 🛠️ Technologies Used
- **Java**: 17
- **Framework**: Spring Boot 3.2.5
- **ORM & Database**: Spring Data JPA / Hibernate, H2 In-Memory Database (Default) & MySQL support
- **Validation**: Jakarta Validation (`@NotBlank`, `@NotNull`)
- **Testing**: JUnit 5, Mockito, Spring Boot Test (`MockMvc`)
- **Build Tool**: Apache Maven

---

## 📋 Features & Functionality
- **Full CRUD Operations** for issue items (`id`, `title`, `description`, `priority`, `status`, `createdDate`, `updatedDate`, `assignee`).
- **Automatic Metadata Tracking**: `createdDate` and `updatedDate` are automatically populated using JPA lifecycle callbacks (`@PrePersist`, `@PreUpdate`).
- **Field Validation & Exception Handling**: Returns appropriate HTTP status codes (200, 201, 400, 404, etc.) with structured JSON error responses.
- **RESTful Filter Endpoints**: Filter issues specifically by `Priority` (LOW, MEDIUM, HIGH) or `Status` (OPEN, IN_PROGRESS, RESOLVED, CLOSED).
- **CORS Configured**: Pre-configured for seamless communication with Angular frontend (`http://localhost:4200`).

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+ (or use included `mvnw` wrapper)

### Run the Backend Server
```bash
# Navigate to backend directory
cd issue-management-system

# Compile and start Spring Boot application
./mvnw spring-boot:run
```
*The API will start running at `http://localhost:8080`*

### Run Backend Unit & Integration Tests
```bash
./mvnw test
```

---

## 🗄️ Database Access (H2 Console / MySQL)

### H2 Console (Default In-Memory Database)
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:issuedb`
- **Username**: `sa`
- **Password**: *(leave empty)*

### MySQL Workbench Configuration
To use MySQL instead of H2, update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/issue_management_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## 🌐 API Endpoints Reference

| HTTP Method | Endpoint | Description | Request Body Example | Status Code |
|---|---|---|---|---|
| `POST` | `/api/issues` | Create a new issue | `{"title": "Fix login bug", "description": "Auth error", "priority": "HIGH", "status": "OPEN", "assignee": "Alice"}` | `201 Created` |
| `GET` | `/api/issues` | Fetch all issues | None | `200 OK` |
| `GET` | `/api/issues/{id}` | Fetch single issue by ID | None | `200 OK` / `404 Not Found` |
| `PUT` | `/api/issues/{id}` | Update issue details/status | `{"title": "Fix login bug", "description": "Resolved in PR #42", "priority": "HIGH", "status": "RESOLVED", "assignee": "Alice"}` | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/issues/{id}` | Delete issue by ID | None | `204 No Content` / `404 Not Found` |
| `GET` | `/api/issues/priority/{priority}` | Filter issues by priority (`LOW`, `MEDIUM`, `HIGH`) | None | `200 OK` |
| `GET` | `/api/issues/status/{status}` | Filter issues by status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) | None | `200 OK` |

---

## 🧪 API Testing with Postman
Import the provided Postman collection file into Postman:
- File path: `./Issue_Management_System.postman_collection.json`
