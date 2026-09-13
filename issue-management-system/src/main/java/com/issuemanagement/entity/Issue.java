package com.issuemanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;


    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    private Priority priority;


    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private Status status;


    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private String assignee;


    public Issue() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }


    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }


    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }


    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }


    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }


    @PrePersist
    public void onCreate() {

        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();

    }


    @PreUpdate
    public void onUpdate() {

        updatedDate = LocalDateTime.now();

    }

}