package com.issuemanagement.controller;

import com.issuemanagement.entity.Issue;
import com.issuemanagement.entity.Priority;
import com.issuemanagement.entity.Status;
import com.issuemanagement.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:4200")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Issue> createIssue(
            @Valid @RequestBody Issue issue) {

        Issue createdIssue = issueService.createIssue(issue);

        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {

        return ResponseEntity.ok(issueService.getAllIssues());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(
            @PathVariable Long id) {

        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(
            @PathVariable Long id,
            @Valid @RequestBody Issue issue) {

        return ResponseEntity.ok(
                issueService.updateIssue(id, issue)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable Long id) {

        issueService.deleteIssue(id);

        return ResponseEntity.noContent().build();
    }

    // FILTER BY PRIORITY
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Issue>> getIssuesByPriority(
            @PathVariable Priority priority) {

        return ResponseEntity.ok(
                issueService.getIssuesByPriority(priority)
        );
    }

    // FILTER BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Issue>> getIssuesByStatus(
            @PathVariable Status status) {

        return ResponseEntity.ok(
                issueService.getIssuesByStatus(status)
        );
    }
}