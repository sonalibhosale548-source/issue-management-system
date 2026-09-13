package com.issuemanagement.service;

import com.issuemanagement.entity.Issue;
import com.issuemanagement.entity.Priority;
import com.issuemanagement.entity.Status;
import com.issuemanagement.repository.IssueRepository;
import org.springframework.stereotype.Service;
import com.issuemanagement.exception.IssueNotFoundException;

import java.util.List;

@Service
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;

    public IssueServiceImpl(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }


    private Long generateNextId() {
        List<Issue> all = issueRepository.findAll();
        java.util.Set<Long> existingIds = all.stream()
                .map(Issue::getId)
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        long nextId = 1L;
        while (existingIds.contains(nextId)) {
            nextId++;
        }
        return nextId;
    }

    @Override
    public Issue createIssue(Issue issue) {
        if (issue.getId() == null) {
            issue.setId(generateNextId());
        }
        return issueRepository.save(issue);
    }


    @Override
    public List<Issue> getAllIssues() {

        return issueRepository.findAll();

    }


    @Override
    public Issue getIssueById(Long id) {

        return issueRepository.findById(id)
                .orElseThrow(() -> new IssueNotFoundException("Issue not found with id: " + id));

    }


    @Override
    public Issue updateIssue(Long id, Issue issue) {

        Issue existingIssue = getIssueById(id);

        existingIssue.setTitle(issue.getTitle());
        existingIssue.setDescription(issue.getDescription());
        existingIssue.setPriority(issue.getPriority());
        existingIssue.setStatus(issue.getStatus());
        existingIssue.setAssignee(issue.getAssignee());

        return issueRepository.save(existingIssue);

    }


    @Override
    public void deleteIssue(Long id) {

        Issue issue = getIssueById(id);

        issueRepository.delete(issue);

    }


    @Override
    public List<Issue> getIssuesByPriority(Priority priority) {

        return issueRepository.findByPriority(priority);

    }


    @Override
    public List<Issue> getIssuesByStatus(Status status) {

        return issueRepository.findByStatus(status);

    }

}