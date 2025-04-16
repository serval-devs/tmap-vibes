*** Settings ***
Documentation     Language detection feature tests
Resource          language-keywords.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://localhost:5175/
${BROWSER}        Chrome

*** Test Cases ***
Scenario: Submit an English (American) article
    Given the user is on the fake news detector page
    When the user submits article file    tests/resources/american_article.txt
    Then the article should be accepted and analyzed

Scenario: Submit a Dutch article
    Given the user is on the fake news detector page
    When the user submits article file    tests/resources/dutch_article.txt
    Then the system should reject the article due to non-English language

Scenario: Submit an English article with Spanish words
    Given the user is on the fake news detector page
    When the user submits article file    tests/resources/spanglish_article.txt
    Then the system should reject the article due to non-English language

Scenario: Submit an article with English and Dutch mixed
    Given the user is on the fake news detector page
    When the user submits article file    tests/resources/mixed_language_article.txt
    Then the system should reject the article due to non-English language
