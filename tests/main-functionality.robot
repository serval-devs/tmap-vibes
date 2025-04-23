*** Settings ***
Documentation   Test suite to check article analysis functionality
Library         SeleniumLibrary
Resource        language-keywords.robot
Variables       variables.py

*** Test Cases ***
Check Article Text Can Be Submitted and Analyzed
    [Documentation]    Test that user can enter text, analyze, see results, and history gets updated.
    Open Browser To App

    Given the user is on the fake news detector page

    Add text into content fields

    Wait untill button is visible

    Then the article should be accepted and analyzed

    Then wait for history to update for first item

    add another text into content fields

    Wait untill button is visible

    Then the article should be accepted and analyzed

    Then wait for history to update for second item

    Select the first item in history and check contents

    Clear History And Verify

    Close Browser