Feature: Recruitment: Candidates functionality

    Background: Prerequisites
        Given Login as Admin
        And   Prepare Candidate data with Application Initiated status
        And   The user open Candidates page

    Scenario: Candidates - The user should be able to mark the interview result as Passed
        Given The user change candidate status to "InterviewScheduled"
        And   The user open edit candidate page
        When  The user mark interview result as "Pass"
        Then  The candidate status should be changed to Interview "Passed"
        And   The user should be able to see all available buttons

    Scenario: Candidates - The user should be able to mark the interview result as Failed
        Given The user change candidate status to "InterviewScheduled"
        And   The user open edit candidate page
        When  The user mark interview result as "Fail"
        Then  The candidate status should be changed to Interview "Failed"
        And   The user should be able to see all available buttons

    Scenario: Candidates - The user should be able to upload a Resume (txt file) for the Application Initiated status
        Given The user open edit candidate page
        When  The user should be able to upload a Resume - txt file
        And   The user should be able to download uploaded Resume
        Then  The user should see the same content as in the uploaded Resume

    Scenario: Candidates - The user should be able to upload a Resume (txt file) for the Hired status
        Given The user change candidate status to "Hired"
        And   The user open edit candidate page
        When  The user should be able to upload a Resume - txt file
        And   The user should be able to download uploaded Resume
        Then  The user should see the same content as in the uploaded Resume
