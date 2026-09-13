package com.issuemanagement.service;

import com.issuemanagement.entity.Issue;
import com.issuemanagement.entity.Priority;
import com.issuemanagement.entity.Status;

import java.util.List;

public interface IssueService {

    Issue createIssue(Issue issue);

    List<Issue> getAllIssues();

    Issue getIssueById(Long id);

    Issue updateIssue(Long id, Issue issue);

    void deleteIssue(Long id);

    List<Issue> getIssuesByPriority(Priority priority);

    List<Issue> getIssuesByStatus(Status status);

}