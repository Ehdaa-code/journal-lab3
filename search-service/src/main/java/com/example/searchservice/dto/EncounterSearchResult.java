package com.example.searchservice.dto;

import java.time.LocalDateTime;

public class EncounterSearchResult {

    public Long encounterId;
    public Long patientId;
    public LocalDateTime encounterDate;
    public String type;
    public String reason;
    public String summary;
    public Long createdByUserId;

    public EncounterSearchResult() {
    }

    public EncounterSearchResult(Long encounterId,
                                 Long patientId,
                                 LocalDateTime encounterDate,
                                 String type,
                                 String reason,
                                 String summary,
                                 Long createdByUserId) {
        this.encounterId = encounterId;
        this.patientId = patientId;
        this.encounterDate = encounterDate;
        this.type = type;
        this.reason = reason;
        this.summary = summary;
        this.createdByUserId = createdByUserId;
    }
}