package com.issuemanagement.repository;

import com.issuemanagement.entity.Issue;
import com.issuemanagement.entity.Priority;
import com.issuemanagement.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByPriority(Priority priority);

    List<Issue> findByStatus(Status status);

}