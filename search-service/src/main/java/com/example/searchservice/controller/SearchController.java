// SearchController.java
package com.example.searchservice.controller;

import com.example.searchservice.service.SearchService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;

@Path("/api/search")
@Produces(MediaType.APPLICATION_JSON)
public class SearchController {

    @Inject
    SearchService searchService;

    @GET
    @Path("/patients")
    public Uni<?> searchPatientsByName(@QueryParam("name") @NotBlank String name) {
        return searchService.searchPatientsByName(name);
    }

    @GET
    @Path("/patients/by-condition")
    public Uni<?> searchPatientsByCondition(@QueryParam("condition") @NotBlank String condition) {
        return searchService.searchPatientsByCondition(condition);
    }

    @GET
    @Path("/patients/advanced")
    public Uni<?> advancedPatientSearch(@QueryParam("name") String name,
                                        @QueryParam("status") String status,
                                        @QueryParam("doctorUserId") Long doctorUserId) {
        return searchService.advancedPatientSearch(name, status, doctorUserId);
    }

    @GET
    @Path("/doctor/{doctorUserId}/patients")
    public Uni<?> getPatientsForDoctor(@PathParam("doctorUserId") Long doctorUserId) {
        return searchService.getPatientsForDoctor(doctorUserId);
    }

    @GET
    @Path("/doctor/{doctorUserId}/encounters-by-day")
    public Uni<?> getEncountersForDoctorPatientsByDay(@PathParam("doctorUserId") Long doctorUserId,
                                                      @QueryParam("date") @DefaultValue("2026-03-16") String date) {
        return searchService.getEncountersForDoctorPatientsByDay(doctorUserId, LocalDate.parse(date));
    }

    @GET
    @Path("/doctor/{doctorUserId}/overview-by-day")
    public Uni<?> getDoctorPatientsWithEncounters(@PathParam("doctorUserId") Long doctorUserId,
                                                  @QueryParam("date") @DefaultValue("2026-03-16") String date) {
        return searchService.getDoctorPatientsWithEncounters(doctorUserId, LocalDate.parse(date));
    }
}