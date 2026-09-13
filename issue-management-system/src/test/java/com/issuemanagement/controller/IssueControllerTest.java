package com.issuemanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.issuemanagement.entity.Issue;
import com.issuemanagement.entity.Priority;
import com.issuemanagement.entity.Status;
import com.issuemanagement.exception.IssueNotFoundException;
import com.issuemanagement.service.IssueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IssueController.class)
class IssueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IssueService issueService;

    @Autowired
    private ObjectMapper objectMapper;

    private Issue sampleIssue;

    @BeforeEach
    void setUp() {
        sampleIssue = new Issue();
        sampleIssue.setId(1L);
        sampleIssue.setTitle("Backend API Latency");
        sampleIssue.setDescription("Investigate response times > 500ms");
        sampleIssue.setPriority(Priority.HIGH);
        sampleIssue.setStatus(Status.OPEN);
        sampleIssue.setAssignee("John Doe");
    }

    @Test
    void createIssue_Returns201Created() throws Exception {
        when(issueService.createIssue(any(Issue.class))).thenReturn(sampleIssue);

        mockMvc.perform(post("/api/issues")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleIssue)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Backend API Latency"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void createIssue_InvalidTitle_Returns400BadRequest() throws Exception {
        Issue invalid = new Issue();
        invalid.setTitle(""); // blank title violates @NotBlank validation
        invalid.setPriority(Priority.LOW);
        invalid.setStatus(Status.OPEN);

        mockMvc.perform(post("/api/issues")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllIssues_Returns200OK() throws Exception {
        List<Issue> issues = Arrays.asList(sampleIssue);
        when(issueService.getAllIssues()).thenReturn(issues);

        mockMvc.perform(get("/api/issues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Backend API Latency"));
    }

    @Test
    void getIssueById_Success_Returns200OK() throws Exception {
        when(issueService.getIssueById(1L)).thenReturn(sampleIssue);

        mockMvc.perform(get("/api/issues/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Backend API Latency"));
    }

    @Test
    void getIssueById_NotFound_Returns404() throws Exception {
        when(issueService.getIssueById(99L))
                .thenThrow(new IssueNotFoundException("Issue not found with id: 99"));

        mockMvc.perform(get("/api/issues/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Issue not found with id: 99"));
    }

    @Test
    void updateIssue_Success_Returns200OK() throws Exception {
        when(issueService.updateIssue(eq(1L), any(Issue.class))).thenReturn(sampleIssue);

        mockMvc.perform(put("/api/issues/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleIssue)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void deleteIssue_Returns204NoContent() throws Exception {
        doNothing().when(issueService).deleteIssue(1L);

        mockMvc.perform(delete("/api/issues/1"))
                .andExpect(status().isNoContent());

        verify(issueService, times(1)).deleteIssue(1L);
    }

    @Test
    void getIssuesByPriority_Returns200OK() throws Exception {
        when(issueService.getIssuesByPriority(Priority.HIGH)).thenReturn(List.of(sampleIssue));

        mockMvc.perform(get("/api/issues/priority/HIGH"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].priority").value("HIGH"));
    }

    @Test
    void getIssuesByStatus_Returns200OK() throws Exception {
        when(issueService.getIssuesByStatus(Status.OPEN)).thenReturn(List.of(sampleIssue));

        mockMvc.perform(get("/api/issues/status/OPEN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("OPEN"));
    }
}
