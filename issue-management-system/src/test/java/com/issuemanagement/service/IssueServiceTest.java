package com.issuemanagement.service;

import com.issuemanagement.entity.Issue;
import com.issuemanagement.entity.Priority;
import com.issuemanagement.entity.Status;
import com.issuemanagement.exception.IssueNotFoundException;
import com.issuemanagement.repository.IssueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @InjectMocks
    private IssueServiceImpl issueService;

    private Issue issue1;
    private Issue issue2;

    @BeforeEach
    void setUp() {
        issue1 = new Issue();
        issue1.setId(1L);
        issue1.setTitle("Fix login bug");
        issue1.setDescription("OAuth authentication token expires prematurely");
        issue1.setPriority(Priority.HIGH);
        issue1.setStatus(Status.OPEN);
        issue1.setAssignee("Alice");

        issue2 = new Issue();
        issue2.setId(2L);
        issue2.setTitle("UI button alignment");
        issue2.setDescription("Submit button misaligned on mobile layout");
        issue2.setPriority(Priority.LOW);
        issue2.setStatus(Status.IN_PROGRESS);
        issue2.setAssignee("Bob");
    }

    @Test
    void createIssue_Success() {
        when(issueRepository.save(any(Issue.class))).thenReturn(issue1);

        Issue created = issueService.createIssue(issue1);

        assertNotNull(created);
        assertEquals("Fix login bug", created.getTitle());
        assertEquals(Priority.HIGH, created.getPriority());
        verify(issueRepository, times(1)).save(issue1);
    }

    @Test
    void createIssue_WhenNullId_AssignsSmallestAvailableId() {
        Issue newIssue = new Issue();
        newIssue.setTitle("New issue without ID");
        newIssue.setPriority(Priority.MEDIUM);
        newIssue.setStatus(Status.OPEN);

        when(issueRepository.findAll()).thenReturn(List.of());
        when(issueRepository.save(any(Issue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Issue created = issueService.createIssue(newIssue);

        assertNotNull(created);
        assertEquals(1L, created.getId());
    }

    @Test
    void getAllIssues_ReturnsList() {
        when(issueRepository.findAll()).thenReturn(Arrays.asList(issue1, issue2));

        List<Issue> issues = issueService.getAllIssues();

        assertEquals(2, issues.size());
        verify(issueRepository, times(1)).findAll();
    }

    @Test
    void getIssueById_Success() {
        when(issueRepository.findById(1L)).thenReturn(Optional.of(issue1));

        Issue found = issueService.getIssueById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
        assertEquals("Fix login bug", found.getTitle());
    }

    @Test
    void getIssueById_NotFound_ThrowsException() {
        when(issueRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IssueNotFoundException.class, () -> issueService.getIssueById(99L));
    }

    @Test
    void updateIssue_Success() {
        when(issueRepository.findById(1L)).thenReturn(Optional.of(issue1));
        when(issueRepository.save(any(Issue.class))).thenReturn(issue1);

        Issue updatedDetails = new Issue();
        updatedDetails.setTitle("Updated Title");
        updatedDetails.setDescription("Updated Description");
        updatedDetails.setPriority(Priority.MEDIUM);
        updatedDetails.setStatus(Status.RESOLVED);
        updatedDetails.setAssignee("Charlie");

        Issue updated = issueService.updateIssue(1L, updatedDetails);

        assertNotNull(updated);
        verify(issueRepository, times(1)).save(any(Issue.class));
    }

    @Test
    void deleteIssue_Success() {
        when(issueRepository.findById(1L)).thenReturn(Optional.of(issue1));
        doNothing().when(issueRepository).delete(issue1);

        assertDoesNotThrow(() -> issueService.deleteIssue(1L));

        verify(issueRepository, times(1)).delete(issue1);
    }

    @Test
    void getIssuesByPriority_ReturnsFilteredList() {
        when(issueRepository.findByPriority(Priority.HIGH)).thenReturn(List.of(issue1));

        List<Issue> result = issueService.getIssuesByPriority(Priority.HIGH);

        assertEquals(1, result.size());
        assertEquals(Priority.HIGH, result.get(0).getPriority());
    }

    @Test
    void getIssuesByStatus_ReturnsFilteredList() {
        when(issueRepository.findByStatus(Status.OPEN)).thenReturn(List.of(issue1));

        List<Issue> result = issueService.getIssuesByStatus(Status.OPEN);

        assertEquals(1, result.size());
        assertEquals(Status.OPEN, result.get(0).getStatus());
    }
}
